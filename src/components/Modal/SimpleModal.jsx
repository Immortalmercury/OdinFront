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

const SimpleModal = ({
  onClose = (()=>{})(),
  openButtonTitle = "Открыть модальное окно",
  modalTitle = "Модальное окно",
  width = "xs",
  titleButtons= null,
  children
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const classes = useStyles();

  return (
    <>
      <Tooltip title={openButtonTitle} placement="top" arrow>
        <Fab color="primary" onClick={() => setModalOpen(true)}>
          <Add />
        </Fab>
      </Tooltip>
      {modalOpen && (
        <Dialog
          open={modalOpen}
          fullWidth={true}
          maxWidth={width}
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
                modalOpen(false);
                onClose();
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

export default SimpleModal;
