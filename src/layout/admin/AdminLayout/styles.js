import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "100vw",
    overflowX: "hidden",
    marginLeft: 320,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: `100%`,
    minHeight: "calc(100vh - 64px)",
    marginTop: 64,
  },
  contentShift: {
    width: `calc(100vw - ${320 + theme.spacing(6)}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  link: {
    '&:not(:first-child)': {
      paddingLeft: 15
    }
  }
}));
