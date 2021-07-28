import React, { useState, useEffect } from "react";
import {
  IconButton,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Switch,
  InputAdornment,
} from "@material-ui/core";
import { Add, Visibility, VisibilityOff } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import API from "../../services/API";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";
import MuiTable from "../MuiTable";
import { FormControlLabel } from "@material-ui/core";

const SecureOptionSwitcher = ({
  passwordValue,
  setPasswordValue,
  label,
  hidden,
  allowed,
  setAllowed,
}) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showPasswordValue, setShowPasswordValue] = useState(false);

  const checkPassword = async () => {
    setLoading(true);
    await API.call({
      method: "check_password",
      password: passwordValue,
    }).then((result) => {
      setLoading(false);
      if (result.success) {
        setModalOpen(false);
        setAllowed(true);
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <>
      {!hidden && (
        <FormControlLabel
          value="start"
          control={
            <Switch
              color="primary"
              checked={allowed}
              onChange={() => {
                if (passwordValue === "" && !allowed) {
                  setModalOpen(true);
                } else {
                  setPasswordValue("");
                  setAllowed(false);
                }
              }}
            />
          }
          label={label}
          labelPlacement="start"
        />
      )}

      {modalOpen && (
        <Dialog open={modalOpen} fullWidth={true} maxWidth={"xs"}>
          <DialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{" Подтверждение паролем "}</Typography>
            {!loading && (
              <IconButton
                className={classes.closeButton}
                onClick={() => {
                  setModalOpen(false);
                  setAllowed(false);
                  setPasswordValue("");
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
          {loading ? (
            <DialogContent>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: 200,
                  alignItems: "center",
                }}
              >
                <CircularProgress color="primary" size={40} />
              </div>
            </DialogContent>
          ) : (
            <DialogContent style={{ display: "flex", flexDirection: "column" }}>
              <TextField
                label="Пароль"
                variant="outlined"
                autoFocus
                onKeyDown={(e) => {
                  if (
                    (e.key !== undefined && e.key === 13) ||
                    (e.keyCode !== undefined && e.keyCode === 13)
                  ) {
                    checkPassword();
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
                helperText={error}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPasswordValue(!showPasswordValue)}
                        onMouseDown={(event) => event.preventDefault()}
                      >
                        {showPasswordValue ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                onClick={() => {
                  checkPassword();
                }}
                color="primary"
                variant="contained"
                fullWidth
                style={{ margin: "15px 0px" }}
              >
                Включить
              </Button>
            </DialogContent>
          )}
        </Dialog>
      )}
    </>
  );
};

export default SecureOptionSwitcher;
