import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import MDButton from "../../../components/MDButton";
import UsersService from "../../../services/user";
import { showMessage } from "../../../store/messageSlice";

function UserDeletePopup({ setPopupShow, popupShow, editUserId, handleGetUsers }) {
  const dispatch = useDispatch();

  const deleteUser = () => {
    if (editUserId) {
      UsersService.deleteRecord(editUserId).then(() => {
        setPopupShow(false);
        dispatch(showMessage({ message: "User successfully deleted", variant: "success" }));
        handleGetUsers();
      });
    }
  };

  const handleClose = () => {
    setPopupShow(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={popupShow} onClose={handleClose}>
      <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
      <DialogActions>
        <MDButton variant="gradient" color="secondary" size="small" onClick={handleClose}>
          Cancel
        </MDButton>
        <MDButton variant="gradient" color="primary" size="small" onClick={deleteUser}>
          Delete
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

UserDeletePopup.defaultProps = {
  popupShow: false,
  setPopupShow: () => null,
  editUserId: null,
  handleGetUsers: () => null,
};

UserDeletePopup.propTypes = {
  popupShow: PropTypes.bool,
  setPopupShow: PropTypes.func,
  handleGetUsers: PropTypes.func,
  editUserId: PropTypes.number,
};

export default UserDeletePopup;
