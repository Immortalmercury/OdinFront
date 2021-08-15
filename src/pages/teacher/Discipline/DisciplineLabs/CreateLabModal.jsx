/* eslint-disable array-callback-return */ 
// import 'date-fns';
// import DateFnsUtils from '@date-io/date-fns';
// import ruLocale from "date-fns/locale/ru";
// import {
//   KeyboardDateTimePicker,
//   DateTimePicker,
//   DatePicker,
//   MuiPickersUtilsProvider,
// } from '@material-ui/pickers';
// import React, { useState, useEffect } from "react";
// import {
//   IconButton,
//   Button,
//   Dialog,
//   DialogContent,
//   TextField,
//   Tooltip,
//   Fab,
//   Checkbox,
// } from "@material-ui/core";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import { Typography } from "@material-ui/core";
// import CloseIcon from "@material-ui/icons/Close";
// import useStyles from "./styles";
// import { Add, Publish } from "@material-ui/icons";
// import UploadFileButton from "../../../../components/FileButtons/UploadFileButton";
// import API from "../../../../services/API";
// import AttachmentIcon from '@material-ui/icons/Attachment';
// import AttachFileIcon from '@material-ui/icons/AttachFile';
// import { FormControlLabel } from "@material-ui/core";
// import RequestButton from '../../../../components/FileButtons/RequestButton';

// const getInvitations = async (
//   discipline,
//   role,
//   group,
//   setData,
//   setIsLoading,
//   setError,
// ) => {
//   setIsLoading(true);
//   setError(false);
//   await API.call({
//     method: "get_config",
//     discipline,
//     group,
//   }).then((result) => {
//     setIsLoading(false);
//     if (result.success) {
//       console.log(result.data);
//       setData(result.data);
//     } else {
//       setError(result.message);
//     }
//   });
// };
import React from 'react';

const CreateLabModal = ({ appendDataCallback, group }) => {
  // const classes = useStyles();
  // const [open, setOpen] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);
  // const [data, setData] = useState(false);
  // const [openLab, setOpenLab] = useState(false);
  // const [deadlineNeed, setDeadlineNeed] = useState(null);
  // const [deadline, setDeadline] = useState(null);

  // const [description, setDescription] = useState('');
  // const [comment, setComment] = useState('');

  // useEffect(() => {
  //   return (() => {
  //     setComment('');
  //     setDescription('');
  //     setOpenLab(false);
  //     setDeadlineNeed(null);
  //     setDeadline(null);
  //   })
  // }, [open]);

  return (
    <>
      {/* <Tooltip title="Создать лабораторную" placement="top" arrow>
        <Fab color="primary" onClick={() => setOpen(true)}>
          <Add />
        </Fab>
      </Tooltip>
      {open && (
        <Dialog
          open={open}
          fullWidth={true}
          maxWidth={"xs"}
        >
          <DialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{" Добавление лабораторной работы "}</Typography>
            {!loading && (
              <IconButton
                className={classes.closeButton}
                onClick={() => {
                  setOpen(false);
                  if (data) appendDataCallback(data);
                  setData(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
          {loading ? (
            <DialogContent>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: 200,
                  alignItems: "center",
                }}
              >
                <CircularProgress color="primary" size={40} />
              </div>
            </DialogContent>
          ) : (
            <DialogContent style={{ display: "flex", flexDirection: "column" }}>
              {error ? (
                <Typography color="error" className={classes.errorMessage}>
                  {error}
                </Typography>
              ) : null}
              
              <TextField
                label="Номер лабы"
                multiline
                type="text"
                variant="outlined"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ margin: "15px 0px" }}
                />
              
                
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ ruLocale }>
                        <DatePicker
                          clearable
                          ampm={false}
                          disablePast
                          margin="normal"
                          inputVariant="outlined"
                          value={deadlineNeed}
                          onChange={setDeadlineNeed}
                          format="dd MMMM yyyy"
                          label="Доступно после"
                        />
                      </MuiPickersUtilsProvider>
                      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ ruLocale }>
                        <DatePicker
                          clearable
                          ampm={false}
                          disablePast
                          margin="normal"
                          inputVariant="outlined"
                          value={deadline}
                          onChange={setDeadline}
                          format="dd MMMM yyyy"
                          label="Дата дедлайна (включительно)"
                        />
                      </MuiPickersUtilsProvider>
              <RequestButton
                color="primary"
                variant="contained"
                fullWidth
                style={{ margin: "15px 0px" }}
                  requestData={{
                    method: 'create_config',
                    lab:comment,
                    group:group,
                    allowed_after: deadlineNeed,
                    deadline: (deadline!==null? deadline.toISOString():null)
                  }}
                  label="Добавить"
                  buttonType={"Button"}
                  successCallback={(data) => {
                    setOpen(false);
                    if (appendDataCallback!==undefined)
                      appendDataCallback(data);
                  }}
                  errorCallback={(msg) => {
                    setError(msg);
                  }}
              />
            </DialogContent>
          )}
        </Dialog>
      )} */}
    </>
  );
};

export default CreateLabModal;
