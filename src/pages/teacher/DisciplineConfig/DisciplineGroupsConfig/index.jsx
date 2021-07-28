import {
  Avatar,
  CircularProgress,
  IconButton,
  Paper,
  Tooltip,
} from "@material-ui/core";
import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Switch from "@material-ui/core/Switch";
import LoadingPage from "../../../../components/Loading";
import API from "../../../../services/API";
import MuiTable from "../../../../components/MuiTable";
import useStyles from "./styles";
import { Delete } from "@material-ui/icons";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddGroupModal from "./AddGroupModal";
import ForwardIcon from "@material-ui/icons/Forward";

const DisciplineGroupsConfig = (props) => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const id_discipline = props.match.params.id_discipline;
  const [loading, setLoading] = useState(false);
  const [removeGroupProgress, setRemoveGroupProgress] = useState(false);
  const [removeGroupId, setRemoveGroupId] = useState(false);

  const appendGroup = (newValues) => {
    let newData = newValues;

    Object.entries(data.students).map((e) => {
      newData.push(e[1]);
    });
    setData({ ...data, students: newData });
  };

  const appendTeacher = (newValues) => {
    let newData = newValues;
    Object.entries(data.teachers_data).map((e) => {
      newData.push(e[1]);
    });
    setData({ ...data, teachers_data: newData });
  };

  const removeGroup = async (group) => {
    setRemoveGroupProgress(true);
    setRemoveGroupId(group);
    await API.call({
      method: "remove_group_from_discipline",
      group,
      discipline: id_discipline,
    }).then((result) => {
      if (result.success) {
        (async () => {
          await loadData(false);
        })();
      } else {
      }
    });
  };

  const loadData = async (reload = true) => {
    if (reload) setLoading(true);
    await API.call({
      method: "discipline_data",
      discipline: id_discipline,
    }).then((result) => {
      setLoading(false);
      if (result.success) {
        console.log(result.data);
        setData(result.data);
      } else {
        // setError(result.message);
      }
      setRemoveGroupId(false);
      setRemoveGroupProgress(false);
    });
  };

  useEffect(() => {
    loadData(true);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <Grid
            container
            spacing={3}
            style={{ paddingTop: 10, paddingBottom: 100 }}
          >
            <Grid item xs={12}>
              <MuiTable
                title={
                  <div disableTypography className={classes.modalTitle}>
                    <Typography variant="h6">
                      {"Список групп, изучающих дисциплину"}
                    </Typography>
                  </div>
                }
                viewColumns={false}
                search={false}
                columns={[
                  "Группа",
                  "Год поступления",
                  "Студентов",
                  "Дисциплина изучается на",
                  "Действия",
                ]}
                data={
                  !data
                    ? []
                    : (() => {
                        let newData = [];
                        if (data.students !== null)
                          for (
                            let index = 0;
                            index < data.students.length;
                            index++
                          ) {
                            const el = data.students[index].group;
                            const stud = data.students[index];
                            let course =
                              data.students[index].edu_year - el.admission_year;
                            newData.push([
                              el.id_group,
                              el.admission_year,
                              el.students_count,
                              <div style={{ display: "flex" }}>
                                <Typography color="textPrimary">
                                  {"На " + course + " курсе"}
                                </Typography>
                                <Typography
                                  color="textSecondary"
                                  style={{ marginLeft: 5 }}
                                >
                                  {"(" +
                                    stud.edu_year +
                                    "-" +
                                    (stud.edu_year + 1) +
                                    " уч.год, " +
                                    stud.semester +
                                    " семестр)"}
                                </Typography>
                              </div>,

                              <div style={{ display: "flex" }}>
                                <Tooltip
                                  title="Перейти к результатам группы"
                                  placement="top"
                                  arrow
                                >
                                  <IconButton
                                    variant="outlined"
                                    // color="primary"
                                    className={classes.B4}
                                    disabled={removeGroupProgress}
                                    onClick={() => {
                                      props.history.push(
                                        "/teacher/discipline/" +
                                          id_discipline +
                                          "/group/" +
                                          el.id_group,
                                      );
                                    }}
                                  >
                                    <ForwardIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip
                                  title="Исключить из дисциплины"
                                  placement="top"
                                  arrow
                                >
                                  <IconButton
                                    variant="outlined"
                                    className={classes.B2}
                                    style={{ marginLeft: 10 }}
                                    disabled={el.self || removeGroupProgress}
                                    onClick={() => {
                                      removeGroup(el.id_group);
                                    }}
                                  >
                                    {removeGroupProgress &&
                                    removeGroupId === el.id_group ? (
                                      <CircularProgress
                                        color="primary"
                                        size={20}
                                      />
                                    ) : (
                                      <RemoveCircleIcon />
                                    )}
                                  </IconButton>
                                </Tooltip>
                              </div>,
                            ]);
                          }
                        return newData;
                      })()
                }
              />
            </Grid>
          </Grid>
          <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
            {data && (
              <AddGroupModal
                discipline={data.id_discipline}
                appendDataCallback={appendGroup}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default DisciplineGroupsConfig;
