import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import PropTypes from "prop-types";
import jwtService from "../../services/jwtService";
import { hideNotification, showNotification } from "../../store/notificationSlice";
import { setUserData, logoutUser } from "../../store/userSlice";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waitAuthCheck: true,
      children: props.children,
    };
  }

  componentDidMount() {
    return Promise.all([this.jwtCheck()]).then(() => {
      this.setState({ waitAuthCheck: false });
    });
  }

  jwtCheck = () =>
    new Promise((resolve) => {
      const { logout } = this.props;
      jwtService.on("onAutoLogin", async () => {
        const token = jwtService.getAccessToken();
        await jwtService
          .getAuthUserData(token)
          .then((response) => {
            const responseData = {
              user: response.data,
            };
            jwtService.setSession(responseData);
            setUserData(jwtService.getUserInfo());
          })
          .catch(() => {
            logout();
          });
        resolve();
      });

      jwtService.on("onAutoLogout", () => {
        logout();
        resolve();
      });

      jwtService.on("onNoAccessToken", () => {
        resolve();
      });

      jwtService.init();
      Promise.resolve().then();
    });

  render() {
    const { waitAuthCheck, children } = this.state;
    return waitAuthCheck ? <LoadingScreen /> : <> {children}</>;
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      logout: logoutUser,
      setUserData,
      showNotification,
      hideNotification,
    },
    dispatch
  );
}

Auth.defaultProps = {
  logout: () => {},
  children: {},
};

Auth.propTypes = {
  logout: PropTypes.func,
  children: PropTypes.objectOf(PropTypes.any),
};

export default connect(null, mapDispatchToProps)(Auth);
