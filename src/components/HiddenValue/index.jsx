import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DialogContentText from "@material-ui/core/DialogContentText";
import { Button } from '@material-ui/core';

const styles = (theme) => ({
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
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const HiddenValue = ({
  label,
  text,
  icon,
  customLabel = false,
  buttonType = "IconButton",
  buttonProps = [],
  buttonText,
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      {
        (buttonType === "IconButton" ? (
          <IconButton
            onClick={() => {
              setOpen(true);
            }}
          >
            {icon !== undefined ? icon : <VisibilityIcon />}
          </IconButton>
        ) : (
          <Button  
            onClick={() => {
              setOpen(true);
              }}
              {...buttonProps}
          >
            {buttonText}
          </Button>
        ))
      }
      {open && (
        <Dialog
          open={open}
          fullWidth={true}
          maxWidth={"xs"}
          onClose={() => setOpen(false)}
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={() => setOpen(false)}
          >
            {customLabel ? customLabel : <>Скрытое значение {label && label}</>}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{text}</DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default HiddenValue;
