/* The component style is inserted here. */
import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        maxWidth: "100vw",
        overflowX: "hidden",
        height: 'calc(100vh - 48px)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        // width: `calc(100vw - ${240 + theme.spacing(6)}px)`,
        transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        }),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer - 1,
        color: '#fff',
        marginLeft: 240,
        },
}));
