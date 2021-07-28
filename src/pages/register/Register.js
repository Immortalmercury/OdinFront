import React, { useEffect, useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  TextField,
  Paper,
  Fab,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import useStyles from "./styles";
import Logo from "../../components/Logo/index";
import API, { registerRoute } from "../../services/API";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import classnames from "classnames";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { FormControlLabel } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import { Done, Visibility } from "@material-ui/icons";
import { VisibilityOff } from "@material-ui/icons";
import UploadFileButton from "./../../components/Buttons/UploadFileButton";
import { setTokens } from "../../services/JWT";
import { useUserDispatch } from "./../../context/UserContext";
import ClientJS from 'clientjs';

const limitName = "attemptLimited";

const setLimit = (value) => {
  if (value) {
    let now = new Date().getTime();
    let timeout = 1000 * 60 * 5;
    localStorage.setItem(limitName, now + timeout);
    return timeout;
  } else {
    localStorage.removeItem(limitName);
  }
};
const getLimit = () => {
  let now = new Date().getTime();
  let time = localStorage.getItem(limitName);
  if (time && time > now) {
    return time - now;
  } else {
    setLimit(false);
    return false;
  }
};

function Register(props) {
  var classes = useStyles();
  var userDispatch = useUserDispatch();
  const steps = ["Приглашение", "ФИО", "Данные входа"];
  const [activeStep, setActiveStep] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // 1 step
  const [inviteCode, setInviteCode] = useState("");
  // 2 step
  const [sname, setSname] = useState("");
  const [fname, setFname] = useState("");
  const [fthname, setFthname] = useState("");
  const [noFthname, setNoFthname] = useState(false);
  // 3 step
  const [loginValue, setLoginValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordConfirmationValue, setPasswordConfirmationValue] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] = useState();
  const [showPasswordValue, setShowPasswordValue] = useState(false);
  // 4 step
  const [photoUploaded, setPhotoUploaded] = useState(false);
  // const [dispatchActionType, setDispatchActionType] = useState(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [attemptLimit, setAttemptLimit] = useState(getLimit());
  const timer = React.useRef();

  const checkInvite = () => {
    setIsLoading(true);
    API.call(
      {
        method: "checkInvite",
        invitation: inviteCode,
      },
      registerRoute,
    ).then((result) => {
      setIsLoading(false);
      if (result.success) {
        setError(false);
        handleNext();
      } else {
        setError(result.message);
      }
    });
  };

  const register = (code) => {
    var client = new ClientJS();
    setIsLoading(true);
    setLoginError(false);
    setEmailError(false);
    setPasswordError(false);
    setError(false);
    API.call(
      {
        method: "register",
        invitation: inviteCode,
        sname: sname,
        fname: fname,
        fthname: fthname,
        noFthname: noFthname,
        login: loginValue,
        email: emailValue,
        password: passwordValue,
        confirmation: passwordConfirmationValue,
        device: client.getBrowser()
      },
      registerRoute,
    ).then((result) => {
      setIsLoading(false);
      if (result.success) {
        if (result.success && result.data!==undefined && result.data.accessToken!==undefined) {
          setTokens(result.data.accessToken, result.data.accessTokenExpired, result.data.refreshToken);
          console.log('tokens_setted');
          handleNext();
        } else {
          setError("Токен не предоставлен");
        }
      } else {
        if (result.data.loginError) setLoginError(result.data.loginError);
        if (result.data.emailError) setEmailError(result.data.emailError);
        if (result.data.passwordError) setPasswordError(result.data.passwordError);
        if (result.data.confirmationError) setPasswordConfirmationError(result.data.confirmationError);
        setError(result.message);
      }
    });
  };

  useEffect(() => {
    if (photoUploaded) {
      userDispatch({ type: "LOGIN_SUCCESS" });
    }
    return () => {
      setPhotoUploaded(false);
    };
  },[photoUploaded,userDispatch])

  React.useEffect(() => {
    if (attemptLimit) {
      // Если есть лимит, то его либо надо установить, либо он установлен
      let time = getLimit();
      if (time) {
        // Если лимит уже стоит то надо только установить таймер
        timer.current = window.setTimeout(() => {
          setLimit(false);
          setAttemptLimit(false);
        }, time);
      } else {
        // Иначе надо этот лимит установить
        let time = setLimit(true);
        timer.current = window.setTimeout(() => {
          setLimit(false);
          setAttemptLimit(false);
        }, time);
      }
    }

    return () => {
      clearTimeout(timer.current);
    };
  }, [attemptLimit]);

  return (
    <Grid container component="main" className={classes.root}>
      <Grid
        item
        className={classes.image}
        md={12}
        sm={12}
        xs={12}
        component={Paper}
        elevation={6}
        square
      >
        <div className={classes.formContainer}>
          <Paper
            elevation={6}
            className={classnames(classes.form, {
              [classes.formBigger]: activeStep > 0 && activeStep < 3,
            })}
          >
            {activeStep < 3 && (
              <div className={classes.logoWrapper}>
                
                <Logo type={activeStep === 0 ? "simple" : "inline"} className={classnames({
                  [classes.logo]: activeStep>0,
                })} />
                
               
              </div>
            )}
            {activeStep > 0 && activeStep < 3 && (
              <Fab onClick={() => handleBack()} className={classes.backFab}>
                <ChevronLeftIcon />
              </Fab>
            )}

            {attemptLimit ? (
              <>
                <Typography color="error" className={classes.errorMessage}>
                  Превышено количество попыток, подождите 5 минут.
                </Typography>
              </>
            ) : (
              <>
                {activeStep > 0 && activeStep < 3 && (
                  <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    style={{
                      padding: "30px 0px 10px",
                    }}
                  >
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                )}
                {activeStep === 0 && (
                  <>
                    <TextField
                      onChange={(e) => {
                        setInviteCode(e.target.value);
                        setError(false);
                      }}
                      onClick={(e) => {
                        if (error) setError(false);
                      }}
                      margin="dense"
                      type="email"
                      value={inviteCode}
                      fullWidth
                      label="Код приглашения"
                      autoComplete="off"
                      autoFocus
                      error={error ? true : false}
                      multiline
                      helperText={error && error}
                    />

                    <div className={classes.formButtons}>
                      {isLoading ? (
                        <div className={classes.Loader}>
                          <CircularProgress size={30} />
                        </div>
                      ) : (
                        <Button
                          disabled={
                            inviteCode.length === 0 || inviteCode.length === 0
                          }
                          onClick={() => checkInvite()}
                          variant="contained"
                          color="primary"
                          size="large"
                          fullWidth
                        >
                          Продолжить
                        </Button>
                        )}
                    </div>
                      {!isLoading && (
                        <Button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 15,
                          }}
                          color="primary"
                          size="small"
                          fullWidth
                          onClick={() => {
                            props.history.push("/login");
                          }}
                        >
                          У меня есть аккаунт
                        </Button>
                      )}
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    <TextField
                      onChange={(e) => {
                        setSname(e.target.value);
                        setError(false);
                      }}
                      onClick={(e) => {
                        if (error) setError(false);
                      }}
                      value={sname}
                      margin="dense"
                      type="text"
                      fullWidth
                      label="Фамилия"
                      autoComplete="off"
                      autoFocus
                      error={error ? true : false}
                    />
                    <TextField
                      onChange={(e) => {
                        setFname(e.target.value);
                        setError(false);
                      }}
                      onClick={(e) => {
                        if (error) setError(false);
                      }}
                      value={fname}
                      margin="dense"
                      type="text"
                      fullWidth
                      label="Имя"
                      autoComplete="off"
                      error={error ? true : false}
                    />
                    <TextField
                      onChange={(e) => {
                        setFthname(e.target.value);
                        setError(false);
                      }}
                      onClick={(e) => {
                        if (error) setError(false);
                      }}
                      value={fthname}
                      margin="dense"
                      type="text"
                      fullWidth
                      label="Отчество"
                      autoComplete="off"
                      error={error ? true : false}
                      disabled={noFthname}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={noFthname}
                          onChange={() => {
                            setNoFthname(!noFthname);
                            setError(false);
                          }}
                          color="primary"
                        />
                      }
                      label="Нет отчества"
                    />

                    <div className={classes.formButtons}>
                      <Button
                        disabled={
                          sname.length === 0 ||
                          fname.length === 0 ||
                          (!noFthname && fthname.length === 0)
                        }
                        onClick={() => handleNext()}
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                      >
                        Продолжить
                      </Button>
                    </div>
                  </>
                )}
                {activeStep === 2 && (
                    <>
                      {error ? (
                        <Typography color="error" className={classes.errorMessage}>
                          {error}
                        </Typography>
                      ) : null}
                    <TextField
                      onChange={(e) => {
                        setLoginValue(e.target.value);
                        if (loginError) setLoginError(false);
                        if (error) setError(false);
                      }}
                      onClick={(e) => {
                        if (loginError) setLoginError(false);
                        if (error) setError(false);
                      }}
                      value={loginValue}
                      margin="dense"
                      type="text"
                      fullWidth
                      label="Придумайте имя пользователя"
                      autoComplete="off"
                      autoFocus
                      error={loginError ? true : false}
                      helperText={loginError}
                    />
                    <TextField
                      onChange={(e) => {
                        setEmailValue(e.target.value);
                        if (error) setError(false);
                        if (emailError) setEmailError(false);
                      }}
                      onClick={(e) => {
                        if (error) setError(false);
                        if (emailError) setEmailError(false);
                      }}
                      value={emailValue}
                      margin="dense"
                      type="email"
                      fullWidth
                      label="Адрес электронной почты"
                      autoComplete="off"
                      error={emailError ? true : false}
                      helperText={emailError}
                    />
                    <TextField
                      label="Новый пароль"
                      onChange={(e) => {
                        setPasswordValue(e.target.value);
                        if (error) setError(false);
                        if (passwordError) setPasswordError(false);
                      }}
                      onClick={(e) => {
                        if (error) setError(false);
                        if (passwordError) setPasswordError(false);
                      }}
                      type={showPasswordValue ? "text" : "password"}
                      value={passwordValue}
                      fullWidth
                      margin="dense"
                      error={passwordError ? true : false}
                      helperText={passwordError ? passwordError : 'Не менее 8 символов'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              focusVisibleClassName={classes.showPasswordFocus}
                              aria-label="toggle password visibility"
                              onClick={() =>
                                setShowPasswordValue(!showPasswordValue)
                              }
                              onMouseDown={(event) => event.preventDefault()}
                            >
                              {showPasswordValue ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="Новый пароль еще раз"
                      onKeyDown={(e) => {
                        if (
                          (e.key !== undefined && e.key === 13) ||
                          (e.keyCode !== undefined && e.keyCode === 13)
                        ) {
                        }
                      }}
                      onChange={(e) => {
                        setPasswordConfirmationValue(e.target.value);
                        if (passwordConfirmationError) setPasswordConfirmationError(false);
                        if (error) setError(false);
                      }}
                      onClick={(e) => {
                        if (passwordConfirmationError) setPasswordConfirmationError(false);
                        if (error) setError(false);
                      }}
                      margin="dense"
                      type={showPasswordValue ? "text" : "password"}
                      value={passwordConfirmationValue}
                      fullWidth
                      error={passwordConfirmationError || passwordValue!==passwordConfirmationValue ? true : false}
                      helperText={passwordConfirmationError ? passwordConfirmationError : passwordValue!==passwordConfirmationValue ? 'Пароли не совпадают' : null}
                    />

                    <div className={classes.formButtons}>
                      <Button
                        disabled={
                          sname.length === 0 ||
                          fname.length === 0 ||
                          (!noFthname && fthname.length === 0)
                        }
                        onClick={() => register()}
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                      >
                        Продолжить
                      </Button>
                    </div>
                  </>
                )}
                {activeStep === 3 && (
                  <div className={classes.logoWrapper}>
                    <Done style={{ color: "green", width: 140, height: 140 }} />
                    <Typography variant="h3">Успешно!</Typography>
                    <Typography
                      variant="h6"
                      style={{ padding: "15px 0px 5px 0px" }}
                    >
                      Осталось только
                    </Typography>
                    <UploadFileButton
                      label={"Загрузить фотографию"}
                      data={{method:'upload_avatar'}}
                      successCallback={setPhotoUploaded}
                      variant="contained"
                      color="primary"
                    />
                  </div>
                )}
              </>
            )}
          </Paper>
        </div>
      </Grid>
    </Grid>
  );
}

export default withRouter(Register);
