import React, { useEffect, useState } from "react";
import Header from "./../../../components/Header/Header";
import LoadingPage from "../../../components/Loading";
import MuiTable from "../../../components/MuiTable";
import API from "../../../services/API";
import { Avatar } from "@material-ui/core";
import HiddenValue from "../../../components/HiddenValue";
import SettingsIcon from "@material-ui/icons/Settings";
import { Tooltip, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import useStyles from "./styles";
import SecureOptionSwitcher from "./../../../components/SecureOptionSwitcher/index";

const MyDisciplines = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [passwordForDelete, setPasswordForDelete] = useState("");
  const [deleteAllowed, setDeleteAllowed] = useState(false);
  const classes = useStyles();

  const getData = async () => {
    setLoading(true);
    await API.call({
      method: "my_disciplines",
    }).then((result) => {
      if (result.success) {
        setData(result.data);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    getData();
    return () => {
      setLoading(true);
    };
  }, []);

  const convertData = () => {
    let newData = [];
    if (data !== null)
      for (let index = 0; index < data.length; index++) {
        const el = data[index];

        newData.push([
          el.description,
          el.id_creator !== null ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sizes={50}
                src={el.creator_data.photo}
                style={{ marginRight: 10 }}
              />
              {el.creator_data.s_name +
                " " +
                (el.creator_data.f_name && el.creator_data.f_name[0] + ".") +
                (el.creator_data.fth_name && el.creator_data.fth_name[0] + ".")}
            </div>
          ) : (
            "Отсутствует"
          ),
          <HiddenValue
            customLabel={"Преподаватели"}
            buttonType="Button"
            buttonProps={{
              variant: "outlined",
              size: "small",
            }}
            buttonText={"Открыть (" + el.teachers_data.length + ")"}
            text={el.teachers_data.map((element) => {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: 10,
                  }}
                >
                  <Avatar
                    sizes={50}
                    src={element.photo}
                    style={{ marginRight: 10 }}
                  />
                  {element.s_name +
                    " " +
                    (element.f_name && element.f_name + " ") +
                    (element.fth_name && element.fth_name + " ")}
                </div>
              );
            })}
          />,
          <div style={{ display: "flex" }}>
            <IconButton
              variant="outlined"
              color="primary"
              style={{ marginLeft: 10 }}
              onClick={() => {
                props.history.push("/teacher/discipline/" + el.id_discipline);
              }}
            >
              <Tooltip title="Конфигурировать" placement="top" arrow>
                <SettingsIcon />
              </Tooltip>
            </IconButton>
            {passwordForDelete && deleteAllowed && (
              <IconButton
                variant="outlined"
                className={classes.B2}
                style={{ marginLeft: 10 }}
              >
                <Tooltip title="Навсегда удалить" placement="top" arrow>
                  <Delete />
                </Tooltip>
              </IconButton>)}
          </div>,
        ]);
      }
    return newData;
  };

  return (
    <>
      <Header history={props.history} title={"Мои дисциплины"} />
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div style={{ paddingBottom: 10 }}>
            <SecureOptionSwitcher
              label={"Удаление дисциплин"}
              passwordValue={passwordForDelete}
              setPasswordValue={setPasswordForDelete}
              allowed={deleteAllowed}
              setAllowed={setDeleteAllowed}
            />
          </div>
          <MuiTable
            title={"Список дисциплин"}
            columns={["Название", "Создатель", "Преподаватели", "Действия"]}
            data={!loading && data ? convertData() : []}
          />
        </>
      )}
    </>
  );
};

export default MyDisciplines;
