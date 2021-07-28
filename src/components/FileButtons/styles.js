import { makeStyles } from "@material-ui/styles";
import { green, red } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  wrapperFullWidth: {
    margin: 0,
    width:"100%",
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
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
    color: theme.palette.primary.main,
    position: 'absolute',
    top: -2,
    left: -2,
    zIndex: 0,
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  }));