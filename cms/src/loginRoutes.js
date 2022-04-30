import Icon from "@mui/material/Icon";
import SignIn from "./pages/authentication/sign-in";

const loginRoutes = [
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/login",
    component: <SignIn />,
  },
];

export default loginRoutes;
