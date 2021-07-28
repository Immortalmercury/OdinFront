import React from 'react';
import { Grid, InputAdornment,TextField,IconButton } from '@material-ui/core';
import { Edit, Done, Close } from '@material-ui/icons';
import {  } from '@material-ui/core';
import { useState } from 'react';
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  success_btn: {
    color: theme.palette.success.light,
    '&:hover': {
      color: theme.palette.success.main,
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

const DisabledEditableTextfield = ({ label, value, id, icon, type, onSave, error }) => {
  const classes = useStyles();
  const [editable, setEditable] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);
  const [fieldError, setFieldError] = useState(error);
  return (
    <Grid container spacing={1} alignItems="flex-end">
      <Grid item xs={1} classes={(editable?({root:classes.primary_color}):({}))}>
       {icon}
      </Grid>
      <Grid item xs={11}>
               
        <TextField
          onChange={(e) => { setFieldValue(e.target.value) }}
          onClick={(e) => { if (fieldError) setFieldError(false);}}
          label={label}
          value={fieldValue}
          type={type}
          id={id}
          fullWidth
          disabled={!editable}
          error = {fieldError? true:false}
          InputProps={{
            endAdornment :
            <InputAdornment position="end">
                {editable ? (
                  <>
                    <IconButton
                      className = {classes.success_btn}
                      onClick={(e) => { if (onSave) { onSave(e); } setEditable(false); }}
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      <Done />
                    </IconButton>
                    <IconButton
                      className = {classes.danger_btn}
                      onClick={() => { setEditable(false); setFieldValue(value);}}
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      <Close />
                    </IconButton>
                  </>
                ) : (
                  <IconButton
                    className = {classes.btn}
                    onClick={() => setEditable(true)}
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    <Edit />
                  </IconButton>
                )}
            </InputAdornment>
          }}/>
      </Grid>
    </Grid>
  );
}

export default DisabledEditableTextfield;
