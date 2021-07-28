/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import {
  IconButton,
  Button,
  Dialog,
  DialogContent,
  Fab,
  Tooltip,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
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
    method: "create_invitations",
    invitationsCount,
    role,
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

const CreateInvitationsModal = ({ appendDataCallback }) => {
  const [invitationModal, setInvitationModal] = useState(false);
  const [invitationsCount, setInvitationsCount] = useState(1);
  const [role, setRole] = useState(null);
  const [group, setGroup] = useState(null);
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectGroupOpen, setSelectGroupOpen] = useState(false);
  const groupLoading = selectGroupOpen && groupOptions.length === 0;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    let active = true;

    if (!groupLoading) return undefined;

    (async () => {
      const groups = await API.call({
        method: "groups",
      }).then((result) => {
        if (result.success) {
          return result.data;
        }
      });

      if (active) {
        let tempData = ["Без группы"];
        Object.entries(groups).map((e) => {
          tempData.push(e[1].id_group);
        });
        setGroupOptions(tempData);
      }
    })();

    return () => {
      active = false;
    };
  }, [groupLoading]);

  useEffect(() => {
    if (!selectGroupOpen) {
      setGroupOptions([]);
    }
  }, [selectGroupOpen]);

  return (
    <>
      <Tooltip title="Создать приглашение" placement="top" arrow>
        <Fab color="primary" onClick={() => setInvitationModal(true)}>
          <Add />
        </Fab>
      </Tooltip>
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
                  setInvitationModal(false)
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
                title={["Пожалуйста распечатайте или при печати сохраните как PDF"]}
                data={convertData(data)}
                columns={["Приглашение", "В качестве"]}
                filter={true}
                print={true}
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
              <TextField
                select
                label="В качестве"
                variant="outlined"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  marginTop: 15,
                }}
              >
                <MenuItem value={"student"}>Студента</MenuItem>
                <MenuItem value={"teacher"}>Преподавателя</MenuItem>
                <MenuItem value={"admin"}>Администратора</MenuItem>
              </TextField>
              {role === "student" && (
                <Autocomplete
                  value={group}
                  onChange={(event, newValue) => {
                    setGroup(newValue);
                  }}
                  open={selectGroupOpen}
                  onOpen={() => setSelectGroupOpen(true)}
                  onClose={() => setSelectGroupOpen(false)}
                  getOptionSelected={(option, value) => option === value}
                  getOptionLabel={(option) => option}
                  options={groupOptions}
                  loading={groupLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Группы"
                      variant="outlined"
                      style={{
                        marginTop: 15,
                      }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {groupLoading && (
                              <CircularProgress color="inherit" size={20} />
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}

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

export default CreateInvitationsModal;
