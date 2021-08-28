import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { db, storage } from "./firebase";
import { Link, useHistory } from "react-router-dom";
import Error from "./Error";
import { Button, TextField, makeStyles, Grid, Paper } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const Signup = (props) => {
  let value = useContext(AuthContext);
  let history = useHistory();
  const useStyles = makeStyles({
    centerDivs: {
      width: "80vw",
      margin: "0 auto",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "center",
    },
  });

  let classes = useStyles();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (value.user !== null) {
      history.push("/");
    }
    setLoading(false);
  }, []);

  const submitHandler = async () => {
    setLoading(true);
    if (name === "" || email === "" || password === "") {
      setType("warning");
      setError("Please fill in all the fields !");
      setTimeout(() => {
        setError(null);
        setType(null);
      }, 5000);
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setType("warning");

      setError("Password must contain 8 characters!");
      setTimeout(() => {
        setError(null);
        setType(null);
      }, 5000);
      setLoading(false);
      return;
    }
    try {
      let userData = await value.signup(email, password);
      let uid = userData.user.uid;

      let profileImageUrl = null;

      if (file !== null) {
        let storageRef = await storage
          .ref(`/users/profileImage/${uid}`)
          .put(file);

        let url = await storageRef.ref.getDownloadURL();
        profileImageUrl = url;
        console.log(profileImageUrl);
      }

      // console.log(userData);
      console.log(uid);
      await db.users.doc(uid).set({
        username: name,
        email: email,
        profileURL: profileImageUrl,
        createdAt: db.timeStamp(),
        postIds: [],
      });
      history.push("/");
      console.log("done")
    } catch (err) {
      console.log("Error");
      setType("error");
      setError(err);
      setTimeout(() => {
        setError(null);
        setType(null);
      }, 5000);
    }
    setEmail(null);
    setName(null);
    setFile(null);
    setPassword(null);
    setLoading(false);
  };

  return loading === true ? (
    <div
      style={{
        marginTop: "100px",
      }}
    >
      <div className="loader"></div>
    </div>
  ) : (
    <div>
      {error !== null && error.length > 0 ? (
        <Error type={type} message={error} />
      ) : null}
      <div style={{ textAlign: "center", marginTop: "20px", fontWeight: "5px" }}>
        <img
          src="./images/instaLogo.svg"
          style={{ height: "150px" }}
        />
      </div>
      <div className={classes.centerDivs}>
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12} style={{ width: "100%", margin: "auto", padding: "0px" }}>
            <div className={classes.form}>
              <TextField
                id="name-input"
                label="Name"
                display="block"
                type="text"
                required
                variant="outlined"
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                id="email-input"
                display="block"
                label="Email"
                type="email"
                required
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                id="password-input"
                display="block"
                label="Password"
                type="password"
                autoComplete="current-password"
                required
                variant="outlined"
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                variant="contained"
                color="default"
                size="small"
                className={classes.upload}
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  onChange={(e) => setFile(e?.target?.files[0])}
                />
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={() => submitHandler()}
              >
                Sign up
              </Button>
              <Link to="/login">Already have an account? Login</Link>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
export default Signup;