import React, { useState } from "react";
import { IconButton, Tooltip, CircularProgress, Fab } from "@material-ui/core";
import { Add, CheckBox, Delete, Edit, RadioButtonChecked } from "@material-ui/icons";
import useStyles from "./styles"; 
import EditModal from './EditModal';
import API from "../../../services/API";
import MuiTable from "../../../components/MuiTable";
import Section from "../../../components/Section";
import SecondsToRusTime from "../../../components/SecondsToRusTime";
import SecureOptionSwitcher from '../../../components/SecureOptionSwitcher';
import Header from "../../../components/Header/Header";
import HiddenValue from './../../../components/HiddenValue/index';

const ShowAnswers = (answers) => {
  
  return (<>
    <ul>
      {answers?.answers && Object.entries(answers.answers).map(item => {
        console.log(item);
        let el = item[1];
        return (
          <li>
            <div
              dangerouslySetInnerHTML={{ __html: el.text }}
              style={el.correct ? {borderLeft:'2px solid #0C0',paddingLeft:10}:{borderLeft: '2px dashed #C00',paddingLeft:10}}
            />
          </li>);
      })}
    </ul>
  </>);
}

const TestQuestionsBank = (props) => {
  const classes = useStyles();
  const id_test = props.match.params.id_test;
  const id_discipline = props.match.params.id_discipline;
  const route = "/test/" + id_test + '/question';

  // Section
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(null);
  
  // Delete operation
  const [progressId, setProgressId] = useState(false);
  const [deleteAllowed, setDeleteAllowed] = useState(false);
  const [confirmationPassword, setConfirmationPassword] = useState("");
  
  // Editor variables
  const [editorOpen, setEditorOpen] = useState(false);

  function edit(id) {
    setProgressId(id);
    setEditorOpen(true);
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

  const [testData, setTestData] = useState(false);

  return (
    <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
      minHeight: '100%',
      width: '100%',
      zIndex: 1100,
      padding: 10,
      paddingTop: 74,
      backgroundColor: '#F6F7FF',
    }}>
      <Section noDataAllowed
        setData={setTestData}
        request={{route:"/discipline/" + id_discipline + '/test/'+ id_test}}
      >
        <Header
          history={props.history}
          title={"Банк вопросов" + (testData ? ' - Тест "' + testData.name + '"' : null)}
          style={{left:0,width:'100vw'}}
        />
      </Section>
      <Section update={update} setUpdate={setUpdate} noDataAllowed
        setData={(data) => {
          setData(data);
          setProgressId(null);
        }}
        request={{route}}
      >
        
        <div style={{ paddingBottom: 10 }}>
          <SecureOptionSwitcher
            label={"Удаление вопросов"}
            passwordValue={confirmationPassword}
            setPasswordValue={setConfirmationPassword}
            allowed={deleteAllowed}
            setAllowed={setDeleteAllowed}
          />
        </div>
        <MuiTable
          title="Список вопросов"
          columns={[
            "ID",
            "Вопрос",
            "Тип ответа",
            "Ответы",
            "Обязателен",
            "Время",
            "Стоимость",
            "Действия",
          ]}
          noMatch={"Нет вопросов"}
          data={
            !data 
              ? []
              : (() => {
                  let newData = [];
                  if (data !== null)
                    for (let index = 0; index < data.length; index++) {
                      const el = data[index];
                      const id = el.id_question;

                      newData.push([
                        id,
                        <div dangerouslySetInnerHTML={{__html:el.text}}/>,
                        el.id_type === 1 ? <RadioButtonChecked /> : <CheckBox />,
                        <HiddenValue label="варианты ответа" text={<ShowAnswers answers={ el.answers }/>} />,
                        el.required ? "Да" : "Нет",
                        el.time === null ? "-" : <SecondsToRusTime time={el.time} />,
                        el.weight,
                        // <DateToRusTime time={el.updated_at || el.created_at}/>,
                        <div style={{ display: "flex" }}>
                          <IconButton
                            color={"primary"}
                            onClick={() => {
                              edit(id);
                            }}
                            disabled={progressId}
                          >
                            <Tooltip title="Редактировать" placement="top" arrow><Edit /></Tooltip>
                          </IconButton>
                          {deleteAllowed && (
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
                                <Tooltip title="Удалить" placement="top" arrow><Delete /></Tooltip>
                              )}
                            </IconButton>
                          )}
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
        />
        {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
        <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
          <Tooltip title="Создать вопрос" placement="top" arrow>
            <Fab color="primary" onClick={() => { create() }}>
              <Add />
            </Fab>
          </Tooltip>
        </div>
      </Section>
    </div>
  );
};

export default TestQuestionsBank;
