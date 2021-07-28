/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import {
  IconButton,
  Button,
  Dialog,
  DialogContent,
  Tooltip,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import API from "../../../services/API";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";
import MuiTable from "../../../components/MuiTable";
import SecondsToRusTime from "../../../components/SecondsToRusTime";
import HiddenValue from "../../../components/HiddenValue";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

const convertData = (data, classes, addToGroup, progress) => {
  let newData = [];
  if (data !== null)
    for (let index = 0; index < data.length; index++) {
      const el = data[index];
      var last_login =
        -(new Date(el.last_login) - new Date()) / 1000 - 60 * 60 * 3;
      newData.push([
        el.s_name + " " + el.f_name + (el.fth_name ? " " + el.fth_name : ""),
        <HiddenValue label="Email" text={el.email} />,
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
        progress ? (
          <CircularProgress color="primary" size={20} />
        ) : (
          <IconButton
            variant="outlined"
            color="secondary"
            className={classes.B5}
          >
            <Tooltip title="Включить в группу" placement="top" arrow>
              <Add
                onClick={() => {
                  addToGroup(el.id_user);
                }}
              />
            </Tooltip>
          </IconButton>
        ),
      ]);
    }
  return newData;
};

const AddStudentModal = ({ appendDataCallback, group }) => {
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(false);
  const classes = useStyles();

  const addToGroup = async (student) => {
    setProgress(true);
    setError(false);
    await API.call({
      method: "add_student_to_group",
      student,
      group,
    }).then((result) => {
      if (result.success) {
        appendDataCallback([result.data]);
        loadData(false);
      } else {
        setProgress(false);
        setError(result.message);
      }
    });
  };

  const loadData = async (reload = true) => {
    if (reload) setIsLoading(true);
    await API.call({
      method: "get_students_without_group",
    }).then((result) => {
      setIsLoading(false);
      if (result.success) {
        console.log(result.data);
        setData(result.data);
        setProgress(false);
      } else {
        setError(result.message);
      }
    });
  };

  useEffect(() => {
    if (open) {
      loadData(true);
    }
  }, [open]);

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setOpen(true)}
        style={{ marginRight: 10 }}
      >
        Добавить студента
      </Button>
      {open && (
        <Dialog open={open} fullWidth={true} maxWidth={"md"}>
          <DialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">
              {" Добавить студента в группу " + group}
            </Typography>
            {!isLoading && !progress && (
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
              data={
                data ? convertData(data, classes, addToGroup, progress) : []
              }
              columns={["Студент", "Email", "Последняя активность", "Добавить"]}
              noMatch={error ? error : "Студентов вне групп нет"}
              viewColumns={false}
            />
          )}
        </Dialog>
      )}
    </>
  );
};

export default AddStudentModal;
