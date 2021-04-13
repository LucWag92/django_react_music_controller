import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Textfield from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link } from "react-router-dom";
import { Collapse } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export default (props) => {
  const defaultVotes = 2;
  const {
    update = false,
    votesToSkip_props = defaultVotes,
    guestCanPause_props = false,
    roomCode = null,
    updateCallback = () => {},
  } = props;
  const [guestCanPause, setGuestCanPause] = useState(guestCanPause_props);
  const [updateOKMsg, setUpdateOKMsg] = useState(null);
  const [updateERMsg, setUpdateERMsg] = useState(null);
  const [votesToSkip, setVotesToSkip] = useState(votesToSkip_props);
  const headerText = update ? `Change Room: ${roomCode}` : "Create Room";

  const handleCreateRoomButtonPressed = () => {
    console.log("Create Room");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };
    fetch(`${BASE_URL}/api/create-room`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        props.history.push("/room/" + data.code);
      });
  };

  const handleUpdateRoomButtonPressed = () => {
    console.log("Update Room");
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: roomCode,
      }),
    };
    fetch(`${BASE_URL}/api/update-room`, requestOptions)
      .then((response) => {
        if (response.ok) {
          setUpdateOKMsg("Room updated successfully");
        } else {
          setUpdateERMsg("Error updating room... ");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        updateCallback();
      });
  };

  const fncButtonClick = update
    ? handleUpdateRoomButtonPressed
    : handleCreateRoomButtonPressed;

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={!!updateOKMsg || !!updateERMsg}>
          <Alert
            severity={!!updateOKMsg ? "success" : "error"}
            onClose={
              !!updateOKMsg
                ? () => setUpdateOKMsg(null)
                : () => setUpdateERMsg(null)
            }
          >
            {!!updateOKMsg ? updateOKMsg : updateERMsg}
          </Alert>
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {headerText}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={guestCanPause.toString()}
            onChange={(e) => {
              setGuestCanPause(e.target.value);
            }}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <Textfield
            required={true}
            type="number"
            defaultValue={votesToSkip}
            inputProps={{ min: 1, style: { textAlign: "center" } }}
            onChange={(e) => setVotesToSkip(e.target.value)}
          />
          <FormHelperText>
            <div align="center">Votes Required to skip</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="primary" variant="contained" onClick={fncButtonClick}>
          {headerText}
        </Button>
      </Grid>
      {!update && (
        <Grid item xs={12} align="center">
          <Button
            color="secondary"
            variant="contained"
            to={"/"}
            component={Link}
          >
            Back
          </Button>
        </Grid>
      )}
    </Grid>
  );
};
