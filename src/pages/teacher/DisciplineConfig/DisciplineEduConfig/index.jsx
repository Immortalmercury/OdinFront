import React, { useState } from "react";
import { IconButton, Tooltip, CircularProgress, Fab } from "@material-ui/core";
import { Add, ArrowDownward, AssignmentTurnedIn, Ballot, Delete, Edit, Forward, MenuBook, SettingsOutlined, SubdirectoryArrowRight } from "@material-ui/icons";
import useStyles from "./styles";
import EditModal from './EditModal';
import API from "../../../../services/API";
import MuiTable from "../../../../components/MuiTable";
import Section from "../../../../components/Section";
import SecondsToRusTime from "../../../../components/SecondsToRusTime";
import SecureOptionSwitcher from '../../../../components/SecureOptionSwitcher';
import DateToRusTime from "../../../../components/DateToRusTime";
import EditTest from "../DisciplineTestsConfig/EditModal";
import EditLecture from "../DisciplineLecturesConfig/EditModal";
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { Helmet } from "react-helmet";

const DisciplineLecturesConfig = (props) => {
  const classes = useStyles();
  const id_discipline = props.match.params.id_discipline;
  const route = "/discipline/" + id_discipline + '/edu';

  // Section
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(null);
  
  // Delete operation
  const [progressId, setProgressId] = useState(false);
  const [deleteAllowed, setDeleteAllowed] = useState(false);
  const [confirmationPassword, setConfirmationPassword] = useState("");
  
  // Editor varibles
  const [editorOpen, setEditorOpen] = useState(false);
  const [instanceId, setInstanceId] = useState(false);
  const [testEditorOpen, setTestEditorOpen] = useState(false);
  const [lectureEditorOpen, setLectureEditorOpen] = useState(false);

  function edit(id) {
    setProgressId(id);
    setEditorOpen(true);
  }

  function editInstance(id, type) {
    console.log({id,type});
    setProgressId(-1);
    setInstanceId(id);
    if (type === 'test') {
      setTestEditorOpen(true);
    } else {
      setLectureEditorOpen(true);
    }
  }

  function create() {
    setProgressId(null);
    setEditorOpen(true);
  }

  const remove = async (id) => {
    setProgressId(id);
    await API.callV2("DELETE", route + '/' + id, {
      confirmationPassword
    }).then(result => {
      setUpdate('silent');
    });
  };

  return (
    <>
      <Helmet title="Учебная программа" />
      <Section update={update} setUpdate={setUpdate} noDataAllowed
        setData={(data) => {
          setData(data);
          setProgressId(null);
        }}
        request={{route}}
      >
        <div style={{ paddingBottom: 10 }}>
          <SecureOptionSwitcher
            label={"Удаление элементов и сущностей"}
            passwordValue={confirmationPassword}
            setPasswordValue={setConfirmationPassword}
            allowed={deleteAllowed}
            setAllowed={setDeleteAllowed}
          />
        </div>
        <MuiTable
          title="Элементы включенные в программу обучения"
          columns={[
            "№",
            "Тип",
            "Название",
            "Порядок",
            "Время",
            "Обязательно",
            // "Изменен",
            "Действия",
          ]}
          noMatch={"Нет элементов программы обучения"}
          data={
            !data 
              ? []
              : (() => {
                  let newData = [];
                if (data !== null)
                  for (let index = 0; index < data.length; index++) {
                    const el = data[index];
                    const id = el.id_element;

                    newData.push([
                      index + 1,
                      (el.instance === 'test'
                        ? (el.item?.parameters?.test_type === "selfСontrol" ?
                        <AssignmentTurnedIn/> : <Ballot />)
                        : <MenuBook />),
                      el.item.name,
                      el.order,
                      <SecondsToRusTime time={el.item.time} />,
                      el.required ? (
                        <span style={{ color: "red", display:"flex", alignItems:'center',marginLeft:7 }}>
                          <SubdirectoryArrowRight  />
                          Да
                        </span>
                      ) : (
                        <span style={{ color: "green", display:"flex", alignItems:'center' }}>
                          <ArrowDownward  />
                          Нет
                        </span>
                      ),
                      // <DateToRusTime time={el.updated_at || el.created_at}/>,
                      <div style={{ display: "flex" }}>
                        
                        <IconButton
                          color={"primary"}
                          onClick={() => {
                            edit(id);
                          }}
                          disabled={progressId}
                        >
                          <Tooltip title="Редактировать элемент" placement="top" arrow><Edit /></Tooltip>
                        </IconButton>
                        <IconButton
                          color={"primary"}
                          onClick={() => {
                            editInstance(el.instance_element_id,el.instance);
                          }}
                          disabled={progressId}
                        >
                          <Tooltip title="Редактировать сущность" placement="top" arrow><SettingsOutlined /></Tooltip>
                        </IconButton>
                        {el.instance === "test" && ( 
                          <IconButton
                              color={"primary"}
                              className={classes.B4}
                              onClick={() => {
                                props.history.push('./test/' + id);
                              }}
                              disabled={progressId}
                            >
                              <Tooltip title="Перейти в раздел теста" placement="top" arrow><Forward /></Tooltip>
                          </IconButton>
                        )}
                        {deleteAllowed && (<>
                          <IconButton
                            variant="outlined"
                            color="secondary"
                            className={classes.B2}
                            disabled={progressId}
                            onClick={() => {
                              remove(id);
                            }}
                          >
                            {progressId === id ? (
                              <CircularProgress color="primary" size={20} />
                            ) : (
                              <Tooltip title="Удалить элемент и прогресс студентов" placement="top" arrow><RemoveCircleIcon /></Tooltip>
                            )}
                          </IconButton>
                          <IconButton
                            variant="outlined"
                            color="secondary"
                            className={classes.B2}
                            disabled
                            // disabled={progressId || true}
                            onClick={() => {
                              remove(id);
                            }}
                          >
                            {progressId === id ? (
                              <CircularProgress color="primary" size={20} />
                            ) : (
                              <Tooltip title="Удалить элемент и сущность навсегда" placement="top" arrow><Delete /></Tooltip>
                            )}
                          </IconButton>
                        </>)}
                      </div>,
                    ]);
                  }
                return newData;
              })()
          }
        />
        <EditModal
          onClose={() => setProgressId(null)}
          onSave={() => setUpdate('silent')}
          id={progressId}
          route={route}
          open={editorOpen}
          setOpen={setEditorOpen}
          id_discipline={id_discipline}
        />
        {testEditorOpen && (
          <EditTest 
            route={"/discipline/" + id_discipline + '/test'}
            onClose={() => {setInstanceId(null);setProgressId(null);}}
            onSave={() => setUpdate('silent')}
            id={instanceId}
            open={testEditorOpen}
            setOpen={setTestEditorOpen}
          />
        )}
        {lectureEditorOpen && (
          <EditLecture 
            route={"/discipline/" + id_discipline + '/lecture'}
            onClose={() => {setInstanceId(null);setProgressId(null);}}
            onSave={() => setUpdate('silent')}
            id={instanceId}
            open={lectureEditorOpen}
            setOpen={setLectureEditorOpen}
          />
        )}
        {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
        <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
          <Tooltip title="Добавить элемент" placement="top" arrow>
            <Fab color="primary" onClick={() => { create() }}>
              <Add />
            </Fab>
          </Tooltip>
        </div>
      </Section>
    </>
  );
};

export default DisciplineLecturesConfig;
