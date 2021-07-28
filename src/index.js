import React from "react";
import ReactDOM from "react-dom";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "@material-ui/styles";
import Themes from "./themes";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter"; 

import * as serviceWorker from "./serviceWorker";
import { LayoutProvider } from "./context/LayoutContext";

ReactDOM.render(
  <LayoutProvider>
    <UserProvider>
      <ThemeProvider theme={Themes.purple}>
        <CssBaseline />
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ThemeProvider>
    </UserProvider>
  </LayoutProvider>
  ,document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
