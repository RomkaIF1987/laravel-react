import PropTypes from "prop-types";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import MDBox from "../MDBox";
import MDTypography from "../MDTypography";
import typography from "../../assets/theme/base/typography";

function Footer({ company, links, light }) {
  const { href, name } = company;
  const { size } = typography;

  const renderLinks = () =>
    links.map((link) => (
      <MDBox key={link.name} component="li" px={2} lineHeight={1} color={light ? "white" : "text"}>
        <Link href={link.href} target="_blank">
          <MDTypography variant="button" fontWeight="regular" color={light ? "white" : "dark"}>
            {link.name}
          </MDTypography>
        </Link>
      </MDBox>
    ));

  return (
    <MDBox
      width="100%"
      display="flex"
      position="fixed"
      bottom="20px"
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="flex-start"
      alignItems="center"
      px={1.5}
      color={light ? "white" : "text"}
    >
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        color={light ? "white" : "text"}
        fontSize={size.sm}
        px={1.5}
      >
        &copy; {new Date().getFullYear()}, made with
        <MDBox fontSize={size.md} color={light ? "white" : "dark"} mb={-0.5} mx={0.25}>
          <Icon color="inherit" fontSize="inherit">
            favorite
          </Icon>
        </MDBox>
        by
        <Link href={href} target="_blank">
          <MDTypography variant="button" fontWeight="medium" color={light ? "white" : "dark"}>
            &nbsp;{name}&nbsp;
          </MDTypography>
        </Link>
        for a better web.
      </MDBox>
      <MDBox
        component="ul"
        sx={({ breakpoints }) => ({
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          listStyle: "none",
          mt: 3,
          mb: 0,
          p: 0,

          [breakpoints.up("lg")]: {
            mt: 0,
          },
        })}
        color={light ? "white" : "dark"}
      >
        {renderLinks()}
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of Footer
Footer.defaultProps = {
  company: { href: "/", name: "Roman Zhyliak" },
  links: [],
  light: false,
};

// Typechecking props for the Footer
Footer.propTypes = {
  company: PropTypes.objectOf(PropTypes.string),
  links: PropTypes.arrayOf(PropTypes.object),
  light: PropTypes.bool,
};

export default Footer;
