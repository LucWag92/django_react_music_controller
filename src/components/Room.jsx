import React, { useState, useEffect } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default (props) => {
  const { leaveRoomCallback } = props;
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [roomCode, setRoomCode] = useState(props.match.params.roomCode);
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticate] = useState(false);
  const [song, setSong] = useState({});

  const getCurrentSong = () => {
    fetch(`${BASE_URL}/spotify/current-song`, { credentials: "include" })
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        console.log("Current Song");
        console.log(data);
        setSong(data);
      });
  };
  const authenticateSpotify = () => {
    fetch(`${BASE_URL}/spotify/is-authenticated`, { credentials: "include" })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setIsSpotifyAuthenticate(data.status);
        if (!data.status) {
          fetch(`${BASE_URL}/spotify/get-auth-url`)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };
  const getRoomDetails = () => {
    fetch(`${BASE_URL}/api/get-room` + "?code=" + roomCode, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          console.log("Room Info not found. --> Back to HomePage");
          leaveRoomCallback(null);
          props.history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
      });
  };

  useEffect(() => {
    getRoomDetails();
    const interval = setInterval(getCurrentSong, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    console.log(isHost);
    if (isHost) {
      authenticateSpotify();
    }
  }, [isHost]);

  const leaveRoom = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`${BASE_URL}/api/leave-room`, requestOptions).then((response) => {
      leaveRoomCallback(null);
      props.history.push("/");
    });
  };
  return (
    <React.Fragment>
      {!showSettings && (
        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
            <Typography variant="h4" component="h4">
              Code: {roomCode}
            </Typography>
          </Grid>
          <MusicPlayer {...song} />
          {isHost && (
            <Grid item xs={12} align="center">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowSettings(true)}
              >
                Show Settings
              </Button>
            </Grid>
          )}
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => leaveRoom()}
            >
              Leave Room
            </Button>
          </Grid>
        </Grid>
      )}
      {showSettings && (
        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
            <CreateRoomPage
              update={true}
              votesToSkip_props={votesToSkip}
              guestCanPause_props={guestCanPause}
              roomCode={roomCode}
              updateCallback={getRoomDetails}
            />
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowSettings(false)}
            >
              Close Settings
            </Button>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
};
