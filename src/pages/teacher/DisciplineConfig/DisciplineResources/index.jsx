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
import { Helmet } from "react-helmet";

const monthA = " января , февраля , марта , апреля , мая , июня , июля , августа , сентября , октября , ноября , декабря ".split(
  ",",
);
const convertData = (data, classes, discipline, setRerender) => {};

const getFile = async (id_resource, filename) => {
  await API.filecall(
    {
      method: "get_resource",
      resource: id_resource,
    },
    filename,
  ).then((result) => {
    if (!result.success) {
      alert("Ошибка загрузки! Откройте консоль!");
    }
  });
};



const DisciplineResources = (props) => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const id_discipline = props.match.params.id_discipline;
  const [loading, setLoading] = useState(true);
  const [rerender, setRerender] = useState(false);
  const [progress, setProgress] = useState(false);
  const [progressId, setProgressId] = useState(false);

  const removeFile = async (id_resource) => {
    setProgress(true);
    setProgressId(id_resource);
    await API.call({
      method: "delete_resource_from_discipline",
      resource: id_resource,
      discipline: id_discipline,
    }).then((result) => {
      if (result.success) {
        getData();
      }
    });
  };

  const getData = async () => {
    await API.call({
      method: "get_discipline_resources",
      discipline: id_discipline,
    }).then((result) => {
      if (result.success) {
        setData(result.data);
      }
      setLoading(false);
      setProgress(false);
      setProgressId(false);
    });
  };

  useEffect(() => {
    getData();
    return () => {
      setData(null);
      setLoading(true);
      setRerender(false);
    };
  }, [rerender]);

  return (
    <>
      <Helmet title="Ресурсы" />
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <Grid
            container
            spacing={4}
            style={{ paddingTop: 10, paddingBottom: 100 }}
          >
            <Grid item xs={12}>
              <MuiTable
                title="Список ресурсов"
                data={
                  loading || !data
                    ? []
                    : (() => {
                        let newData = [];
                        if (data !== null)
                          for (let index = 0; index < data.length; index++) {
                            const el = data[index];
                            let type = null;
                            switch (el.type) {
                              case 1:
                                type = <Archive />;
                                break;

                              case 2:
                                type = <Description />;
                                break;

                              default:
                                type = el.type;
                                break;
                            }

                            if (el.updated_at === null)
                              el.updated_at = el.created_at;
                            el.updated_at = new Date(el.updated_at);

                            newData.push([
                              type,
                              el.description,
                              el.updated_at.getDate() +
                                monthA[el.updated_at.getMonth()] +
                                el.updated_at.getFullYear() +
                                " " +
                                el.updated_at.getHours() +
                                ":" +
                                el.updated_at.getMinutes(),
                              <div style={{ display: "flex" }}>
                                <IconButton
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {
                                    getFile(el.id_resource, el.description);
                                  }}
                                  disabled={progress}
                                >
                                  <GetApp />
                                </IconButton>
                                <IconButton
                                  variant="outlined"
                                  color="secondary"
                                  className={classes.B2}
                                  onClick={() => {
                                    removeFile(el.id_resource);
                                  }}
                                  disabled={progress}
                                >
                                  {progress &&
                                  progressId === el.id_resource ? (
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
                columns={["Тип", "Название", "Загружено", "Действия"]}
                noMatch={"Нет ресурсов"}
              />
            </Grid>
          </Grid>
          <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
            <UploadFileButton
              color="primary"
                buttonType="Fab"
                label="Загрузить новый файл"
              icon={<Add />}
              data={{
                method: "upload_resource",
                discipline: id_discipline,
              }}
              successCallback={getData}
            />
          </div>
        </>
      )}
    </>
  );
};

export default DisciplineResources;
