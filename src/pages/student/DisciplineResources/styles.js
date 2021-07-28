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
        backgroundColor: red[500],
        color: 'white',
        fontSize: 20,
        '&:hover': {
            backgroundColor: red[700],
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
        backgroundColor: blue[500],
        color: 'white',
        fontSize: 20,
        '&:hover': {
            backgroundColor: blue[700],
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
