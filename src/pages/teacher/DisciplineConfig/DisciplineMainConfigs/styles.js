import { makeStyles } from "@material-ui/styles";
import { red, orange, blue, green } from '@material-ui/core/colors';


export default makeStyles(theme => ({
    NewStatusButton: {
        color: theme.palette.info.main,
    },
    ReloadStatusButton: {
        color: theme.palette.warning.dark,
    },
    tableOverflow: {
    overflow: 'auto'
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
        color: green[500],
        '&:hover': {
            color: green[700],
            backgroundColor: green[100],
        }
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top:10,
    },
    titleButton: {
        position: 'absolute',
        right: 10,
        top:15,
    },
    modalTitle: {
        margin: 0,
        display: 'flex',
        justifyContent: 'space-between',
        marginLeft: 0,
    },
}));
