/* eslint-disable array-callback-return */
import React, { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogContent,
  Fab,
  Tooltip,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";
import { useEffect } from 'react';

const ControlableModal = ({
  onClose = ()=>{return true},
  openButtonTitle = "Открыть модальное окно",
  modalTitle = "Модальное окно",
  width = "xs",
  titleButtons= null,
  prerendered = false,
  open = false, // React.state varible
  setOpen = (value) => { }, // React.state function
  noOpenButton = false,
  children
}) => {
  const classes = useStyles();

  return (
    <>
      {!noOpenButton && (
        <Tooltip title={openButtonTitle} placement="top" arrow>
          <Fab color="primary" onClick={() => { setOpen(true);}}>
            <Add />
          </Fab>
        </Tooltip>
      )}
      {(open || prerendered) && (
        <Dialog
          // style={(prerendered && (open? {display:'block'}: {display:'none'}))}
          // open={(!prerendered ? open:true)}
          open={open}
          maxWidth={width}
          fullWidth
        >
          <DialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{modalTitle}</Typography>
            {titleButtons && (
              <div className={classes.modalTitle}>
                {titleButtons}
              </div>
            )}
            <IconButton
              className={classes.closeButton}
              onClick={() => {
                if (onClose() === true)
                  setOpen(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent style={{ display: "flex", flexDirection: "column" }}>
            {children}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ControlableModal;
