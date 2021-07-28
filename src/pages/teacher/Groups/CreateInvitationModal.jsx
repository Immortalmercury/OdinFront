/* eslint-disable array-callback-return */
import React, { useState } from "react";
import {
  IconButton,
  Button,
  Dialog,
  DialogContent,
  TextField,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import API from "../../../services/API";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";
import MuiTable from "../../../components/MuiTable";

const convertData = (data) => {
  let newData = [];
  if (data !== null)
    // console.log(data);
    for (let index = 0; index < data.length; index++) {
      const el = data[index];
      newData.push([
        el.login,
        el.role === 91
          ? "Студента " + el.id_group
          : el.role === 92
          ? "Преподавателя"
          : el.role === 93
          ? "Администратора"
          : "Не определено",
      ]);
    }
  return newData;
};

const getInvitations = async (
  invitationsCount,
  role,
  group,
  setData,
  setIsLoading,
  setError,
) => {
  setIsLoading(true);
  setError(false);
  await API.call({
    method: "create_students",
    invitationsCount,
    group,
  }).then((result) => {
    setIsLoading(false);
    if (result.success) {
      console.log(result.data);
      setData(result.data);
    } else {
      setError(result.message);
    }
  });
};

const CreateInvitationModal = ({ appendDataCallback, group }) => {
  const [invitationModal, setInvitationModal] = useState(false);
  const [invitationsCount, setInvitationsCount] = useState(1);
  const [role] = useState(91);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(false);
  const classes = useStyles();

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setInvitationModal(true)}
      >
        Создать приглашения
      </Button>
      {invitationModal && (
        <Dialog
          open={invitationModal}
          fullWidth={true}
          maxWidth={!data ? "xs" : "sm"}
        >
          <DialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{" Создание приглашений "}</Typography>
            {!isLoading && (
              <IconButton
                className={classes.closeButton}
                onClick={() => {
                  setInvitationModal(false);
                  if (data) appendDataCallback(data);
                  setData(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
          {isLoading ? (
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
          ) : data ? (
            <MuiTable
              title={[
                "Пожалуйста распечатайте или при печати сохраните как PDF",
              ]}
              data={convertData(data)}
              columns={["Приглашение студента "+group]}
              print={true}
              search={false}
              viewColumns={false}
              noMatch="Приглашений нет"
            />
          ) : (
            <DialogContent style={{ display: "flex", flexDirection: "column" }}>
              {error ? (
                <Typography color="error" className={classes.errorMessage}>
                  {error}
                </Typography>
              ) : null}
              <TextField
                label="Количество приглашений"
                type="number"
                variant="outlined"
                value={invitationsCount}
                onChange={(e) => setInvitationsCount(e.target.value)}
              />
              <Button
                onClick={() =>
                  getInvitations(
                    invitationsCount,
                    role,
                    group,
                    setData,
                    setIsLoading,
                    setError,
                  )
                }
                color="primary"
                variant="contained"
                fullWidth
                style={{ margin: "15px 0px" }}
              >
                Создать
              </Button>
            </DialogContent>
          )}
        </Dialog>
      )}
    </>
  );
};

export default CreateInvitationModal;
