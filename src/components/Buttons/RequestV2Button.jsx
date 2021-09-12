/* eslint-disable array-callback-return */
import { Button, IconButton, Tooltip } from "@material-ui/core";
import React, { useState } from "react";
import API from "../../services/API";
import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import useStyles from "./styles";

export default function RequestV2Button({
  request,
  onSuccess,
  label,
  buttonType,
  icon,
  fullWidth = false,
  debug = false,
  successLabel = null,
  ...props
}) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorTooltip, setErrorTooltip] = useState(false);
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });
  const iconButtonClassname = clsx({
    [classes.iconButtonSuccess]: success,
    [classes.iconButtonError]: error,
  });

  const makeRequest = () => {
    setSuccess(false);
    setError(false);
    setLoading(true);
    API.callV2(
      request.method,
      request.route,
      request.data,
      debug
    ).then((result) => {
      if (debug) console.log(result);
      if (result.success) {
        if (onSuccess) onSuccess(result.data);
        setSuccess(true);
      } else {
        setError(true);
        setErrorTooltip(result.status);
        if (debug) setErrorTooltip(result.status);
      }
      setLoading(false);
      timer.current = window.setTimeout(() => {
        setSuccess(false);
        setError(false);
        setErrorTooltip(false);
      }, 2000);
    });
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <>
      <div className={classes.root}>
        {buttonType !== "IconButton" ? (
          <>
            <div className={classes.wrapper} style={fullWidth ? {width:'100%'}:{}}>
              <Button
                className={buttonClassname}
                disabled={loading}
                fullWidth={fullWidth}
                component="label"
                {...props}
                onClick={() => {
                  makeRequest();
                }}
              >
                <div style={{ textAlign: "center" }}>
                  {error && errorTooltip}
                  {success && (successLabel ? successLabel:'Успешно')}
                  {!success && !error && label}
                </div>
              </Button>

              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </>
        ) : (
          <>
            <div className={classes.iconButtonWrapper}>
              <Tooltip
                title={error ? errorTooltip : success ? "Успешно" : label}
                placement="top"
                arrow
              >
                <IconButton
                  aria-label="download"
                  disabled={loading}
                  className={iconButtonClassname}
                  onClick={() => {
                    makeRequest();
                  }}
                  {...props}
                >
                  {error && <CancelOutlinedIcon />}
                  {success && <CheckCircleOutlineIcon />}
                  {!success && !error && icon}
                </IconButton>
              </Tooltip>
              {loading && (
                <CircularProgress
                  size={53}
                  className={classes.downloadIconButtonProgress}
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
