/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { Grid, IconButton, Tooltip } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import API from "../../../../services/API";
import LoadingPage from "../../../../components/Loading";
import { Add, Archive, Delete, Description, GetApp } from "@material-ui/icons";
import useStyles from "./styles";
import UploadFileButton from "../../../../components/FileButtons/UploadFileButton";
import MuiTable from "../../../../components/MuiTable";
import { CircularProgress } from "@material-ui/core";
import AlertDialog from "../../../../components/AlertDialog";
import { Typography } from "@material-ui/core";
import CreateLabModal from "./CreateLabModal";
import Section from "../../../../components/Section";
import SimpleModal from "../../../../components/Modal/SimpleModal";
import NiedEditor from "../../../../components/Editor";
import SecondsToRusTime from "../../../../components/SecondsToRusTime";
import { Edit } from '@material-ui/icons';
import EditModal from './EditModal';
import { Fab } from '@material-ui/core';

const monthA = " января , февраля , марта , апреля , мая , июня , июля , августа , сентября , октября , ноября , декабря ".split(
  ",",
);

const DisciplineLecturesConfig = (props) => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(null);
  
  
  const id_discipline = props.match.params.id_discipline;
  const [progress, setProgress] = useState(false);
  const [progressId, setProgressId] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertDescription, setAlertDescription] = useState(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorId, setEditorId] = useState(false);
  const [editorTitle, setEditorTitle] = useState(false);
  const [lectureName, setLectureName] = useState(null);
  const [lectureTime, setLectureTime] = useState(null);
  const [lectureContent, setLectureContent] = useState(null);
  const [lectureInitialContent, setLectureInitialContent] = useState(null);
  const [lectureEditorId, setLectureEditorId] = useState(null);

  function editLecture(id, name, time, content) {
    setLectureEditorId(id);
    setLectureName(name);
    setLectureTime(time);
    setLectureInitialContent(content);
    setEditorTitle("Редактирование: "+name);
    setEditorOpen(true);
  }

  function createLecture() {
    setLectureEditorId(null);
    setLectureName(null);
    setLectureTime(null);
    setLectureInitialContent(null);
    setEditorTitle("Создание лекции");
    setEditorOpen(true);
  }

  function handleEditorSave(name,time,content) {
    console.log({lectureEditorId,name,time,content});
  }

  const removeFile = async (id_lab) => {
    setProgress(true);
    setProgressId(id_lab);
    await API.call({
      method: "check_lab_data",
      lab: id_lab,
      discipline: id_discipline,
    }).then((result) => {
      if (result.success) {
        if (result.status === "DATA_EXISTS") {
          let message = <>{result.data.map(el => 
            <Typography>{el}</Typography>
          )}</>;
          // console.log(message);
          setAlertDescription(message);
          setOpen(true);
        } else if (result.status === "DATA_NOT_EXISTS") {
          agreedRemoving();
        }
      } else {
        setProgress(false);
        setProgressId(false);
      }
    });
  };

  const agreedRemoving = async () => {
    await API.call({
      method: "delete_lab",
      lab: progressId,
      discipline: id_discipline,
    }).then((result) => {
      if (result.success) {
        // getData();
      } else {
        setProgress(false);
        setProgressId(false);
      }
    });
  };

  const getFile = async (lab, filename) => {
    await API.filecall(
      {
        method: "get_lab_file",
        lab: lab,
      },
      filename,
    ).then((result) => {
      if (!result.success) {
        alert("Ошибка загрузки! Откройте консоль!");
      }
    });
  };

  // const getData = async () => {
  //   await API.call({
  //     method: "get_discipline_labs",
  //     discipline: id_discipline,
  //   }).then((result) => {
  //     if (result.success) {
  //       setData(result.data);
  //     }
  //     setProgress(false);
  //     setProgressId(false);
  //   });
  // };

  // useEffect(() => {
  //   getData();
  //   return () => {
  //     setData(null);
  //   };
  // }, []);


  return (
    <>
      <AlertDialog
        open={open}
        setOpen={setOpen}
        question={"Удалить лабораторную вместе со всеми данными?"}
        description={alertDescription}
        successCallback={agreedRemoving}
        failCallback={() => {
          setProgress(false);
          setProgressId(false);
        }}
      />
      <Section update={update} setUpdate={setUpdate} debug noDataAllowed
        setData={setData}
        requestData={{
          method: 'getLectures',
          discipline: id_discipline,
        }}
      >
        <MuiTable
          title="Список лекций"
          columns={[
            "№, (ID)",
            "Название",
            "Минимальное время",
            "Изменен",
            "Действия (edit, delete)",
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
                      if (el.updated_at === null)
                        el.updated_at = el.created_at;
                      el.updated_at = new Date(el.updated_at);

                      newData.push([
                        index + 1 + " (ID" + el.id_lecture + ")",
                        el.name,
                        <SecondsToRusTime time={el.time}/>,
                        el.updated_at.getDate() +
                          monthA[el.updated_at.getMonth()] +
                          el.updated_at.getFullYear() +
                          " " +
                          el.updated_at.getHours() +
                          ":" +
                          el.updated_at.getMinutes(),
                        <div style={{ display: "flex" }}>
                          <IconButton
                            color={"primary"}
                            onClick={() => {
                              editLecture(
                                el.id_lecture,
                                el.name,
                                el.time,
                                el.content
                              );
                            }}
                            disabled={progress}
                          >
                              <Tooltip
                                title="Редактировать"
                                placement="top"
                                arrow
                              >
                                <Edit />
                              </Tooltip>
                          </IconButton>
                          <IconButton
                            variant="outlined"
                            color="secondary"
                            className={classes.B2}
                            onClick={() => {
                              removeFile(el.id_lab);
                            }}
                            disabled={progress}
                          >
                            {progress && progressId === el.id_lecture ? (
                              <CircularProgress
                                color="primary"
                                size={20}
                              />
                            ) : (
                              <Tooltip
                                title="Удалить"
                                placement="top"
                                arrow
                              >
                                <Delete />
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
        <EditModal
          onClose={()=>setLectureEditorId(null)}
          name={lectureName}
          time={lectureTime}
          initialContent={lectureInitialContent}
          open={editorOpen}
          setOpen={setEditorOpen}
          title={editorTitle}
          onSave={handleEditorSave}
        />
        {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
        <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
          <Tooltip title="Создать лекцию" placement="top" arrow>
            <Fab color="primary" onClick={() => { createLecture() }}>
              <Add />
            </Fab>
          </Tooltip>
        </div>
      </Section>
    </>
  );
};

export default DisciplineLecturesConfig;
