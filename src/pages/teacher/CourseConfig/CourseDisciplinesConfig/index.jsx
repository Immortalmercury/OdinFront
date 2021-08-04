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
import AddDisciplineModal from "./AddDisciplineModal";
import Section from '../../../../components/Section/index';
import SettingsIcon from "@material-ui/icons/Settings";

const CourseDisciplinesConfig = (props) => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(null);
  
  const id_course = props.match.params.id_course;
  const [removeDisciplineId, setRemoveDisciplineId] = useState(false);

  const removeDiscipline = async (discipline) => {
    setRemoveDisciplineId(discipline);
    await API.call({
      method: "removeDisciplineFromCourse",
      discipline,
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
        method: 'courseData',
        course: id_course,
      }}
      setData={(data) => {
        setData(data);
        setRemoveDisciplineId(false);
      }}
      update={update}
      setUpdate={setUpdate}
      debug
    >
      <MuiTable
        className={classes.tableToolbarRoot}
        title={
          <div disableTypography className={classes.modalTitle}>
            <Typography variant="h6">
              {"Список дисциплин курса"}
            </Typography>
          </div>
        }
        viewColumns={false}
        search={false}
        columns={["Название","Порядок","Завершить перед следующей", "Действия"]}
        data={
          !data
            ? []
            : (() => {
              let newData = [];
              data.disciplines.forEach(el => {
                newData.push([
                  el.discipline_description,
                  el.order,
                  el.required ? "Да":"Нет",
                  <div style={{ display: "flex" }}>
                    <IconButton
                      variant="outlined"
                      color="primary"
                      style={{ marginLeft: 10 }}
                      onClick={() => {
                        props.history.push("/teacher/discipline/" + el.id_discipline);
                      }}
                    >
                      <Tooltip title="Конфигурировать" placement="top" arrow>
                        <SettingsIcon />
                      </Tooltip>
                    </IconButton>
                    <IconButton
                      variant="outlined"
                      className={classes.B2}
                      style={{ marginLeft: 10 }}
                      disabled={el.self || removeDisciplineId}
                      onClick={() => {
                        removeDiscipline(el.id_discipline);
                      }}
                    >
                      {removeDisciplineId === el.id_discipline ? (
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
                  </div>,
                ]);
              });

              return newData;
            })()
        }
      />
      <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
        {data && (
          <AddDisciplineModal
            course={id_course}
            appendDataCallback={() => {
              setUpdate('silent'); 
            }}
          />
        )}
      </div>
    </Section>
  );
};

export default CourseDisciplinesConfig;
