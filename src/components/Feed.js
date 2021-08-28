import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { db, storage } from "./firebase";
import uuid from "react-uuid";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Reel from "./Reel";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

const Feed = () => {
  const value = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [change, setChange] = useState(false);
  const [videos, setVideos] = useState(null);
  let user = value.user;
  console.log(user);

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    upload: {
      marginRight: "5px",
    },
  }));

  const classes = useStyles();

  useEffect(() => {
    let getdata = () => {
      db.users
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setData(doc.data());
          }
        });

      console.log(data);
    };
    getdata();
    let getAllVideos = async () => {
      let arr = [];
      try {
        let videoData = await db.posts.orderBy("createdAt", "asc").get();
        console.log(videoData);
        videoData.docs.forEach((v) => {
          arr.push(v.data());
        });
        setVideos(arr);
      } catch (err) {
        alert(err);
      }
    };
    getAllVideos();
  }, [change]);

  const uploadVideo = async (e) => {
    let video = e.target.files[0];

    if (video !== null) {
      try {
        let videoUrl = null;

        let snapshot = await storage.ref(`/users/videos/${uuid()}`).put(video);

        let url = await snapshot.ref.getDownloadURL();

        videoUrl = url;

        console.log(videoUrl);
        console.log(data);
        if (videoUrl != null) {
          let pid = uuid();
          let obj = {
            "Author": data.username,
            "createdAt": db.timeStamp(),
            "url": videoUrl,
            "likes": [],
            "id": pid,
            "comments": [],
          };
          console.log(pid);
          console.log(obj);
          await db.posts.doc(pid).set(obj);
          let newPostIds = [...data.postIds, pid];

          await db.users.doc(user.uid).update({
            postIds: newPostIds,
          });
          setChange(!change);
        }
      } catch (err) {
        console.log("Some error occured");
      }
    } else {
      alert("First Select a File");
    }
  };

  return (
    <div>
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              React Reels
            </Typography>

            <Button
              variant="contained"
              color="default"
              size="small"
              className={classes.upload}
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Upload Reel
              <input type="file" hidden onChange={(e) => uploadVideo(e)} />
            </Button>
            <div className="logout1">
              <Button
                onClick={() => value.logout()}
                startIcon={<ExitToAppIcon />}
                size="small"
                color="inherit"
              >
                Logout
              </Button>
            </div>
            <div className="logout2">
              <Button
                className="logout2"
                onClick={() => value.logout()}
                startIcon={<ExitToAppIcon />}
              ></Button>
            </div>
          </Toolbar>
        </AppBar>
      </div>

      <div className="feedContainer">
        {videos &&
          videos.map((obj, index) => {
            return (
              <div style={{ margin: "10px 0" }} key={index}>
                <Reel userData={data} obj={obj} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Feed;
