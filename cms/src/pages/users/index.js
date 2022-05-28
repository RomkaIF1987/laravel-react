import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useCallback, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../components/Footer";
import DataTable from "../../examples/Tables/DataTable";
import MDBadge from "../../components/MDBadge";
import MDString from "../../components/MDTable/MDString";
import UsersService from "../../services/user";
import MDUserInfo from "../../components/MDTable/MDUserInfo";
import MDButton from "../../components/MDButton";
import UserEditPopup from "./component/userEditPopup";

function Users() {
  const [users, setUsers] = useState([]);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [popupShow, setPopupShow] = useState(false);

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
              <MDBadge badgeContent="active" color="success" variant="gradient" size="sm" />
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
      <DashboardNavbar />
      {popupShow && <UserEditPopup setPopupShow={setPopupShow} popupShow={popupShow} />}
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
                    setPopupShow(true);
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
      <Footer />
    </DashboardLayout>
  );
}

export default Users;
