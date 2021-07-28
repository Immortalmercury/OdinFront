import { makeStyles } from "@material-ui/styles";
import { red,common, grey } from '@material-ui/core/colors';

const drawerWidth = 320;
const backgroundClr = '#2C2C2C';
const textColor = grey[300];
const profileHeight = 150;

export default makeStyles(theme => ({
  scrollbars: {
    '&::-webkit-scrollbar': {
      width: 24, /* ширина для вертикального скролла */
      height: 8, /* высота для горизонтального скролла */
      backgroundColor: '#143861',
    },

    /* ползунок скроллбара */
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#843465',
      borderRadius: '9em',
      boxShadow: 'inset 1px 1px 10px #f3faf7',
    },

    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#253861',
    },

    /* Стрелки */

    '&::-webkit-scrollbar-button:vertical:start:decrement': {
      background: 'linear-gradient(120deg, #02141a 40%, rgba(0, 0, 0, 0) 41%), linear-gradient(240deg, #02141a 40%, rgba(0, 0, 0, 0) 41%), linear-gradient(0deg, #02141a 30%, rgba(0, 0, 0, 0) 31%)',
      backgroundColor: '#f6f8f4',
    },

    '&::-webkit-scrollbar-button:vertical:end:increment': {
      background:
        'linear-gradient(300deg, #02141a 40%, rgba(0, 0, 0, 0) 41%),' +
        'linear-gradient(60deg, #02141a 40%, rgba(0, 0, 0, 0) 41%),' +
        'linear-gradient(180deg, #02141a 30%, rgba(0, 0, 0, 0) 31%)',
      backgroundColor: '#f6f8f4',
    },

    '&::-webkit-scrollbar-button:horizontal:start:decrement': {
      background: 'linear-gradient(30deg, #02141a 40%, rgba(0, 0, 0, 0) 41%), linear-gradient(150deg, #02141a 40%, rgba(0, 0, 0, 0) 41%), linear-gradient(270deg, #02141a 30%, rgba(0, 0, 0, 0) 31%)',
      backgroundColor: '#f6f8f4',
    },

    '&::-webkit-scrollbar-button:horizontal:end:increment': {
      background: 'linear - gradient(210deg, #02141a 40 %, rgba(0, 0, 0, 0) 41 %), linear - gradient(330deg, #02141a 40 %, rgba(0, 0, 0, 0) 41 %), linear - gradient(90deg, #02141a 30 %, rgba(0, 0, 0, 0) 31 %)',
      backgroundColor: '#f6f8f4',
    },
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  profile_btn: {
    cursor: 'poiner',
  },
  profile_btn2: {
    cursor: 'poiner',
    borderColor: grey[500],
      color: grey[500],
    '&:hover': {
      borderColor: grey[100],
      color: grey[100],
    }
  },
  exit_btn: {
    cursor: 'poiner',
    borderColor: red[700],
    color: red[700],
    '&:hover': {
      borderColor: red[300],
      color: red[300],
    }
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    zIndex: 1000,
    backgroundColor: backgroundClr,
  },
  profileCard: {
    height: profileHeight,
    width: 320,
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: backgroundClr,
    borderRadius: 0,
  },
  profileCardContent: {
    display: 'flex',
    // flexDirection: 'column',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
    color: textColor,
  },
  drawerPaper: {
    width: drawerWidth,
    justifyContent: 'space-between',
    marginTop: profileHeight,
    maxHeight: 'calc(100vh - '+profileHeight+'px)',
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: backgroundClr,
  },
  toolbar: {
    ...theme.mixins.toolbar,
    [theme.breakpoints.down("lg")]: {
      display: "none",
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  sidebarList: {
    // marginTop: theme.spacing(6),
    backgroundColor: backgroundClr,
    color: textColor,
    marginRight: 0,
  }, 
  mobileBackButton: {
    marginTop: theme.spacing(0.5),
    marginLeft: 18,
    [theme.breakpoints.only("sm")]: {
      marginTop: theme.spacing(0.625),
    },
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));
