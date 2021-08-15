import React from "react";
import { AppBar, Toolbar, IconButton } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import { Badge, Typography } from "./../Wrappers/Wrappers";
import { Helmet } from 'react-helmet';

export default function Header(props) {
  var classes = useStyles();

  return (<>
    {props.title !== 'Загрузка' && (<Helmet title={props.title} />)}
    <AppBar position="fixed" color={"primary"} className={classes.appBar} style={props.style && props.style}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => props.history.goBack()}
          className={classNames(
            classes.headerMenuButtonSandwich,
            classes.headerMenuButtonCollapse,
          )}
        >
          <ArrowBack
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
        <Typography variant="h6" weight="medium" className={classNames(classes.logotype, classes.grow)}>
          {props.title}
          {props.badges &&
            props.badges.map((item) => (
              <Badge color="secondary" badgeContent={item} max={9999999999} />
            ))}
        </Typography>
        {props.button && props.button}
      </Toolbar>
    </AppBar>
  </>);
}
