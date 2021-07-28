import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  notificationContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: 0,
    padding: "0px 7px",
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
  notificationContained: {
    borderRadius: 7,
    height: 'auto',
    boxShadow: theme.customShadows.widgetDark,
  },
  notificationContainedShadowless: {
    boxShadow: "none",
  },
  notificationIconContainer: {
    minWidth: 45,
    height: 45,
    borderRadius: 45,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
  },
  notificationIconContainerContained: {
    fontSize: 18,
    color: "#FFFFFF80",
  },
  notificationIconContainerRounded: {
    marginRight: theme.spacing(2),
  },
  containedTypography: {
    color: "white",
  },
  messageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexGrow: 1,
    padding: "5px 30px 5px 0px"
  },
  extraButton: {
    color: "white",
    "&:hover, &:focus": {
      background: "transparent",
    },
  },
}));
