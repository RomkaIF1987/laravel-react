import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";

function UserEditPopup({ setPopupShow, popupShow }) {
  const handleClose = () => {
    setPopupShow(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={popupShow} onClose={handleClose}>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DialogContentText>Fill all fields to create new user.</DialogContentText>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

UserEditPopup.defaultProps = {
  popupShow: false,
  setPopupShow: () => {},
};

UserEditPopup.propTypes = {
  popupShow: PropTypes.bool,
  setPopupShow: PropTypes.func,
};

export default UserEditPopup;
