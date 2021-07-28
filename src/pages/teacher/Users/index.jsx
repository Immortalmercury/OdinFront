/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { Grid, IconButton, AppBar, Paper, Tab, Tabs } from "@material-ui/core";
import LoadingPage from "../../../components/Loading/index";
import Header from "../../../components/Header/Header";
import { Delete } from "@material-ui/icons";
import API from "../../../services/API";
import useStyles from "./styles";
import SecondsToRusTime from "./../../../components/SecondsToRusTime/index";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import CreateInvitationsModal from "./CreateInvitationsModal";
import MuiTable from "./../../../components/MuiTable/index";
import HiddenValue from "../../../components/HiddenValue";
import SecureOptionSwitcher from "../../../components/SecureOptionSwitcher";

const monthA = " января , февраля , марта , апреля , мая , июня , июля , августа , сентября , октября , ноября , декабря ".split(
  ",",
);

const convertData = (tab, data, classes, deleteRequest, passwordForDelete, deleteAllowed) => {
  let newData = [];
  if (data !== null)
    for (let index = 0; index < data.length; index++) {
      const el = data[index];
      if (tab === "invitations") {
        let created = new Date(el.created_at);
        let past_time = (new Date().getTime() - created.getTime()) / 1000;
        newData.push([
          el.login,
          el.role === 91
            ? "Студента " + (el.id_group ? el.id_group : " без группы")
            : el.role === 92
            ? "Преподавателя"
            : el.role === 93
            ? "Администратора"
            : "Не определено",
          !el.created_at ? (
            "Не определен"
          ) : (el.role === 91 && past_time > 60 * 60 * 24 * 7) ||
            (el.role === 92 && past_time > 60 * 60 * 24 * 4) ||
            (el.role === 93 && past_time > 60 * 60 * 24 * 1) ? (
            <span style={{ color: "red" }}>Истек</span>
          ) : (
            <SecondsToRusTime
              time={60 * 60 * 24 * (7 - 4 * (el.role - 91)) - past_time}
            />
          ),
          <div style={{ display: "flex" }}>
            <IconButton
              variant="outlined"
              color="secondary"
              className={classes.B2}
              onClick={() => {
                deleteRequest("delete_invite", el.login);
              }}
            >
              <Delete />
            </IconButton>
          </div>,
        ]);
      } else {
        var last_login =
          -(new Date(el.last_login) - new Date()) / 1000 - 60 * 60 * 3;
        var tempFields = [];
        tempFields.push(
          el.s_name + " " + el.f_name + (el.fth_name ? " " + el.fth_name : ""),
        );
        if (tab === "students") tempFields.push(el.id_group);
        newData.push([
          ...tempFields,
          <HiddenValue label="Email" text={el.email} />,
          el.banned ? (
            <span style={{ color: "red" }}>
              <FiberManualRecordIcon style={{ height: 12 }} />
              Заблокирован
            </span>
          ) : (
            <span style={{ color: "green" }}>
              <FiberManualRecordIcon style={{ height: 12 }} />
              Нет
            </span>
          ),
          !el.last_login ? (
            "Никогда"
          ) : last_login < 60 ? (
            <span style={{ color: "green" }}>
              <FiberManualRecordIcon style={{ height: 12 }} />
              Онлайн
            </span>
          ) : (
            <>
              <SecondsToRusTime time={last_login} />
              {" назад"}
            </>
          ),
          passwordForDelete&&deleteAllowed ? (
            <div style={{ display: "flex" }}>
              <IconButton
              variant="outlined"
              color="secondary"
              className={classes.B2}
              onClick={() => {
                deleteRequest("delete_user", el.login,passwordForDelete);
              }}
            >
              <Delete />
            </IconButton>
            </div>
          ) : (
            ""
          ),
        ]);
      }
    }
  return newData;
};

const columns = (tab) => {
  if (tab === "invitations")
    return ["Код приглашения", "В качестве", "Срок действия", "Удаление"];
  var first = ["ФИО"];
  if (tab === "students") {
    first.push("Группа");
  }
  return [...first, "Email", "Блокировка", "Последняя активность", "Действия"];
};

const titles = (tab) => {
  if (tab === "students") return "Студенты";
  if (tab === "studentsNoGroup") return "Студенты вне групп";
  if (tab === "teachers") return "Преподаватели";
  if (tab === "admins") return "Администраторы";
  if (tab === "invitations") return "Приглашения";
};

const Users = (props) => {
  const classes = useStyles();
  const [data, setData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("students");
  const [updating, setUpdating] = useState(false);
  const [passwordForDelete,setPasswordForDelete] = useState("");
  const [deleteAllowed,setDeleteAllowed] = useState("");

  const appendData = (newValues) => {
    let newData = data;
    Object.entries(newValues).map((e) => {
      newData.push(e[1]);
    });
    setData(newData);
    setUpdating(true);
  };

  const deleteRequest = async (method, login, password) => {
    await API.call({ method, login, password }).then((result) => {
      if (result.success) {
        (async () => {
          await API.call({ method: "get_users", tab }).then((result) => {
            if (result.success) setData(result.data);
            setLoading(false);
          });
        })();
      }
      setUpdating(true);
    });
  };

  useEffect(() => {
    setUpdating(false);
    return () => {
      setUpdating(false);
    };
  }, [updating]);

  useEffect(() => {
    (async () => {
      await API.call({ method: "get_users", tab }).then((result) => {
        if (result.success) setData(result.data);
        setLoading(false);
      });
    })();
    return () => {
      setData(false);
      setLoading(true);
    };
  }, [tab]);

  return (
    <>
      <Header history={props.history} title={"Пользователи"} />
      <Paper>
        <AppBar position="static" color="transparent">
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab value={"students"} label="Студенты" />
            <Tab value={"studentsNoGroup"} label="Студенты вне групп" />
            <Tab value={"teachers"} label="Преподаватели" />
            <Tab value={"admins"} label="Администраторы" />
            <Tab value={"invitations"} label="Приглашения" />
          </Tabs>
        </AppBar>
      </Paper>

      <div style={{ paddingTop: 10 }}>
        <SecureOptionSwitcher
          hidden={tab === "invitations" ? true : false}
          label={"Удаление пользователей"}
          passwordValue={passwordForDelete}
          setPasswordValue={setPasswordForDelete}
          allowed={deleteAllowed}
          setAllowed={setDeleteAllowed}
        />
      </div>

      <Grid container spacing={4} style={{ paddingTop: 10, paddingBottom: 100 }}>
        <Grid item xs={12}>
          {loading ? (
            <LoadingPage />
          ) : (
            <MuiTable
              title={titles(tab)}
              data={data && convertData(tab, data, classes, deleteRequest, passwordForDelete, deleteAllowed)}
              columns={columns(tab)}
              selectableRowsHideCheckboxes={
                tab === "invitations" ? false : true
              }
              onRowsDelete={async (currentRowsSelected) => {
                let deleteLogins = [];
                currentRowsSelected.data.map((el) => {
                  deleteLogins.push(data[el.dataIndex].login);
                });
                return await API.call({
                  method: "delete_invitations",
                  deleteLogins,
                }).then((result) => {
                  return result.success;
                });
              }}
            />
          )}
        </Grid>
      </Grid>

      {tab === "invitations" && !loading && (
        <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
          <CreateInvitationsModal appendDataCallback={appendData} />
        </div>
      )}
    </>
  );
};

export default Users;
