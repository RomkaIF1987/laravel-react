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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import pxToRem from "../../../assets/theme/functions/pxToRem";
import MDButton from "../../../components/MDButton";

function UserEditPopup({ setPopupShow, popupShow }) {
  const [role, setRole] = useState();

  const schema = yup
    .object()
    .shape({
      first_name: yup.string().required("First Name is required field"),
      last_name: yup.string().required("Last Name is required field"),
      email: yup.string().email().required("Email is required field"),
      password: yup
        .string()
        .required("Password is required field")
        .min(8, "Password is too short - should be 8 chars minimum.")
        .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => console.log(data);

  const handleClose = () => {
    setPopupShow(false);
  };
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  useEffect(() => {
    setValue("first_name", "");
  }, []);

  return (
    <Dialog fullWidth maxWidth="md" open={popupShow} onClose={handleClose}>
      <DialogTitle>Add New User</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DialogContentText>Fill all fields to create new user.</DialogContentText>
            </Grid>
            <Grid item xs={12} md={6}>
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
                {...register("first_name")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                id="lastName"
                label="Last Name"
                type="text"
                fullWidth
                variant="standard"
                error={!!errors?.last_name}
                helperText={errors?.last_name?.message || ""}
                {...register("last_name")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                error={!!errors?.email}
                helperText={errors?.email?.message || ""}
                {...register("email")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                id="password"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
                error={!!errors?.password}
                helperText={errors?.password?.message || ""}
                {...register("password")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl variant="standard" margin="dense" fullWidth error={!!errors?.role}>
                <InputLabel id="roleLabel">Role</InputLabel>
                <Select
                  labelId="roleLabel"
                  defaultValue=""
                  value={role}
                  id="role"
                  label="Role"
                  onChange={handleRoleChange}
                  sx={{ padding: `${pxToRem(4)} 0 ${pxToRem(5)}` }}
                  {...register("role")}
                >
                  <MenuItem value={1}>Admin</MenuItem>
                  <MenuItem value={2}>Super Admin</MenuItem>
                </Select>
                {errors?.password?.message && (
                  <FormHelperText>errors?.password?.message</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                sx={{ paddingTop: `${pxToRem(15)}` }}
                control={<Switch defaultChecked />}
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
  setPopupShow: () => {},
};

UserEditPopup.propTypes = {
  popupShow: PropTypes.bool,
  setPopupShow: PropTypes.func,
};

export default UserEditPopup;
