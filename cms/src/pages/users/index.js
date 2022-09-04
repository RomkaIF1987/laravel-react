import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useCallback, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import DataTable from "../../examples/Tables/DataTable";
import MDBadge from "../../components/MDBadge";
import MDString from "../../components/MDTable/MDString";
import UsersService from "../../services/user";
import MDUserInfo from "../../components/MDTable/MDUserInfo";
import MDButton from "../../components/MDButton";
import DashboardLayout from "../../layouts/dashboard";
import { UserDeletePopup, UserEditPopup } from "./component";

function Users() {
  const [users, setUsers] = useState([]);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [editPopupShow, setEditPopupShow] = useState(false);
  const [deletePopupShow, setDeletePopupShow] = useState(false);
  const [editUserId, setEditUserId] = useState();

  const handleGetUsers = useCallback(async () => {
    await UsersService.getRecords().then((response) => {
      setUsers(response.data);
    });
  }, []);

  useEffect(() => {
    handleGetUsers().then();
  }, [handleGetUsers]);

  useEffect(() => {
    if (users) {
      setTableData({
        columns: [
          { Header: "name", accessor: "name", width: "30%", align: "left" },
          { Header: "role", accessor: "role", align: "left" },
          { Header: "status", accessor: "status", align: "center" },
          { Header: "action", accessor: "action", align: "center" },
        ],
        rows: users.map((user) => ({
          name: (
            <MDUserInfo
              image={user.image}
              firstName={user.first_name}
              lastName={user.last_name}
              email={user.email}
            />
          ),
          role: <MDString title={user.role} />,
          status: (
            <MDBox ml={-1}>
              {user?.status ? (
                <MDBadge badgeContent="active" color="success" variant="gradient" size="sm" />
              ) : (
                <MDBadge badgeContent="inactive" color="secondary" variant="gradient" size="sm" />
              )}
            </MDBox>
          ),
          action: (
            <MDBox>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={{ "&:hover": { color: "blue" } }}
                onClick={(e) => {
                  e.preventDefault();
                  setEditPopupShow(true);
                  setEditUserId(user.id);
                }}
              >
                <EditIcon fontSize="medium" />
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={{ "&:hover": { color: "red" } }}
                onClick={(e) => {
                  e.preventDefault();
                  setDeletePopupShow(true);
                  setEditUserId(user.id);
                }}
              >
                <DeleteIcon fontSize="medium" />
              </IconButton>
            </MDBox>
          ),
        })),
      });
    }
  }, [users]);

  return (
    <DashboardLayout>
      {editPopupShow && (
        <UserEditPopup
          setPopupShow={setEditPopupShow}
          popupShow={editPopupShow}
          editUserId={editUserId}
          handleGetUsers={handleGetUsers}
        />
      )}
      {deletePopupShow && (
        <UserDeletePopup
          setPopupShow={setDeletePopupShow}
          popupShow={deletePopupShow}
          editUserId={editUserId}
          handleGetUsers={handleGetUsers}
        />
      )}
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Users
                </MDTypography>
                <MDButton
                  variant="gradient"
                  color="success"
                  size="small"
                  sx={{ width: 160 }}
                  fullWidth
                  onClick={(e) => {
                    e.preventDefault();
                    setEditPopupShow(true);
                    setEditUserId(null);
                  }}
                >
                  Add new
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={tableData}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Users;
