/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import {
  IconButton,
  Button,
  Dialog,
  DialogContent,
  Tooltip,
  MenuItem,
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
import { TextField } from '@material-ui/core';

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
            className={classes.B2}
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

const AddGroupModal = ({ appendDataCallback, discipline }) => {
  const [open, setOpen] = useState(false);
  const [addGroupId, setAddGroupId] = useState(false);
  const [addGroupProgress, setAddGroupProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(false);
  const classes = useStyles();
  let now = new Date();
  const current_year = now.getMonth() < 8 ? now.getFullYear() - 1 : now.getFullYear();
  const [semester, setSemester] = useState(now.getMonth() < 8 ? 2 : 1);
  const [eduYear, setEduYear] = useState(current_year);
  

  const addGroup = async (group) => {
    setAddGroupProgress(true);
    setAddGroupId(group);
    setError(false);
    await API.call({
      method: "add_group_to_discipline",
      discipline,
      group,
      eduYear,
      semester
    }).then((result) => {
      if (result.success) {
        appendDataCallback([result.data]);
        (async () => {
          await loadData(false);
        })();
      } else {
        setError(result.message);
      }
    });
  };

  const loadData = async (reload = true) => {
    if (reload) setIsLoading(true);
    await API.call({
      method: "get_groups_without_such_discipline",
      discipline,
    }).then((result) => {
      setIsLoading(false);
      if (result.success) {
        console.log(result.data);
        setData(result.data);
      } else {
        setError(result.message);
      }
      setAddGroupId(false);
      setAddGroupProgress(false);
    });
  };

  useEffect(() => {
    if (open) {
      loadData(true);
    }
  }, [open]);

  return (
    <>
      <Tooltip title="Добавить группы" placement="top" arrow>
        <Fab color="primary" onClick={() => setOpen(true)}>
          <Add />
        </Fab>
      </Tooltip>
      {open && (
        <Dialog open={open} fullWidth={true} maxWidth={"md"}>
          <DialogTitle disableTypography className={classes.modalTitle}>
            <Typography variant="h6">
              {"Включить в список групп, изучающих дисциплину"}
            </Typography>
            <div className={classes.modalTitle} style={{marginRight: 50}}>
              <TextField
                select
                label="Учебный год"
                variant="outlined"
                size="small"
                value={eduYear}
                onChange={(e) => setEduYear(e.target.value)}
              >
                <MenuItem value={current_year - 4}>{ current_year - 4 }-{ current_year - 3}</MenuItem>
                <MenuItem value={current_year - 3}>{ current_year - 3 }-{ current_year - 2}</MenuItem>
                <MenuItem value={current_year - 2}>{ current_year - 2 }-{ current_year - 1}</MenuItem>
                <MenuItem value={current_year - 1}>{ current_year - 1 }-{ current_year - 0}</MenuItem>
                <MenuItem value={current_year}>{ current_year}-{ current_year + 1 }</MenuItem>

              </TextField>
              <TextField
                select
                size="small"
                label="Семестр"
                variant="outlined"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                style={{
                  marginLeft: 15,
                }}
              >
                <MenuItem value={1}>1 семестр</MenuItem>
                <MenuItem value={2}>2 семестр</MenuItem>
              </TextField>
            </div>
            {!isLoading && !addGroupProgress && (
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
                title={
                  <div disableTypography className={classes.modalTitle}>
                    
                  </div>
                }
                viewColumns={false}
                columns={[
                  "Группа",
                  "Год поступления",
                  "Студентов",
                  "Добавить",
                ]}
                data={
                  !data
                    ? []
                    : (() => {
                        let newData = [];
                        if (data !== null)
                          for (
                            let index = 0;
                            index < data.length;
                            index++
                          ) {
                            const el = data[index];
                            newData.push([
                              el.id_group,
                              el.admission_year,
                              el.students_count,
                              <div style={{ display: "flex" }}>
                                <IconButton
                                  variant="outlined"
                                  className={classes.B5}
                                  style={{ marginLeft: 10 }}
                                  disabled={addGroupProgress}
                                  onClick={() => {
                                    addGroup(el.id_group);
                                  }}
                                >
                                  <Tooltip
                                    title="Включить в дисциплину"
                                    placement="top"
                                    arrow
                                  >
                                    {addGroupProgress &&
                                    addGroupId === el.id_group ? (
                                      <CircularProgress
                                        color="primary"
                                        size={20}
                                      />
                                    ) : (
                                      <Add />
                                    )}
                                  </Tooltip>
                                </IconButton>
                                
                              </div>,
                            ]);
                          }
                        return newData;
                      })()
                }
              />
          )}
        </Dialog>
      )}
    </>
  );
};

export default AddGroupModal;
