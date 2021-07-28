/* The component style is inserted here. */
import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
//   root: {
//     display: "flex",
//     maxWidth: "100vw",
//     overflowX: "hidden",
//   },
//   content: {
//     flexGrow: 1,
//     padding: theme.spacing(3),
//     width: `calc(100vw - 240px)`,
//     minHeight: "100vh",
//   },
//   contentShift: {
//     width: `calc(100vw - ${240 + theme.spacing(6)}px)`,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   },
//   fakeToolbar: {
//     ...theme.mixins.toolbar,
//   },
//   link: {
//     '&:not(:first-child)': {
//       paddingLeft: 15
//     }
//   }
    paper: {
        width: "540px",
        alignItems: 'center',
    },
    profileContainer: {
        width: '90%',
        height: 250,
        margin: 10,
        // padding: 30,
        // paddingTop:50,
        // paddingBottom:50,
    },
    profilePhoto: {
        height: 250,
        boxShadow: '-50px 0px 31px -67px #000000 inset',
        borderRadius: 0,
    },
    profileInfo: {
        height: 250,
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    root: {
        flexGrow: 1,
        backgroundColor: 'black',
        color: 'white',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    switchRoot: {
        margin: "0",
        // margin: "15px 0px 0px 0px",
        color: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      },
      switchLabel: {
          color: theme.palette.type === 'light' ? theme.palette.grey[900] : theme.palette.grey[50],
          margin: 0,
        marginBottom: '10px',
        width: '100%',
        justifyContent: 'space-between',
      },
      switchBase: {
        marginLeft: "0",
        color: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        '&$checked': {
          color: theme.palette.primary,
        },
        '&$checked + $track': {
        },
      },
}));
