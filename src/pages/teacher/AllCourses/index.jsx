import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import LoadingPage from "../../../components/Loading";
import MuiTable from "../../../components/MuiTable";
import API from "../../../services/API";
import { Avatar } from "@material-ui/core";
import HiddenValue from "../../../components/HiddenValue";
import SettingsIcon from "@material-ui/icons/Settings";
import { Tooltip, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import useStyles from "./styles";
import SecureOptionSwitcher from "../../../components/SecureOptionSwitcher/index";
import CreateModal from "./CreateModal";
import  ForwardIcon  from '@material-ui/icons/Forward';

const AllCourses = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [passwordForDelete, setPasswordForDelete] = useState("");
  const [deleteAllowed, setDeleteAllowed] = useState(false);
  const [rerender, setRerender] = useState(false);
  const classes = useStyles();

  const getData = async () => {
    setLoading(true);
    await API.call({
      method: "allCourses",
    }).then((result) => {
      if (result.success) {
        setData(result.data);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    getData(setData, setLoading);
    return () => {
      setData(null);
      setLoading(true);
      setRerender(false);
    };
  }, [rerender]);

  const convertData = () => {
    let newData = [];
    if (data !== null)
      for (let index = 0; index < data.length; index++) {
        const el = data[index];

        newData.push([
          el.name,
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
            customLabel={"Дисциплины"}
            buttonType="Button"
            buttonProps={{
              variant: "outlined",
              size: "small",
            }}
            buttonText={"Открыть (" + el.disciplines.length + ")"}
            text={el.disciplines.map((element) => {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: 10,
                    borderBottom: '1px solid grey',
                  }}
                >
                  {element.discipline_description}
                  <IconButton
                    variant="outlined"
                    color="primary"
                    style={{ marginLeft: 10 }}
                    onClick={() => {
                      props.history.push("/teacher/discipline/" + element.id_discipline);
                    }}
                  >
                    <Tooltip title="Конфигурировать" placement="top" arrow>
                      <ForwardIcon />
                    </Tooltip>
                  </IconButton>
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
                props.history.push("/teacher/courses/" + el.id_course);
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
      <Header history={props.history} title={"Все курсы"} />
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div style={{ paddingBottom: 10 }}>
            <SecureOptionSwitcher
              label={"Удаление курсов"}
              passwordValue={passwordForDelete}
              setPasswordValue={setPasswordForDelete}
              allowed={deleteAllowed}
              setAllowed={setDeleteAllowed}
            />
          </div>
          <MuiTable 
            title={"Список курсов"}
            columns={["Название", "Создатель", "Дисциплины", "Действия"]}
            data={!loading && data ? convertData() : []}
            />
            <div style={{ paddingBottom: 100 }}></div>
          <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
          <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
            <CreateModal setRerender={setRerender} />
          </div>
        </div>
          </>
      )}

    </>
  );
};

export default AllCourses;
