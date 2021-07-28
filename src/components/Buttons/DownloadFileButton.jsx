/* eslint-disable array-callback-return */
import { Button,IconButton,Tooltip } from '@material-ui/core';
import React from 'react';
import API from '../../services/API';
import { useState } from 'react';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import CheckIcon from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import useStyles from "./styles";



export default function DownloadFileButton({filename, data, label, buttonType, ...props}) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState(false);
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });
  const iconButtonClassname = clsx({
    [classes.iconButtonSuccess]: success,
    [classes.iconButtonError]: error,
  });

  const downloadFile = () =>{
    setSuccess(false);
    setError(false);
    setLoading(true);
    API.filecall(data,filename)
      .then(result => {
      console.log(result);
      if (result.success) {
        setSuccess(true);
      }else{
        setError(true);
      }
      setLoading(false);
      timer.current = window.setTimeout(() => {
        setSuccess(false);
        setError(false);
      }, 2000);
    });
  }

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return (<>
    <div className={classes.root}>
        {buttonType !== 'IconButton' ? (<>
      <div className={classes.wrapper}>
          
          <Button
            className={buttonClassname}
            disabled={loading}
            component="label"
            {...props}
            onClick={() => { downloadFile() }}
          >
            <div style={{ textAlign: 'center' }}>
              {error && <>Ошибка</>}
              {success && <>Загрузка</>}
              {!success && !error && label}
            </div>
          </Button>
          
            
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
          </>) : (<>
      <div className={classes.iconButtonWrapper}>
            <Tooltip
              title={error ? 'Ошибка' :
                  success ? 'Загрузка файла' : label}
              placement="top" arrow>
              <IconButton
                aria-label="download"
                disabled={loading}
                className={iconButtonClassname}
                onClick={() => { downloadFile() }}
                {...props}
              >
                {error && <Close/>}
                {success && <CheckIcon/>}
                {!success && !error && <GetAppRoundedIcon />}
              </IconButton>
            </Tooltip>
            {loading && <CircularProgress size={53} className={classes.downloadIconButtonProgress}
            />}
      </div>
        </>)}
    </div>
  </>);
}