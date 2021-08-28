import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import Error from "./Error";
import { useHistory } from "react-router";
import { Button } from "@material-ui/core";
import Signup from "./Signup";
import {
  TextField,
  makeStyles,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Container,
  CardMedia,
  Typography,
} from "@material-ui/core";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const history = useHistory();
  const value = useContext(AuthContext);

  useEffect(() => {
    if (value.user !== null) {
      history.push("/");
    }
    setLoading(false);
  }, [history, value.user]);

  let useStyles = makeStyles({
    centerDivs: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      width: "100vw",
      alignItems: "center",
      // paddingLeft: "10vw",
      // paddingRight: "10vw",
    },
    crousel: {
      height: "10rem",
      backgroundColor: "lightgray",
    },
    fullWidth: {
      width: "100%",
    },
    centerElements: {
      display: "flex",
      flexDirection: "column",
    },
    mb: {
      marginBottom: "0.5rem",
    },
    alignCenter: {
      justifyContent: "center",
    },
    // alignitems: {
    //     textAlign: "center"
    // },
    image: {
      height: "6rem",
      backgroundSize: "contain",
    },
  });

  const handleSubmit = async () => {
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
    if (email === "") {
      setType("warning");

      setError("Enter email please!");
      setTimeout(() => {
        setError(null);
        setType(null);
      }, 5000);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      let userData = await value.login(email, password);
      console.log(userData);
      history.push("/");
    } catch (err) {
      setError(err);
      setType("error");
      setTimeout(() => {
        setError("");
        setType("");
      }, 5000);
    }
    setLoading(false);
    setEmail("");
    setPassword("");
  };
  let classes = useStyles();

  return loader === true ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "100px",
      }}
    >
      <div className="loader"></div>
    </div>
  ) : (
    <>
      {error !== null && error.length > 0 ? (
        <Error type={type} message={error} />
      ) : null}
      <div className={classes.centerDivs}>
        <Container>
          <Grid container className={classes.alignCenter} spacing={2}>
            <Grid item sm={5}>
              <Card variant="outlined">
                <CardMedia
                  image="./images/instaLogo.svg"
                  className={classes.image}
                />
                <CardContent className={classes.centerElements}>
                  <TextField
                    id="outlined-basic"
                    label="E-mail"
                    type="email"
                    variant="outlined"
                    value={email}
                    size="small"
                    display="block"
                    className={classes.mb}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    size="small"
                    className={classes.mb}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    display="block"
                  />
                  <LinkButton
                    content="Forgot Password?"
                    route="/signup"
                  ></LinkButton>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmit}
                    disabled={loader}
                    className={classes.fullWidth}
                  >
                    Login
                  </Button>
                </CardActions>
              </Card>
              <Card variant="outlined">
                <Typography style={{ textAlign: "center" }}>
                  Not registered?
                  <LinkButton content="Signup" route="/signup"></LinkButton>
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
}

function LinkButton(prop) {
  return (
    <Button variant="text" style={{ color: "blue" }}>
      <Link to={prop.route}>{prop.content}</Link>
    </Button>
  );
}

export default Login;
