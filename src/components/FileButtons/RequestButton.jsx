/* eslint-disable array-callback-return */
import { Button, IconButton, Tooltip } from "@material-ui/core";
import React from "react";
import API from "../../services/API";
import { useState } from "react";
import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CheckIcon from "@material-ui/icons/Check";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Close from "@material-ui/icons/Close";
import useStyles from "./styles";

export default function RequestButton({
  requestData,
  onSuccess,
  label,
  buttonType,
  icon,
  debug = false,
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

  const request = () => {
    setSuccess(false);
    setError(false);
    setLoading(true);
    API.call(requestData, null, debug).then((result) => {
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
            <div className={classes.wrapper}>
              <Button
                className={buttonClassname}
                disabled={loading}
                component="label"
                {...props}
                onClick={() => {
                  request();
                }}
              >
                <div style={{ textAlign: "center" }}>
                  {error && errorTooltip}
                  {success && <>Успешно</>}
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
                    request();
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
