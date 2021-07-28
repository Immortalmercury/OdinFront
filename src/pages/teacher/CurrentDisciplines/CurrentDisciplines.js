import React, { useState, useEffect } from "react";
import { Grid, Button, CardContent, Card, Divider } from "@material-ui/core";

// styles
import useStyles from "./styles";
import { Typography } from "../../../components/Wrappers/Wrappers";
import API from "../../../services/API";
import LoadingPage from "../../../components/Loading/index";
import Header from "../../../components/Header/Header";
import { ArrowForward } from "@material-ui/icons";

export default function CurrentDisciplines(props) {
  var classes = useStyles();
  const [disciplines, setDisciplines] = useState(null);
  const semester = props.match.params.semester_num;
  const [loading, setLoading] = useState(true);
  const now = new Date();

  const getData = async () => {
    await API.call({
      method: "current_disciplines",
    }).then((result) => {
      if (result.success) {
        setDisciplines(result.data);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    getData();
    return () => {
      setDisciplines(false);
      setLoading(true);
    };
  }, [semester]);

  return (
    <>
      <Header
        history={props.history}
        title={
          "Текущие дисциплины (" +
          (now.getMonth() < 8 ? "1" : "2") +
          " семестр " +
          now.getFullYear() +
          ")"
        }
      />
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <Grid container spacing={2}>
            {disciplines ? (
              disciplines.map((item) => (
                <Grid
                  item
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  key={item.id_discipline}
                >
                  <Card className={classes.root} style={{ height: "100%" }}>
                    <CardContent
                      style={{ width: "100%" }}
                      className={classes.CardContent}
                    >
                      <div>
                        <Typography color="textSecondary" variant="h6">
                          {item.description}
                        </Typography>
                        <Divider style={{ marginBottom: 20 }} />
                      </div>
                      <div>
                        <Typography
                          className={classes.pos}
                          color="textSecondary"
                        >
                          Группы:
                        </Typography>
                        {item.students.map((student) => (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => {
                                props.history.push(
                                  "/teacher/discipline/" +
                                    item.id_discipline +
                                    "/group/" +
                                    student.id_group,
                                );
                              }}
                              style={{ margin: "0 5px 5px 0" }}
                            >
                              {student.id_group} <ArrowForward />
                            </Button>
                          </>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography color="textSecondary" gutterBottom variant="h5">
                Ничего нет
              </Typography>
            )}
          </Grid>
        </>
      )}
    </>
  );
}
