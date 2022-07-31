import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MDBox from "../../../../components/MDBox";
import MDAlert from "../../../../components/MDAlert";

function ErrorMessage() {
  const message = useSelector((state) => state.message);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (message.state) {
      setShowMessage(true);
    }
    setTimeout(() => {
      setShowMessage(false);
    }, message?.options?.autoHideDuration || 6000);
  }, [message]);

  if (showMessage) {
    return (
      <MDBox
        width="100%"
        display="flex"
        position="fixed"
        bottom={120}
        flexDirection={{ xs: "column", lg: "row" }}
        justifyContent="flex-start"
        alignItems="center"
        px={1.5}
        zIndex={1201}
      >
        <Container>
          <MDAlert color={message?.options?.variant} dismissible>
            {message?.options?.message}
          </MDAlert>
        </Container>
      </MDBox>
    );
  }
  return null;
}

export default ErrorMessage;
