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
import CreateDisciplineModal from './CreateDisciplineModal';

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
        
      ]);
    }
  return newData;
};

const AddDisciplineModal = ({ appendDataCallback, course }) => {
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  // const [progress, setProgress] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(false);
  const classes = useStyles();
  const [disciplineProgressId, setDisciplineProgressId] = useState(false);

  const addToCourse = async (discipline) => {
    setDisciplineProgressId(discipline);
    // setProgress(true);
    setError(false);
    await API.call({
      method: "addDisciplineToCourse",
      course,
      discipline,
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
    setDisciplineProgressId(false);
  };

  const loadData = async (reload = true) => {
    if (reload) setIsLoading(true);
    await API.call({
      method: "getDisciplines",
      excludeFilter: {
        course
      }
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
      <Tooltip title="Добавить дисциплины" placement="top" arrow>
        <Fab color="primary" onClick={() => setOpen(true)}>
          <Add />
        </Fab>
      </Tooltip>
      {open && (
        <Dialog open={open} fullWidth={true} maxWidth={"md"}>
          <DialogTitle disableTypography className={classes.modalTitle}>
            <Typography variant="h6">
              {"Включить в список дисциплин"}
            </Typography>
            <div className={classes.modalTitle}>
              <CreateDisciplineModal course={course} callback={appendDataCallback}/>
            </div>
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
              columns={["Дисциплина", "Добавить"]}
              noMatch={error ? error : "Других дисциплин нет"}
              viewColumns={false}
              data={!data ? [] : (() => {
                let tableData = [];
                data.forEach(el => {
                  tableData.push([
                    el.description,
                    <IconButton
                      disabled={disciplineProgressId}  
                      variant="outlined"
                      color="secondary"
                      className={classes.B5}
                      >
                      {disciplineProgressId === el.id_discipline ? (
                        <CircularProgress color="primary" size={20} />
                      ) : (
                        <Tooltip title="Включить в группу" placement="top" arrow>
                          <Add
                            onClick={() => {
                              addToCourse(el.id_discipline);
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

export default AddDisciplineModal;
