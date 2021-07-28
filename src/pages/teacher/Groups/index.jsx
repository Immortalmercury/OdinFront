import React, { useState, useEffect } from "react";
import { Grid, IconButton } from "@material-ui/core";
import useStyles from "./styles";
import API from "../../../services/API";
import LoadingPage from "./../../../components/Loading/index";
import Header from "./../../../components/Header/Header";
import MuiTable from "../../../components/MuiTable";
import ViewModal from "./ViewModal";
import CreateGroupModal from "./CreateGroupModal";
import SecureOptionSwitcher from "./../../../components/SecureOptionSwitcher/index";
import { Delete } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core";

// const monthA = ' января , февраля , марта , апреля , мая , июня , июля , августа , сентября , октября , ноября , декабря '.split(',');
const convertData = (
  data,
  classes,
  setRerender,
  passwordForDelete,
  deleteAllowed,
) => {
  let newData = [];
  if (data !== null)
    for (let index = 0; index < data.length; index++) {
      const el = data[index];
      let now = new Date();
      let year = now.getMonth() < 8 ? now.getFullYear() - 1 : now.getFullYear();
      let course = year - el.admission_year;
      newData.push([
        el.id_group,
        el.admission_year+(course<6 ? " ("+course+" курс)":"(Выпускники)"),
        el.students_count,
        <div style={{ display: "flex" }}>
          <ViewModal group={el.id_group} setRerender={setRerender} />
          {passwordForDelete && deleteAllowed && (
            <IconButton
              variant="outlined"
              color="secondary"
              className={classes.B2}
              style={{ marginLeft: 10 }}
              onClick={() => {
                deleteGroup(el.id_group, setRerender);
              }}
            >
              <Tooltip title="Навсегда удалить группу" placement="top" arrow>
                <Delete />
              </Tooltip>
            </IconButton>
          )}
        </div>,
      ]);
    }
  return newData;
};

const getData = async (setData, setLoading) => {
  await API.call({
    method: "groups",
  }).then((result) => {
    if (result.success) {
      setData(result.data);
    }
    setLoading(false);
  });
};

const deleteGroup = async (group, setRerender) => {
  await API.call({
    method: "delete_group",
    group,
  }).then((result) => {
    if (result.success) {
      setRerender(true);
    }
  });
};

const Groups = (props) => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rerender, setRerender] = useState(false);
  const [passwordForDelete, setPasswordForDelete] = useState("");
  const [deleteAllowed, setDeleteAllowed] = useState(false);

  useEffect(() => {
    getData(setData, setLoading);
    return () => {
      setData(null);
      setLoading(true);
      setRerender(false);
    };
  }, [rerender]);

  return (
    <>
      <Header
        history={props.history}
        title={loading && !data ? "Загрузка" : "Группы"}
      />
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div style={{ paddingTop: 10 }}>
            <SecureOptionSwitcher
              label={"Удаление групп"}
              passwordValue={passwordForDelete}
              setPasswordValue={setPasswordForDelete}
              allowed={deleteAllowed}
              setAllowed={setDeleteAllowed}
            />
          </div>
          <Grid
            container
            spacing={4}
            style={{ paddingTop: 10, paddingBottom: 100 }}
          >
            <Grid item xs={12}>
              <MuiTable
                title="Список групп"
                data={
                  !loading &&
                  data &&
                  convertData(
                    data,
                    classes,
                    setRerender,
                    passwordForDelete,
                    deleteAllowed,
                  )
                }
                columns={[
                  "Номер",
                  "Год поступления",
                  "Студентов в группе",
                  "Действия",
                ]}
              />
            </Grid>
          </Grid>
          <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
            <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
              <CreateGroupModal setRerender={setRerender} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Groups;
