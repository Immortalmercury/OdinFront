import {
  Avatar,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Tooltip,
} from "@material-ui/core";
import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// import FormHelperText from "@material-ui/core/FormHelperText";
import Switch from "@material-ui/core/Switch";
import LoadingPage from "../../../../components/Loading";
import API from "../../../../services/API";
import MuiTable from "../../../../components/MuiTable";
import useStyles from "./styles";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddTeacherModal from "./AddTeacherModal";
import { Helmet } from "react-helmet";

const switcherParams = {
  style: {
    margin: "10px 0px 0px",
    width: "100%",
    justifyContent: "space-between",
  },
  labelPlacement: "start",
};

const DisciplineMainConfigs = (props) => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const id_discipline = props.match.params.id_discipline;
  const [loading, setLoading] = useState(false);
  const [removeTeacherProgress, setRemoveTeacherProgress] = useState(false);
  const [removeTeacherId, setRemoveTeacherId] = useState(false);
  const [switchers, setSwitchers] = useState({
    course: true,
    exam: true,
    credit: true,
    difCredit: true,
  });
  const [switchersEdit, setSwitchersEdit] = useState(false);
  const [switchersProgress, setSwitchersProgress] = useState(false);

  const updateSwitchers = async () => {
    setSwitchersEdit(false);
    setSwitchersProgress(true);
    await API.call({
      method: "set_discipline_exam_forms",
      switchers,
      discipline: id_discipline,
    }).then((result) => {
      if (result.success) {
        let newData = [];
        if (result.data !== undefined) {
          newData = result.data;
        }
        setData({ ...data, exam_forms: newData });
        if (props.updateExamForms !== undefined)
          props.updateExamForms(newData);
      } else {
        setSwitchers({
          course: data.exam_forms.indexOf("Курсовая работа") !== -1,
          exam: data.exam_forms.indexOf("Экзамен") !== -1,
          credit: data.exam_forms.indexOf("Зачет") !== -1,
          difCredit: data.exam_forms.indexOf("Диф. зачет") !== -1,
        });
      }
      setSwitchersProgress(false);
    });
  }

  const appendTeacher = (newValues) => {
    let newData = newValues;
    // eslint-disable-next-line array-callback-return
    Object.entries(data.teachers_data).map((e) => {
      newData.push(e[1]);
    });
    setData({ ...data, teachers_data: newData });
  };

  const removeTeacher = async (teacher) => {
    setRemoveTeacherProgress(true);
    setRemoveTeacherId(teacher);
    await API.call({
      method: "remove_teacher_from_discipline",
      teacher,
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
        setSwitchers({
          course: result.data.exam_forms.indexOf("Курсовая работа") !== -1,
          exam: result.data.exam_forms.indexOf("Экзамен") !== -1,
          credit: result.data.exam_forms.indexOf("Зачет") !== -1,
          difCredit: result.data.exam_forms.indexOf("Диф. зачет") !== -1,
        });
      } else {
        // setError(result.message);
      }
      setRemoveTeacherId(false);
      setRemoveTeacherProgress(false);
    });
  };

  useEffect(() => {
    loadData(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet title="Преподаватели" />
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <Grid
            container
            spacing={3}
            style={{ paddingTop: 10, paddingBottom: 100 }}
          >
            <Grid item>
              <Paper elevation={3} style={{ padding: 20, width: 250 }}>
                <Typography variant="h5" style={{ paddingBottom: 10 }}>
                  Формы экзамена
                </Typography>
                <FormControl
                  component="fieldset"
                  style={{
                    width: "100%",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          color="primary"
                          checked={switchers.course}
                          disabled={!switchersEdit}
                          onChange={() => {
                            setSwitchers({
                              ...switchers,
                              course: !switchers.course,
                            });
                          }}
                        />
                      }
                      label="Курсовая работа"
                      {...switcherParams}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          color="primary"
                          checked={switchers.exam}
                          disabled={!switchersEdit}
                          onChange={() => {
                            setSwitchers({
                              ...switchers,
                              exam: !switchers.exam,
                            });
                          }}
                        />
                      }
                      label="Экзамен"
                      {...switcherParams}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          color="primary"
                          checked={switchers.credit}
                          disabled={!switchersEdit}
                          onChange={() => {
                            setSwitchers({
                              ...switchers,
                              credit: !switchers.credit,
                            });
                          }}
                        />
                      }
                      label="Зачет"
                      {...switcherParams}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          color="primary"
                          checked={switchers.difCredit}
                          disabled={!switchersEdit}
                          onChange={() => {
                            setSwitchers({
                              ...switchers,
                              difCredit: !switchers.difCredit,
                            });
                          }}
                        />
                      }
                      label="Диф. зачет"
                      {...switcherParams}
                    />
                  </FormGroup>
                  {!switchersEdit&&!switchersProgress ? (
                    <Button
                      fullWidth
                      size="small"
                      color="primary"
                      variant="outlined"
                      style={{ marginTop: 10 }}
                      onClick={() => {
                        setSwitchersEdit(true);
                      }}
                    >
                      Редактировать
                    </Button>
                  ) : (
                    <>
                      <Button
                        fullWidth
                        size="small"
                        color="primary"
                        variant="contained"
                        style={{ marginTop: 10 }}
                        onClick={() => {
                          updateSwitchers();
                        }}
                        disabled={switchersProgress}
                      >
                        {switchersProgress ? (
                          <CircularProgress color="primary" size={20} />
                        ) : (
                          "Сохранить"
                        )}
                      </Button>
                      <Button
                        fullWidth
                        size="small"
                        color="primary"
                        style={{ marginTop: 5 }}
                        onClick={() => {
                          setSwitchersEdit(false);
                          setSwitchers({
                            course: data.exam_forms.indexOf("Курсовая работа") !== -1,
                            exam: data.exam_forms.indexOf("Экзамен") !== -1,
                            credit: data.exam_forms.indexOf("Зачет") !== -1,
                            difCredit: data.exam_forms.indexOf("Диф. зачет") !== -1,
                          });
                        }}
                        disabled={switchersProgress}
                      >
                        Отмена
                      </Button>
                    </>
                  )}
                </FormControl>
              </Paper>
            </Grid>
            <Grid
              item
              style={{
                width: "calc(100% - 275px)",
              }}
            >
              <MuiTable
                className={classes.tableToolbarRoot}
                title={
                  <div disableTypography className={classes.modalTitle}>
                    <Typography variant="h6">
                      {"Список преподавателей"}
                    </Typography>
                  </div>
                }
                viewColumns={false}
                search={false}
                columns={["ФИО", "Исключить"]}
                data={
                  !data
                    ? []
                    : (() => {
                        let newData = [];
                        if (data.teachers_data !== null)
                          for (
                            let index = 0;
                            index < data.teachers_data.length;
                            index++
                          ) {
                            const el = data.teachers_data[index];
                            newData.push([
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  margin: 10,
                                }}
                              >
                                <Avatar
                                  sizes={50}
                                  src={el.photo}
                                  style={{ marginRight: 20 }}
                                />
                                {el.s_name +
                                  " " +
                                  (el.f_name + " ") +
                                  (el.fth_name !== null ? el.fth_name : " ")}
                              </div>,
                              <div style={{ display: "flex" }}>
                                <IconButton
                                  variant="outlined"
                                  className={classes.B2}
                                  style={{ marginLeft: 10 }}
                                  disabled={el.self || removeTeacherProgress}
                                  onClick={() => {
                                    removeTeacher(el.id_user);
                                  }}
                                >
                                  {removeTeacherProgress &&
                                  removeTeacherId === el.id_user ? (
                                    <CircularProgress
                                      color="primary"
                                      size={20}
                                    />
                                  ) : (
                                    <Tooltip
                                      title="Исключить из дисциплины"
                                      placement="top"
                                      arrow
                                    >
                                      <RemoveCircleIcon />
                                    </Tooltip>
                                  )}
                                </IconButton>
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
              <AddTeacherModal
                discipline={data.id_discipline}
                appendDataCallback={appendTeacher}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default DisciplineMainConfigs;
