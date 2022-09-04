import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MDBox from "../../../../components/MDBox";
import MDAlert from "../../../../components/MDAlert";
import { hideMessage } from "../../../../store/messageSlice";

function ErrorMessage() {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.message);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (message.state) {
      setShowMessage(true);
      dispatch(hideMessage());
    }
    const timeout = setTimeout(() => {
      setShowMessage(false);
    }, message?.options?.autoHideDuration || 6000);
    return () => {
      clearTimeout(timeout);
    };
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
