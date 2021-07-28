import React from "react";
import { Grid, Paper, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// logo
// import logo from "./logo.svg";
// import Logo from './../../components/Logo/index';

export default function Error() {
  var classes = useStyles();

  return (
    <Grid container className={classes.container}>
      {/* <div className={classes.logotype}> */}
        {/* <img className={classes.logotypeIcon} src={logo} alt="logo" />  */}
        {/* <Typography variant="h3" color="white" > */}
        {/* <Logo type="inline" className={classes.logotypeIcon}/> */}
          {/* Material Admin */}
        {/* </Typography> */}
      {/* </div> */}
      <Paper classes={{ root: classes.paperRoot }}>
        <Typography
          variant="h1"
          color="primary"
          className={classnames(classes.textRow, classes.errorCode)}
        >
          404
        </Typography>
        <Typography variant="h5" color="primary" className={classes.textRow}>
          Ой. Похоже, страница, которую вы ищете, больше не существует
        </Typography>
        <Typography
          variant="h6"
          color="text"
          colorBrightness="secondary"
          className={classnames(classes.textRow, classes.safetyText)}
        >
          Но мы здесь, чтобы вернуть вас в безопасность
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          size="large"
          className={classes.backButton}
        >
          Вернуться на главную
        </Button>
      </Paper>
    </Grid>
  );
}
