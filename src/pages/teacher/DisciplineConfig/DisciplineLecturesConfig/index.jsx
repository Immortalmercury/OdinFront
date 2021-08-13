import React, { useState } from "react";
import { IconButton, Tooltip, CircularProgress, Fab } from "@material-ui/core";
import { Add, Delete, Edit } from "@material-ui/icons";
import useStyles from "./styles";
import EditModal from './EditModal';
import API from "../../../../services/API";
import MuiTable from "../../../../components/MuiTable";
import Section from "../../../../components/Section";
import SecondsToRusTime from "../../../../components/SecondsToRusTime";
import SecureOptionSwitcher from '../../../../components/SecureOptionSwitcher';
import DateToRusTime from "../../../../components/DateToRusTime";
import { Helmet } from "react-helmet";
import RequestV2Button from "../../../../components/Buttons/RequestV2Button";

const DisciplineLecturesConfig = (props) => {
  const classes = useStyles();
  const id_discipline = props.match.params.id_discipline;
  const route = "/discipline/" + id_discipline + '/lecture';

  // Section
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(null);
  
  // Delete operation
  const [progressId, setProgressId] = useState(false);
  const [deleteAllowed, setDeleteAllowed] = useState(false);
  const [confirmationPassword, setConfirmationPassword] = useState("");
  
  // Editor varibles
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

  return (
    <>
      <Helmet title="Лекции" />
      <Section update={update} setUpdate={setUpdate} noDataAllowed
        setData={(data) => {
          setData(data);
          setProgressId(null);
        }}
        request={{route}}
      >
        <div style={{ paddingBottom: 10 }}>
          <SecureOptionSwitcher
            label={"Удаление лекций"}
            passwordValue={confirmationPassword}
            setPasswordValue={setConfirmationPassword}
            allowed={deleteAllowed}
            setAllowed={setDeleteAllowed}
          />
        </div>
        <MuiTable
          title="Список лекций"
          columns={[
            "№ (ID)",
            "Название",
            "Минимальное время",
            "Изменен",
            "Действия",
          ]}
          noMatch={"Нет лекций"}
          data={
            !data 
              ? []
              : (() => {
                  let newData = [];
                  if (data !== null)
                    for (let index = 0; index < data.length; index++) {
                      const el = data[index];
                      const id = el.id_lecture;

                      newData.push([
                        index + 1 + " (ID " + id + ")",
                        el.name,
                        <SecondsToRusTime time={el.time} />,
                        <DateToRusTime time={el.updated_at || el.created_at}/>,
                        <div style={{ display: "flex" }}>
                          <RequestV2Button
                            buttonType="IconButton"
                            variant="contained"
                            margin="normal"
                            color="primary"
                            // className={classes.B5}
                            icon={<Add/>}
                            request={{
                              method: 'POST',
                              route: '/discipline/'+id_discipline+'/edu',
                              data: {instance:'lecture',instance_element_id: id}
                            }}
                            label={"Добавить в учебную программу"}
                          />
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
          <Tooltip title="Создать лекцию" placement="top" arrow>
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
