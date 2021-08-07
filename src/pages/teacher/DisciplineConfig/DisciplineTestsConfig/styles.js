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
        backgroundColor: green[500],
        color: 'white',
        fontSize: 20,
        '&:hover': {
            backgroundColor: green[700],
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
    editorLabel: {
        color: '#6E6E6E',
        fontSize: '0.75rem',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: '400',
        lineHeight: '1',
        letterSpacing: '0.00938em',
        padding: '10px 10px',
        marginBottom: -17,
        zIndex: 10,
    },
    editorLabelText: {
        backgroundColor: 'white',
        padding: '0px 5px',
        fontSize: '0.75rem',
    }
}));
