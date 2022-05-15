import PropTypes from "prop-types";
import MDBox from "../MDBox";
import MDTypography from "../MDTypography";

function MDString({ title }) {
  return (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
    </MDBox>
  );
}

MDString.propTypes = {
  title: PropTypes.string.isRequired,
};

export default MDString;
