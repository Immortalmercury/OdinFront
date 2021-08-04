/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import {
  IconButton,
  Button,
  Dialog,
  DialogContent,
  Tooltip,
  Fab,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import API from "../../../../services/API";
import HiddenValue from "../../../../components/HiddenValue";
import SecondsToRusTime from "../../../../components/SecondsToRusTime";
import MuiTable from "../../../../components/MuiTable";

const AddStudentModal = ({ appendDataCallback, course }) => {
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  // const [progress, setProgress] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(false);
  const classes = useStyles();
  const [userProgressId, setUserProgressId] = useState(false);

  const addToCourse = async (user) => {
    setUserProgressId(user);
    // setProgress(true);
    setError(false);
    await API.call({
      method: "addStudentToCourse",
      course,
      user,
    }).then((result) => {
      console.log(result);
      if (result.success) {
        appendDataCallback([result.data]);
        
      } else {
        // setProgress(false);
        setError(result.message);
      }
    });
    await loadData(false);
    setUserProgressId(false);
  };

  const loadData = async (reload = true) => {
    if (reload) setIsLoading(true);
    await API.call({
      method: "getStudentsWithoutSuchCourse",
      course,
    }).then((result) => {
      if (result.success) {
        console.log(result.data);
        setData(result.data);
        // setProgress(false);
      } else {
        setError(result.message);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (open) {
      loadData(true);
    }
  }, [open]);

  return (
    <>
      <Tooltip title="Записать студента" placement="top" arrow>
        <Fab color="primary" onClick={() => setOpen(true)}>
          <Add />
        </Fab>
      </Tooltip>
      {open && (
        <Dialog open={open} fullWidth={true} maxWidth={"md"}>
          <DialogTitle disableTypography className={classes.modalTitle}>
            <Typography variant="h6">
              {"Записать студентов на курс"}
            </Typography>
            {!isLoading && (
              <IconButton
                className={classes.closeButton}
                onClick={() => {
                  setOpen(false);
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
          ) : (
            <MuiTable
              columns={["ФИО", "Email", "Блокировка", "Последняя активность", "Действия"]}
              noMatch={error ? error : "Других студентов нет"}
              viewColumns={false}
              data={!data ? [] : (() => {
                let tableData = [];
                data.forEach(el => {
                  var last_login =
                    -(new Date(el.last_login) - new Date()) / 1000 - 60 * 60 * 3;
                  tableData.push([
                    el.s_name + " " + el.f_name + (el.fth_name ? " " + el.fth_name : ""),
                    <HiddenValue label="Email" text={el.email} />,
                    el.banned ? (
                      <span style={{ color: "red" }}>
                        <FiberManualRecordIcon style={{ height: 12 }} />
                        Заблокирован
                      </span>
                    ) : (
                      <span style={{ color: "green" }}>
                        <FiberManualRecordIcon style={{ height: 12 }} />
                        Нет
                      </span>
                    ),
                    !el.last_login ? (
                      "Никогда"
                    ) : last_login < 60 ? (
                      <span style={{ color: "green" }}>
                        <FiberManualRecordIcon style={{ height: 12 }} />
                        Онлайн
                      </span>
                    ) : (
                      <>
                        <SecondsToRusTime time={last_login} />
                        {" назад"}
                      </>
                    ),
                    <IconButton
                      disabled={userProgressId}  
                      variant="outlined"
                      color="secondary"
                      className={classes.B5}
                      >
                      {userProgressId === el.id_user ? (
                        <CircularProgress color="primary" size={20} />
                      ) : (
                        <Tooltip title="Включить в курс" placement="top" arrow>
                          <Add
                            onClick={() => {
                              addToCourse(el.id_user);
                            }}
                          />
                        </Tooltip>)}
                    </IconButton>
                  ]);
                });
                return tableData;
              })()}
            />
          )}
        </Dialog>
      )}
    </>
  );
};

export default AddStudentModal;
