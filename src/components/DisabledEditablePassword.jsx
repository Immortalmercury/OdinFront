import React from 'react';
import { Grid, InputAdornment,TextField,IconButton } from '@material-ui/core';
import {
  // Edit, Done, Close,
  Https
} from '@material-ui/icons';
import { useState } from 'react';
import { makeStyles } from "@material-ui/styles";
import { Visibility } from '@material-ui/icons';
import { VisibilityOff } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import { Edit } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  success_btn: {
    marginLeft:10,
    color: 'white',
    backgroundColor: theme.palette.success.light,
    '&:hover': {
      backgroundColor: theme.palette.success.main,
    }
  },
  danger_btn: {
    color: theme.palette.warning.light,
    '&:hover': {
      color: theme.palette.warning.main,
    }
  },
  btn: {
    color: theme.palette.primary.light,
    '&:hover': {
      color: theme.palette.primary.main,
    }
  },
  primary_color: {
    color: theme.palette.primary.main,
  }
}));

const DisabledEditablePassword = ({ onSave, error }) => {
  const classes = useStyles();
  const [editable, setEditable] = useState(false);
  const [fieldError, setFieldError] = useState(error);
  const [oldPasswordValue, setOldPasswordValue] = useState("");
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [newPasswordConfirmationValue, setNewPasswordConfirmationValue] = useState("");
  const [showPasswordValue, setShowPasswordValue] = useState(false);
  return (
    <Grid container spacing={1} alignItems="flex-end">
      {!editable ? (<>
        <Grid item xs={1} classes={(editable?({root:classes.primary_color}):({}))}>
          <Https/>
        </Grid>
        <Grid item xs={11}>        
        <TextField
          label="Пароль"
          value="**********"
          type="password"
          fullWidth
          disabled
          InputProps={{
            endAdornment :
            <InputAdornment position="end">
              <IconButton
                className = {classes.btn}
                onClick={() => setEditable(true)}
                  onMouseDown={(event) => event.preventDefault()}
                  
              >
                <Edit />
              </IconButton>
            </InputAdornment>
          }}
          />
      </Grid>
      </>) : (<>
          
        <Grid item xs={1} classes={(editable?({root:classes.primary_color}):({}))}>
          <Https/>
        </Grid>
        <Grid item xs={11}>        
          <TextField
              label="Старый пароль"
              onChange={(e) => { setOldPasswordValue(e.target.value); setFieldError(false); }}
              onClick={(e) => { if (error) setFieldError(false); }}
              type={showPasswordValue ? 'text' : 'password'}
              value={oldPasswordValue}
              fullWidth
              error={fieldError ? true : false}
              InputProps={{
                endAdornment:
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPasswordValue(!showPasswordValue)}
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      {showPasswordValue ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
              }}
            />
          </Grid>
        <Grid item xs={1} classes={(editable?({root:classes.primary_color}):({}))}>
            <div style={{width:32}}/>
        </Grid>
        <Grid item xs={11}>        
          <TextField
              label="Новый пароль"
              onChange={(e) => { setNewPasswordValue(e.target.value); setFieldError(false); }}
              onClick={(e) => { if (error) setFieldError(false); }}
              type={showPasswordValue ? 'text' : 'password'}
              value={newPasswordValue}
              fullWidth
              error={fieldError}
              InputProps={{
                endAdornment:
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPasswordValue(!showPasswordValue)}
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      {showPasswordValue ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
              }}
            />
          </Grid>
        <Grid item xs={1} classes={(editable?({root:classes.primary_color}):({}))}>
            <div style={{width:32}}/>
        </Grid>
        <Grid item xs={11}>        
          <TextField
              label="Подтвердите пароль"
              onChange={(e) => { setNewPasswordConfirmationValue(e.target.value); setFieldError(false); }}
              onClick={(e) => { if (error) setFieldError(false); }}
              type={showPasswordValue ? 'text' : 'password'}
              value={newPasswordConfirmationValue}
              fullWidth
              error={fieldError}
              InputProps={{
                endAdornment:
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPasswordValue(!showPasswordValue)}
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      {showPasswordValue ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
              }}
            />
          </Grid>
          <div style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'flex-end',
          marginTop: 10,
            }}>
              <Button className={classes.danger_btn} onClick={() => setEditable(false)} variant="outlined">Отмена</Button>
              <Button className={classes.success_btn} variant="contained" color="success">Изменить</Button>
          </div>
          
          
          
        
      </>)}
      
    </Grid>
  );
}

export default DisabledEditablePassword;
