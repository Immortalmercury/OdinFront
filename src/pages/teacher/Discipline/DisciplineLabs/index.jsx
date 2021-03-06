/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { Grid, IconButton, Tooltip, CircularProgress } from "@material-ui/core";
import API from "../../../../services/API";
import { Delete } from "@material-ui/icons";
import useStyles from "./styles";
import CreateLabModal from "./CreateLabModal";
import DateToRusTime from './../../../../components/DateToRusTime/index';
import LoadingPage from './../../../../components/Loading/index';
import MuiTable from "../../../../components/MuiTable";

const DisciplineLabs = (props) => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const id_discipline = props.match.params.id_discipline;
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(false);
  const [progressId, setProgressId] = useState(false);
  // const [open, setOpen] = useState(false);
  // const [alertDescription, setAlertDescription] = useState(null);
  const id_group = props.match.params.id_group;

  const removeFile = async (lab,group) => {
    setProgress(true);
    setProgressId(lab);
    await API.call({
      method: "delete_config",
      group: id_group,
      lab
    }).then((result) => {
      if (result.success) {
        getData();
      } else {
        setProgress(false);
        setProgressId(false);
      }
    });
  };



 

  const getData = async () => {
    await API.call({
      method: "get_config",
      discipline: id_discipline,
      group: id_group,
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
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
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
                title="???????????? ????????????????"
                columns={[
                  "???,ID",
                  "???????????????? (??????????????????????)",
                  "???????????????? ??????????",
                  "??????????????",
                  "????????????????",
                ]}
                noMatch={"?????? ????????????????????????"}
                data={
                  loading || !data
                    ? []
                    : (() => {
                        let newData = [];
                        if (data !== null)
                          for (let index = 0; index < data.length; index++) {
                            const el = data[index];
                            newData.push([
                              index + 1 + " (ID" + el.lab.id_lab + ")",
                              <>
                                {el.lab.description}
                                {el.lab.comment && (
                                  <>
                                    <br />
                                    {"(" + el.lab.comment + ")"}
                                  </>
                                )}
                              </>,
                              <DateToRusTime time={ el.config.allowed_after }/>,
                              <DateToRusTime time={ el.config.deadline }/>,
                              <div style={{ display: "flex" }}>
                                <IconButton
                                  variant="outlined"
                                  color="secondary"
                                  className={classes.B2}
                                  onClick={() => {
                                    removeFile(el.lab.id_lab);
                                  }}
                                  disabled={progress}
                                >
                                  {progress && progressId === el.lab.id_lab ? (
                                    <CircularProgress
                                      color="primary"
                                      size={20}
                                    />
                                  ) : (
                                    <Tooltip
                                      title="??????????????"
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
            </Grid>
          </Grid>
          <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
            <CreateLabModal
              appendDataCallback={getData}
              group={id_group}
            />
          </div>
        </>
      )}
    </>
  );
};

export default DisciplineLabs;
