import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useCallback, useEffect, useState } from "react";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../components/Footer";
import DataTable from "../../examples/Tables/DataTable";
import MDBadge from "../../components/MDBadge";
import MDName from "../../components/MDTable/MDName";
import MDString from "../../components/MDTable/MDString";
import UsersService from "../../services/user";

function Users() {
  const data = [
    {
      name: "Test Name",
      image: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
      email: "wqeqweq@i.ua",
      role: "Admin",
      status: "active",
    },
  ];
  const [users, setUsers] = useState();

  const handleGetUsers = useCallback(async () => {
    await UsersService.getRecords().then((response) => {
      setUsers(response.data);
    });
  }, []);

  useEffect(() => {
    handleGetUsers();
  }, [handleGetUsers]);

  const tableData = {
    columns: [
      { Header: "name", accessor: "name", width: "30%", align: "left" },
      { Header: "role", accessor: "role", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: data.map((user) => ({
      name: <MDName image={user.image} name={user.name} email={user.email} />,
      role: <MDString title={user.role} />,
      status: (
        <MDBox ml={-1}>
          <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
        </MDBox>
      ),
      action: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          Edit
        </MDTypography>
      ),
    })),
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
              >
                <MDTypography variant="h6" color="white">
                  Users
                </MDTypography>
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
