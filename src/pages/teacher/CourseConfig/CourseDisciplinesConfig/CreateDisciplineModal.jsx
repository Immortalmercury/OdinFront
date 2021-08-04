/* eslint-disable array-callback-return */
import React, { useState } from "react";
import {
  IconButton,
  Button,
  Dialog,
  DialogContent,
  Fab,
  Tooltip,
  TextField,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";
import API from "../../../../services/API";
import MuiTable from './../../../../components/MuiTable/index';

const CreateDisciplineModal = ({ course, callback }) => {
  const [invitationModal, setInvitationModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(false);
  const classes = useStyles();

  const [description, setDescription] = useState("");

  const createGroup = async () => {
    setIsLoading(true);
    setError(false);
    await API.call({
      method: "create_discipline",
      description: description,
      appendToCourse: course,
    }).then((result) => {
      setIsLoading(false);
      if (result.success) {
        console.log(result.data);
        setData(result.data);
        // if (invitationsCount === 0) {
          setInvitationModal(false);
          setData(false);
        callback(result.data);
        setDescription("");
        // }
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <>
      <Tooltip title="Создать группу" placement="top" arrow>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => setInvitationModal(true)}>
          Создать новую
        </Button>
      </Tooltip>
      {invitationModal && (
        <Dialog
          open={invitationModal}
          fullWidth={true}
          maxWidth={!data ? "xs" : "sm"}
        >
          <DialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{" Создание дисциплины "}</Typography>
            {!isLoading && (
              <IconButton
                className={classes.closeButton}
                onClick={() => {
                  setInvitationModal(false);
                  setData(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
          <DialogContent style={{ display: "flex", flexDirection: "column" }}>
            {error ? (
              <Typography color="error" className={classes.errorMessage}>
                {error}
              </Typography>
            ) : null}
            <TextField
              label="Название дисциплины"
              type="text"
              focused
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button
              onClick={() => createGroup()}
              color="primary"
              variant="contained"
              fullWidth
              style={{ margin: "15px 0px" }}
            >
              Создать
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CreateDisciplineModal;
