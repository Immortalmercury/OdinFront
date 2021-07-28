import { makeStyles } from "@material-ui/styles";
import { green, red, purple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    color: "white",
    borderColor: 'transparent',
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[500],
      borderColor: 'transparent',
  },
  },
  buttonError: {
    backgroundColor: red[500],
    color: 'white',
    '&:hover': {
      backgroundColor: red[700],
      color: 'white',
    },
  },
  iconButtonWrapper: {
    position: 'relative',
  },
  iconButtonSuccess: {
    color: green[700],
    backgroundColor: green[100],
    '&:hover': {
      color: green[900],
      backgroundColor: green[200],
    },
  },
  iconButtonError: {
    color: red[700],
    backgroundColor: red[100],
    '&:hover': {
      color: red[900],
      backgroundColor: red[200],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  uploadIconButtonProgress: {
    color: green[500],
    position: 'absolute',
    top: -2,
    left: -2,
    zIndex: 0,
  },
  downloadIconButtonProgress: {
    color: purple[500],
    position: 'absolute',
    top: -2,
    left: -2,
    zIndex: 0,
  },
  }));