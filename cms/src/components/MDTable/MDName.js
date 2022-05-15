import PropTypes from "prop-types";
import MDBox from "../MDBox";
import MDAvatar from "../MDAvatar";
import MDTypography from "../MDTypography";

function MDName({ image, name, email }) {
  return (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      {image && <MDAvatar src={image} name={name} size="sm" />}
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );
}

MDName.defaultProps = {
  image: "",
};

MDName.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

export default MDName;
