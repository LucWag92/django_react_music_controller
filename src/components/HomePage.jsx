import React, { useEffect, useState } from "react";
import CreateRoomPage from "./CreateRoomPage";
import JoinRoomPage from "./JoinRoomPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Redirect,
  Route,
} from "react-router-dom";

console.log("HP: " + BASE_URL);

export default (props) => {
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/user-in-room`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.code);
        setRoomCode(data.code);
      });
  }, []);

  const renderHomePage = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            Mukke Buzze
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join a Room
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  };
  return (
    <Router>
      <Switch>
        <Route
          exact
          path={"/"}
          render={() => {
            return roomCode ? (
              <Redirect to={`/room/${roomCode}`} />
            ) : (
              renderHomePage()
            );
          }}
        />
        <Route path={"/join"} component={JoinRoomPage} />
        <Route path={"/create"} component={CreateRoomPage} />
        <Route
          path={"/room/:roomCode"}
          render={(props) => (
            <Room {...props} leaveRoomCallback={setRoomCode} />
          )}
        />
      </Switch>
    </Router>
  );
};
