import { makeStyles } from "@material-ui/styles";

const drawerWidth = 240;

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
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    zIndex: 1000,
  },
  drawerPaper: {
    width: drawerWidth,
    justifyContent: 'space-between',
    marginTop: 138,
    marginBottom: 150,
    maxHeight: 'calc(100vh - 288px)',
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
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
  /* sidebarList: {
    marginTop: theme.spacing(6),
  }, */
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
  progress: {
    visibility: "hidden",
  },
  
  notificationBody: {
    flexGrow:1,
  },
  notificationItem: {
    marginTop: theme.spacing(2),
  },
  notificationCloseButton: {
    position: "absolute",
    right: theme.spacing(3),
  },
  toastsContainer: {
    width: 400,
    marginTop: theme.spacing(1),
    right: 0,
  },
  notification: {
    display: "flex",
    alignItems: "center",
    background: "transparent",
    boxShadow: "none",
    overflow: "visible",
    marginBottom: 0,
    padding: "0px 7px",
  },
}));
