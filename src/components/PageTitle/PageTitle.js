import React from "react";

// styles
import useStyles from "./styles";

// components
import { Typography } from "./../Wrappers";
import { withRouter } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

function PageTitle(props) {
  var classes = useStyles();

  return (
    <div className={classes.pageTitleContainer}>
      <Typography className={classes.typo} variant="h1" size="sm">
        <IconButton color="primary" onClick={() => {
          props.history.goBack();
      }}>
          <ArrowBack style={{fontSize:'xx-large'}}/>
      </IconButton>
        {props.title}
      </Typography>
      {props.button && props.button}
    </div>
  );
}

export default withRouter(PageTitle);
