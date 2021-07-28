/* eslint-disable array-callback-return */
import { Button, IconButton, Tooltip, Fab } from "@material-ui/core";
import React, { useRef } from "react";
import API from "../../services/API";
import { useState } from "react";
import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import CheckIcon from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
import Publish from "@material-ui/icons/Publish";
import useStyles from "./styles";

export default function UploadFileButton({
  data,
  label,
  buttonType,
  successCallback = null,
  errorCallback = null,
  icon = null,
  ...props
}) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const timer = React.useRef();
  const inputFile = useRef(null);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });

  const iconButtonClassname = clsx(classes.iconButton, {
    [classes.iconButtonSuccess]: success,
    [classes.iconButtonError]: error,
  });

  const uploadFile = (event) => {
    console.log(event.target.files[0]);
    const requestData = new FormData();
    requestData.append("file", event.target.files[0]);
    Object.entries(data).map((e) => {
      requestData.append(e[0], e[1]);
    });
    setSuccess(false);
    setError(false);
    setLoading(true);
    API.call(requestData).then((result) => {
      console.log(result);
      if (result.success) {
        setSuccess(true);
        if (successCallback !== null) {
          successCallback(true);
        }
      } else {
        if (errorCallback !== null) {
          errorCallback(result.message);
        }
        setError(true);
      }
      setLoading(false);
      timer.current = window.setTimeout(() => {
        setSuccess(false);
        setError(false);
      }, 2000);
    });
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className={classes.root}>
      {buttonType === "Button" && (
        <>
          <div
            className={clsx(classes.wrapper, {
              [classes.wrapperFullWidth]: props.fullWidth,
            })}
          >
            <Button
              className={buttonClassname}
              disabled={loading}
              component="label"
              {...props}
            >
              {!loading && (
                <input type="file" hidden onChange={(e) => uploadFile(e)} />
              )}
              <div style={{ textAlign: "center" }}>
                {error && <>Ошибка</>}
                {success && <>Отправлено</>}
                {!success && !error && (
                  <>
                    {icon ? (<div style={{display:"flex"}}>
                      {icon}
                      {label}
                    </div>):label }
                  </>
                )}
              </div>
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </>
      )}
      {buttonType === "Fab" && (
        <>
          <div className={classes.wrapper}>
            <Tooltip
              title={error ? "Ошибка" : success ? "Отправлено" : label}
              placement="top"
              arrow
            >
              <Fab
                className={buttonClassname}
                disabled={loading}
                component="label"
                {...props}
              >
                {!loading && (
                  <input type="file" hidden onChange={(e) => uploadFile(e)} />
                )}
                {error && <Close />}
                {success && <CheckIcon />}
                {!success && !error && <>{icon ? icon : <Publish />}</>}
              </Fab>
            </Tooltip>
            {loading && (
              <CircularProgress size={68} className={classes.fabProgress} />
            )}
          </div>
        </>
      )}
      {buttonType === "IconButton" && (
        <>
          <div className={classes.iconButtonWrapper}>
            {!loading && (
              <input
                type="file"
                ref={inputFile}
                hidden
                onChange={(e) => uploadFile(e)}
              />
            )}
            <Tooltip
              title={error ? "Ошибка" : success ? "Файл отправлен" : label}
              placement="top"
              arrow
            >
              <IconButton
                aria-label="download"
                disabled={loading}
                className={iconButtonClassname}
                onClick={() => {
                  inputFile.current.click();
                }}
                {...props}
              >
                {!loading && (
                  <input type="file" hidden onChange={(e) => uploadFile(e)} />
                )}
                {error && <Close />}
                {success && <CheckIcon />}
                {!success && !error && (icon ? icon : <PublishRoundedIcon />)}
              </IconButton>
            </Tooltip>
            {loading && (
              <CircularProgress
                size={53}
                className={classes.uploadIconButtonProgress}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
