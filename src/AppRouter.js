import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Helmet from 'react-helmet';

// layout
import StudentLayout from "./layout/student/StudentLayout/StudentLayout";
import AdminLayout from "./layout/admin/AdminLayout/AdminLayout";

// pages
import Error from "./pages/error/Error";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";

// context
import { useUserDispatch, useUserState } from "./context/UserContext"; 
import { refreshTokens } from "./services/JWT";
import Centered from "./components/Centered";
import { CircularProgress } from "@material-ui/core";

export default function App() {
  // global
  var { isAuthenticated, role } = useUserState();
  var userDispatch = useUserDispatch();
  
  if (isAuthenticated && role === null) {
    refreshTokens().then(
      (status) => userDispatch({ type: status })
    )
    return (
      <Centered height="100vh">
        <CircularProgress />
      </Centered>
    );
  }
  
  return (<>
    <Helmet
      defaultTitle="Odin Laboratory"
      titleTemplate="%s - СДО АУЦ ФПЛС"
    />
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/student" />} />
      <Route exact path="/admin" render={() => <Redirect to="/teacher" />} />
      <AuthenticatedRoute path="/student" component={StudentLayout} userRole="student"/>
      <AuthenticatedRoute path="/teacher" component={AdminLayout} userRole="teacher|admin"/>
      <UnauthenticatedRoute path="/login" component={Login} />
      <UnauthenticatedRoute path="/register" component={Register} />
      <Route component={Error} />
    </Switch>
  </>);

  // #######################################################################

  function AuthenticatedRoute({ component, userRole, ...rest }) {
    let allowedRoles = userRole.split("|"); 
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            allowedRoles.indexOf(role) !== -1 ? (
              React.createElement(component, props)
            ) : (
              <Redirect
              to={{
                pathname: "/"+(role === null ? 'login' : role),
                state: {
                  from: props.location,
                },
              }}
            />
            )
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  // Доступ разрешен только, если пользователь но вошел в систему, иначе перенаправит на "/"
  function UnauthenticatedRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
