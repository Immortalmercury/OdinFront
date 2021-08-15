import {
  CircularProgress,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import API from "../../../../services/API";
import MuiTable from "../../../../components/MuiTable";
import useStyles from "./styles";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import Section from '../../../../components/Section/index';
// import SettingsIcon from "@material-ui/icons/Settings";
import HiddenValue from './../../../../components/HiddenValue/index';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import SecondsToRusTime from './../../../../components/SecondsToRusTime/index';
import AddStudentModal from './AddStudentModal';

const CourseStudentsConfig = (props) => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(null);
  
  const id_course = props.match.params.id_course;
  const [userProgressId, setUserProgressId] = useState(false);

  const removeFromCourse = async (user) => {
    setUserProgressId(user);
    await API.call({
      method: "removeStudentFromCourse",
      user,
      course: id_course,
    }).then((result) => {
      if (result.success) {
        (async () => {
          setUpdate('silent');
        })();
      } else {
      }
    });
  };


  return (
    <Section
      requestData={{
        method: 'courseStudents',
        course: id_course,
      }}
      setData={(data) => {
        setData(data);
        setUserProgressId(false);
      }}
      update={update}
      setUpdate={setUpdate}
      debug
      noDataAllowed
    >
      <MuiTable
        className={classes.tableToolbarRoot}
        title={
          <div disableTypography className={classes.modalTitle}>
            <Typography variant="h6">
              {"Список студентов курса"}
            </Typography>
          </div>
        }
        viewColumns={false}
        search={false}
        columns={["ФИО", "Email", "Блокировка", "Последняя активность", "Действия"]}
        noMatch={"На курс никто не записан"}
        data={
          !data
            ? []
            : (() => {
              let newData = [];
              data.forEach(el => {
                var last_login =
                  -(new Date(el.last_login) - new Date()) / 1000 - 60 * 60 * 3;
                newData.push([
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
                    className={classes.B2}
                  color="secondary"
                  onClick={() => {
                    removeFromCourse(el.id_user);
                  }}
                >
                  {userProgressId === el.id_user ? (
                    <CircularProgress
                      color="primary"
                      size={20}
                    />
                  ) : (
                    <Tooltip
                      title="Исключить из курса"
                      placement="top"
                      arrow
                    >
                      <RemoveCircleIcon />
                    </Tooltip>
                  )}
                </IconButton>
                ]);
              });

              return newData;
            })()
        }
      />
      <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
        <AddStudentModal
          course={id_course}
          appendDataCallback={() => {
            setUpdate('silent'); 
          }}
        />
      </div>
    </Section>
  );
};

export default CourseStudentsConfig;
