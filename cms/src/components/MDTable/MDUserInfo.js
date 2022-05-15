import PropTypes from "prop-types";
import MDBox from "../MDBox";
import MDAvatar from "../MDAvatar";
import MDTypography from "../MDTypography";

function MDUserInfo({ image, firstName, lastName, email }) {
  return (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      {image && <MDAvatar src={image} name={`${firstName} ${lastName}`} size="sm" />}
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {firstName} {lastName}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );
}

MDUserInfo.defaultProps = {
  image: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
  firstName: "",
  lastName: "",
  email: "",
};

MDUserInfo.propTypes = {
  image: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
};

export default MDUserInfo;
