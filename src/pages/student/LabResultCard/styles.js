import { makeStyles } from "@material-ui/styles";
import { red, blue, orange, green } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  myTheme: {
    width: "100%",
    // height: 100,
    display: "flex",
    marginTop: 10,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  myThemeContent: {
    // width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  myThemeTitle: {
    // width: "100%",
    // width: 150,
    // height: 100,
    display: "flex",
    flexDirection: "column",
    marginRight: 10,
    // padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  myThemeButtons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingLeft: 40,
  },
  themes: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    // height: 100,
    marginTop: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  redDot: {
    backgroundColor: red[700],
  },
  blueDot: {
    backgroundColor: blue[800],
  },
  orangeDot: {
    backgroundColor: orange[500],
  },
  greenDot: {
    backgroundColor: green[500],
  },
  redText: {
    color: red[700],
  },
  blueText: {
    color: blue[800],
  },
  orangeText: {
    color: orange[500],
  },
  greenText: {
    color: green[500],
  },
  monthText: {
    marginBottom: 5,
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
  dashedTail: {
    backgroundColor: "transparent",
    border: "1px dashed " + theme.palette.secondary.main,
  },
  oppositeContent: {
    padding: 0,
    flex: 0,
  },
  hidden: {
    display: "none",
  },
  completeCol: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
}));
