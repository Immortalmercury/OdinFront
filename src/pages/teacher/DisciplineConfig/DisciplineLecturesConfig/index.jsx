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
        getData();
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

  const getData = async () => {
    await API.call({
      method: "get_discipline_labs",
      discipline: id_discipline,
    }).then((result) => {
      if (result.success) {
        setData(result.data);
      }
      setProgress(false);
      setProgressId(false);
    });
  };

  useEffect(() => {
    getData();
    return () => {
      setData(null);
    };
  }, []);


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
      {/* yarn add @edsdk/n1ed-react */}
      <Section update={update} setUpdate={setUpdate} debug noDataAllowed
        setData={setData}
        requestData={{
          method: 'getLectures',
          id_discipline,
        }}
      >
        <MuiTable
          title="Список лекций"
          columns={[
            "ID",
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
                        index + 1 + " (ID" + el.id_lab + ")",
                        <>
                          {el.description}
                          {el.comment && (
                            <>
                              <br />
                              {"(" + el.comment + ")"}
                            </>
                          )}
                        </>,
                        el.updated_at.getDate() +
                          monthA[el.updated_at.getMonth()] +
                          el.updated_at.getFullYear() +
                          " " +
                          el.updated_at.getHours() +
                          ":" +
                          el.updated_at.getMinutes(),
                        <div style={{ display: "flex" }}>
                          <UploadFileButton
                            data={{
                              method: "upload_lab_file",
                              lab: el.id_lab,
                            }}
                            label={
                              (el.file === null
                                ? "Загрузить"
                                : "Обновить") + " файл задания"
                            }
                            buttonType={"IconButton"}
                            successCallback={getData}
                            disabled={progress}
                          />
                          {el.file !== null && (
                            <IconButton
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                getFile(
                                  el.id_lab,
                                  el.description +
                                    "." +
                                    el.file.split(".")[1],
                                );
                              }}
                              disabled={progress}
                            >
                              <GetApp />
                            </IconButton>
                          )}
                        </div>,
                        <div style={{ display: "flex" }}>
                          <IconButton
                            variant="outlined"
                            color="secondary"
                            className={classes.B2}
                            onClick={() => {
                              removeFile(el.id_lab);
                            }}
                            disabled={progress}
                          >
                            {progress && progressId === el.id_lab ? (
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
        <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
          <CreateLabModal
            appendDataCallback={getData}
            discipline={id_discipline}
          />
        </div>
      </Section>
    </>
  );
};

export default DisciplineLecturesConfig;
