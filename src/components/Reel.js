import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { db } from "./firebase";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import CommentIcon from "@material-ui/icons/Comment";

import { makeStyles } from "@material-ui/core/styles";
import Comments from "./Comments";

const Reel = (props) => {
  const useStyles = makeStyles({
    collapse: {
      maxHeight: "200px",
    },
  });
  const classes = useStyles();
  const value = useContext(AuthContext);

  const user = value.user;
  let seconds = props.obj.createdAt;
  let date = new Date(seconds.seconds * 1000);

  const [loading, setLoading] = useState(false);
  const [like, setLike] = useState(false);
  const [noOfLikes, setNoOfLikes] = useState(0);
  const [commentsArr, setCommentsArr] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const openHandler = () => {
    setOpen(!open);
  };

  const setLikeHandler = async (e) => {
    if (like === false) {
      setLike(true);
      try {
        setLike(true);
        setNoOfLikes(noOfLikes + 1);
        await db.posts.doc(props.obj.id).update({
          likes: [...props.obj.likes, user.uid],
        });
        console.log("successfully updated");
      } catch (err) {
        console.log(err);
      }
    } else {
      setLike(false);
      try {
        let newArr = props.obj.likes;
        let idx = newArr.findIndex((ele) => ele === user.id);
        newArr.splice(idx, 1);
        setLike(false);
        setNoOfLikes(noOfLikes - 1);
        await db.posts.doc(props.obj.id).update({
          likes: newArr,
        });
        console.log("successfully updated");
      } catch (err) {
        console.log(err);
      }
    }
  };

  function callback(entries) {
    entries.forEach((entry) => {
      console.log("called");
      let child = entry.target.firstElementChild;
      child.play().then(() => {
        if (entry.isIntersecting === false) {
          child.pause();
        }
      });
      //   console.log(child.id);
    });
  }

  useEffect(() => {
    let conditionObj = {
      root: null,
      threshold: 0.8,
    };

    let observer = new IntersectionObserver(callback, conditionObj);
    let allVideoElements = document.querySelectorAll(".video-element");
    allVideoElements.forEach((video) => {
      observer.observe(video);
    });
    function loadChanges() {
      let isLiked = props.obj.likes.includes(user.uid);
      if (isLiked === true) {
        setLike(true);
      }
      setNoOfLikes(props.obj.likes.length);
      setCommentsArr(props.obj.comments);

      console.log(props.obj.comments);
    }
    loadChanges();
    console.log("Reel useEffect ran");
  }, []);

  return (
    <div>
      <div className="video-element">
        <video id="myVideo" controls autoPlay={true} loop={true}>
          <source src={props.obj.url} type="video/mp4"></source>
        </video>
      </div>

      <div style={{ textAlign: "left" }}>
        <span>
          {" "}
          {like === false ? (
            <FavoriteBorderIcon onClick={(e) => setLikeHandler(e)} />
          ) : (
            <FavoriteIcon
              style={{ fill: "red" }}
              onClick={(e) => setLikeHandler(e)}
            />
          )}
        </span>
        <span style={{ marginLeft: "15px" }}>
          <CommentIcon onClick={openHandler} />
        </span>
        <div
          style={{
            float: "right",
            fontSize: "75%",
            display: "inline-block",
            right: "0",
          }}
        >
          <i>
            <span>uploaded on: </span>
            <strong>{getDate(date)}</strong>
          </i>
        </div>
      </div>
      <div style={{ textAlign: "left" }}>
        <strong>
          <span>{noOfLikes}</span>{" "}
          {noOfLikes < 2 ? <span>like</span> : <span>likes</span>}
        </strong>
      </div>
      {open === true ? (
        <div style={{ height: "150px" }}>
          <h4 style={{ textAlign: "left" }}>Comments section</h4>

          <Comments
            allComments={commentsArr}
            user={user}
            userData={props.userData}
            obj={props.obj}
          />
        </div>
      ) : null}
    </div>
  );
};
export default Reel;

function getDate(dateString) {
  let day = dateString.getDate();
  let month = dateString.getMonth();

  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  let year = dateString.getFullYear();
  // year = toString(year);
  // year = year.slice(2);
  month = monthNames[month];
  let fullDate = `${day} ${month} ${year}`;
  return fullDate;
}
