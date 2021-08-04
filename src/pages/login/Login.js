import React, { useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  TextField,
  Paper,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import useStyles from "./styles";
import Logo from "./../../components/Logo/index";
import {
  useUserDispatch,
  loginUser,
  logoutUser,
} from "./../../context/UserContext";
import Helmet from 'react-helmet';

const limitName = "attemptLimited";

const setLimit = (value) => {
  if (value) {
    let now = new Date().getTime();
    let timeout = 1000 * 60 * 5;
    //// let timeout = 1000 * 10;
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

function Login(props) {
  var classes = useStyles();
  var userDispatch = useUserDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginValue, setLoginValue] = useState("ayo");
  const [remember, setRemember] = useState(false);
  const [passwordValue, setPasswordValue] = useState("password");
  const [showPasswordValue, setShowPasswordValue] = useState(false);

  const [attemptLimit, setAttemptLimit] = useState(getLimit());
  const timer = React.useRef();

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

  return (<>
    <Helmet
      title="Вход"
    />
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
          <Paper elevation={6} className={classes.form}>
            <Logo type="simple" />

            {attemptLimit ? (
              <>
                <Typography color="error" className={classes.errorMessage}>
                  Превышено количество попыток входа, подождите 5 минут.
                </Typography>
              </>
            ) : (
              <>
                {error ? (
                  <Typography color="error" className={classes.errorMessage}>
                    {error}
                  </Typography>
                ) : null}

                <TextField
                  onChange={(e) => {
                    setLoginValue(e.target.value);
                    setError(false);
                  }}
                  onClick={(e) => {
                    if (error) setError(false);
                  }}
                  margin="normal"
                  type="email"
                  value={loginValue}
                  fullWidth
                  label="E-mail или Логин"
                  autoComplete="off"
                  autoFocus
                  error={error ? true : false}
                />

                <TextField
                  label="Пароль"
                  onKeyDown={(e) => {
                    if (
                      (e.key !== undefined && e.key === 13) ||
                      (e.keyCode !== undefined && e.keyCode === 13)
                    ) {
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        remember,
                        props.history,
                        setIsLoading,
                        setError,
                        setAttemptLimit,
                      );
                    }
                  }}
                  onChange={(e) => {
                    setPasswordValue(e.target.value);
                    setError(false);
                  }}
                  onClick={(e) => {
                    if (error) setError(false);
                  }}
                  type={showPasswordValue ? "text" : "password"}
                  value={passwordValue}
                  fullWidth
                  error={error ? true : false}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
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

                {/* <FormGroup aria-label="position" row>
                  <FormControlLabel
                    label="Запомнить меня"
                    labelPlacement="start"
                    control={
                      <Switch
                        checked={remember}
                        onClick={(e) => setRemember(!remember)}
                        color="primary"
                        classes={{
                          root: classes.switchRoot,
                          switchBase: classes.switchBase,
                          track: classes.track,
                          checked: classes.checked,
                        }}
                      />
                    }
                    className={classes.switchLabel}
                  />
                </FormGroup> */}
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      checked={remember}
                      onClick={(e) => setRemember(!remember)}
                    />
                  }
                  label="Запомнить меня"
                  className={classes.switchLabel}
                />

                <div className={classes.formButtons}>
                  <Button
                    color="primary"
                    size="large"
                    className={classes.forgetButton}
                    // disabled={isLoading}
                    // disabled
                    onClick={() =>
                      logoutUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                      )
                    }
                  >
                    Забыли пароль?
                  </Button>
                  {isLoading ? (
                    <CircularProgress
                      size={26}
                      className={classes.loginLoader}
                    />
                  ) : (
                    <Button
                      disabled={
                        loginValue.length === 0 || passwordValue.length === 0
                      }
                      onClick={() =>
                        loginUser(
                          userDispatch,
                          loginValue,
                          passwordValue,
                          remember,
                          props.history,
                          setIsLoading,
                          setError,
                          setAttemptLimit,
                        )
                      }
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Войти
                    </Button>
                  )}
                </div>

                {/* <Button style={{ display: 'flex',alignItems: 'center',justifyContent: 'center', margin: '5px 0px'}}
                    variant="contained"
                    fullWidth
                  >Забыли пароль</Button> */}
                <div className={classes.formButtons}>
                  <Button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 15,
                    }}
                    variant="outlined"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={() => {
                      props.history.push("/register");
                    }}
                  >
                    Регистрация
                  </Button>
                </div>
                {/* TODO: Add register blocks */}
              </>
            )}
          </Paper>
        </div>
      </Grid>
    </Grid>
    </>
  );
}

export default withRouter(Login);
