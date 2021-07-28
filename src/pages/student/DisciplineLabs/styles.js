import { makeStyles } from "@material-ui/styles";
import { red, orange, green, blue } from "@material-ui/core/colors";

export default makeStyles((theme) => ({
  paper: {
    padding: "6px 16px",
  },
  date: {
    padding: "6px 5px",
  },
  separatorDate: {
    padding: "30px",
  },
  dayIcon: {
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
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
    justifyContent: 'flex-start',
  },
}));
