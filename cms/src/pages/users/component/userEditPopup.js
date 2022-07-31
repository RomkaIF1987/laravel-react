import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import pxToRem from "../../../assets/theme/functions/pxToRem";
import MDButton from "../../../components/MDButton";
import UsersService from "../../../services/user";
import { showMessage } from "../../../store/messageSlice";

function UserEditPopup({ setPopupShow, popupShow, editUserId }) {
  const dispatch = useDispatch();
  const [user, setUser] = useState();

  const schema = yup
    .object()
    .shape({
      first_name: yup.string().required("First Name is required field"),
      last_name: yup.string().required("Last Name is required field"),
      email: yup.string().email().required("Email is required field"),
    })
    .required();

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const getHandleUser = useCallback(async () => {
    await UsersService.getRecord(editUserId).then((response) => {
      setUser(response);
    });
  }, [editUserId]);

  const onSubmit = (data) => {
    UsersService.updateRecord(data, editUserId).then(() => {
      setPopupShow(false);
      dispatch(showMessage({ message: "User successfully updated", variant: "success" }));
    });
  };

  const handleClose = () => {
    setPopupShow(false);
  };

  useEffect(() => {
    if (editUserId) {
      getHandleUser().then();
    }
  }, [getHandleUser]);

  useEffect(() => {
    setValue("first_name", user?.first_name || "");
    setValue("last_name", user?.last_name || "");
    setValue("email", user?.email || "");
    setValue("password", user?.password || "");
    setValue("role_id", user?.role_id || "");
    setValue("status", user?.status || "");
  }, [user]);

  return (
    <Dialog fullWidth maxWidth="md" open={popupShow} onClose={handleClose}>
      <DialogTitle>{editUserId ? `Edit ${user?.full_name}` : "Add New User"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DialogContentText>Fill all fields to create new user.</DialogContentText>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="first_name"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    autoFocus
                    margin="dense"
                    id="firstName"
                    label="First Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    error={!!errors?.first_name}
                    helperText={errors?.first_name?.message || ""}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="last_name"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    margin="dense"
                    id="lastName"
                    label="Last Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    error={!!errors?.last_name}
                    helperText={errors?.last_name?.message || ""}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    margin="dense"
                    id="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                    error={!!errors?.email}
                    helperText={errors?.email?.message || ""}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="password"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    error={!!errors?.password}
                    helperText={errors?.password?.message || ""}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl variant="standard" margin="dense" fullWidth error={!!errors?.role}>
                <InputLabel id="roleLabel">Role</InputLabel>
                <Controller
                  name="role_id"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      labelId="roleLabel"
                      defaultValue=""
                      value={value}
                      id="role"
                      label="Role"
                      onChange={onChange}
                      sx={{ padding: `${pxToRem(4)} 0 ${pxToRem(5)}` }}
                    >
                      <MenuItem value={1}>Admin</MenuItem>
                      <MenuItem value={2}>Super Admin</MenuItem>
                    </Select>
                  )}
                />
                {errors?.password?.message && (
                  <FormHelperText>errors?.password?.message</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                sx={{ paddingTop: `${pxToRem(15)}` }}
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Switch onChange={onChange} value={value} checked={!!value} />
                    )}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <MDButton variant="gradient" color="secondary" size="small" onClick={handleClose}>
            Cancel
          </MDButton>
          <MDButton variant="gradient" color="primary" size="small" type="submit">
            Submit
          </MDButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

UserEditPopup.defaultProps = {
  popupShow: false,
  setPopupShow: () => null,
  editUserId: null,
};

UserEditPopup.propTypes = {
  popupShow: PropTypes.bool,
  setPopupShow: PropTypes.func,
  editUserId: PropTypes.number,
};

export default UserEditPopup;
