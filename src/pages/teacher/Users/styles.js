import { makeStyles } from "@material-ui/styles";
import { red, orange, blue, green } from '@material-ui/core/colors';


export default makeStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    NewStatusButton: {
        color: theme.palette.info.main,
    },
    ReloadStatusButton: {
        color: theme.palette.warning.dark,
    },
    tableOverflow: {
    overflow: 'auto'
    },
    errorMessage: {
        textAlign: "center",
        borderLeft: '2px solid ' + theme.palette.error.main,
        marginBottom: '30px',
    },
    B2: {
        color: red[500],
        '&:hover': {
            color: red[700],
            backgroundColor: red[100],
        }
    },
    B3: {
        backgroundColor: orange[500],
        color: 'white',
        fontSize: 20,
        '&:hover': {
            backgroundColor: orange[700],
        }
    },
    B4: {
        color: blue[500],
        '&:hover': {
            color: blue[700],
            backgroundColor: blue[100],
        }
    },
    B5: {
        backgroundColor: green[500],
        color: 'white',
        fontSize: 20,
        '&:hover': {
            backgroundColor: green[700],
        }
    },
}));
