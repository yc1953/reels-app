import React, { useState, useEffect } from 'react';
import { Avatar } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import uuid from 'react-uuid';
import { db } from './firebase';

const Comments = (props) => {
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Comment, setComment] = useState('');
  const [change, setChange] = useState(false);

  const submitComment = async (e) => {
    if (Comment.length > 0) {
      try {
        let userData = props.userData;
        let profileImageUrl = userData.profileImageUrl;
        let Author = userData.name;
        let authorId = props.user.uid;
        let id = uuid();

        let obj = {
          Author,
          id,
          authorId,
          comment: Comment,
          profileImageUrl,
        };
        setAllComments([...allComments, obj]);
        // console.log(obj);
        await db.posts.doc(props.obj.id).update({
          comments: [...allComments, obj],
        });
      } catch (err) {
        alert(err);
      }
    } else {
      alert('comment must contain something!');
    }
    setComment('');
  };

  const deleteComment = async (id) => {
    let idx = allComments.findIndex((comment) => comment.id === id);
    let newCommentsArr = allComments;
    allComments.splice(idx, 1);
    setAllComments(newCommentsArr);
    setChange(!change);
    try {
      await db.posts.doc(props.obj.id).update({
        comments: allComments,
      });
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    setLoading(true)
    setAllComments(props.allComments);
    console.log('Comments useffect');
    setLoading(false);
  }, []);

  return loading === true ? (
    <p>Loading...</p>
  ) : (
    <div>
      <div style={{ height: '88px', overflow: 'auto' }}>
        {allComments.map((comment) => {
          return (
            <div key={comment.id}>
              <div style={{ display: 'flex',justifyContent:"space-between" }}>
                <div style={{display:"flex",justifyContent:"space-between",alignContent:"center",width:"20%"}}>
                <Avatar src={comment.profileImageUrl} />
                <p style={{fontSize:"80%",fontWeight:"700"}}>{comment.Author}</p>
                </div>
              
                {comment.authorId === props.user.uid ? (
                  <DeleteIcon
                    size='small'
                    onClick={() => deleteComment(comment.id)}
                  />
                ) : null}
              </div>
              <p style={{ textAlign: 'left' }}>{comment.comment}</p>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex',marginBottom:"10px" }}>
        <input
          placeholder='add a comment'
          style={{ width: '100%' }}
          type='text'
          value={Comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <SendIcon onClick={(e) => submitComment(e)} />
      </div>
    </div>
  );
};

export default Comments;
