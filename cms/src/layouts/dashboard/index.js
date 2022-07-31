import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useMaterialUIController, setLayout } from "../../context";
import MDBox from "../../components/MDBox";
import Footer from "../../components/Footer";
import DashboardNavbar from "./components/Navbars/DashboardNavbar";
import ErrorMessage from "../../pages/authentication/components/ErrorMessage";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  return (
    <>
      <MDBox
        sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
          p: 3,
          position: "relative",
          [breakpoints.up("xl")]: {
            marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
            transition: transitions.create(["margin-left", "margin-right"], {
              easing: transitions.easing.easeInOut,
              duration: transitions.duration.standard,
            }),
          },
        })}
      >
        <DashboardNavbar />
        {children}
        <Footer />
      </MDBox>
      <ErrorMessage />
    </>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
