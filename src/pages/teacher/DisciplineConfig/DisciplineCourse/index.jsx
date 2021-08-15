import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import { Check, Close, Delete, RotateLeft } from "@material-ui/icons";
import useStyles from "./styles";
import CreateThemeModal from "./CreateThemeModal";
import API from "../../../../services/API";
import RequestButton from './../../../../components/FileButtons/RequestButton';
import LoadingPage from './../../../../components/Loading/index';
import SecureOptionSwitcher from "../../../../components/SecureOptionSwitcher";
import MuiTable from "../../../../components/MuiTable"; 
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const DisciplineCourse = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [passwordForDelete, setPasswordForDelete] = useState("");
  const [deleteAllowed, setDeleteAllowed] = useState(false);
  const [rerender, setRerender] = useState(false);
  const classes = useStyles();
  const id_discipline = props.match.params.id_discipline;

  const getData = async () => {
    // setLoading(true);
    await API.call({
      method: "get_themes",
      discipline: id_discipline,
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
      // setLoading(true);
      setRerender(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerender]);

  const convertData = () => {
    let newData = [];
    if (data !== null)
      for (let index = 0; index < data.length; index++) {
        const el = data[index];

        newData.push([
          el.description,
          el.id_student !== null ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sizes={50}
                src={el.student.photo}
                style={{ marginRight: 10 }}
              />
              {el.student.s_name +
                " " +
                (el.student.f_name && el.student.f_name[0] + ".") +
                (el.student.fth_name && el.student.fth_name[0] + ".")}
            </div>
          ) : (
            "Отсутствует"
          ),
          el.id_student !== null && (el.confirmed === -1 ? (
            <span style={{ color: "red" }}>
              <FiberManualRecordIcon style={{ height: 12 }} />
              Отклонена
            </span>
          ) : el.confirmed === 1 ? (
            <span style={{ color: "green" }}>
              <FiberManualRecordIcon style={{ height: 12 }} />
              Подтверждена
            </span>
          ):(
            <span style={{ color: "orange" }}>
              <FiberManualRecordIcon style={{ height: 12 }} />
              На рассмотрении
            </span>
          )),
          <div style={{ display: "flex" }}>
            {el.confirmed === 0 ? (<>
              <RequestButton
                color="primary"
                className={classes.B5}
                buttonType={"IconButton"}
                icon={<Check/>}
                label="Подтвердить"
                style={{ marginLeft: 10 }}
                requestData={{
                  method: "confirm_theme",
                  theme: el.id_theme,
                }}
                onSuccess={()=>getData()}
                
              />
              <RequestButton
                className={classes.B3}
                color="secondary"
                buttonType={"IconButton"}
                icon={<Close/>}
                label="Отклонить"
                style={{ marginLeft: 10 }}
                requestData={{
                  method: "decline_theme",
                  theme: el.id_theme,
                }}
                onSuccess={()=>getData()}
                
              />
            </>):(<RequestButton
                color="primary"
                className={classes.B4}
                buttonType={"IconButton"}
                icon={<RotateLeft/>}
                label="Отменить решение"
                style={{ marginLeft: 10 }}
                requestData={{
                  method: "reset_theme",
                  theme: el.id_theme,
                }}
                onSuccess={()=>getData()}
                
              />)}
            {passwordForDelete && deleteAllowed && (
              <RequestButton
              className={classes.B2}
              color="primary"
              buttonType={"IconButton"}
              icon={<Delete/>}
              label="Удалить"
              style={{ marginLeft: 10 }}
              requestData={{
                method: "delete_theme",
                theme: el.id_theme,
              }}
              onSuccess={()=>getData()}
              
            />)}
            
              
            
          </div>,
        ]);
      }
    return newData;
  };

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div style={{ paddingBottom: 10 }}>
            <SecureOptionSwitcher
              label={"Удаление тем"}
              passwordValue={passwordForDelete}
              setPasswordValue={setPasswordForDelete}
              allowed={deleteAllowed}
              setAllowed={setDeleteAllowed}
            />
          </div>
          <MuiTable 
            title={"Список тем"}
            columns={["Название", "Студент", "Статус", "Действия"]}
            data={!loading && data ? convertData() : []}
            />
            <div style={{ paddingBottom: 100 }}></div>
          <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
          <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
                <CreateThemeModal setRerender={()=>getData()} discipline={ id_discipline}/>
          </div>
        </div>
          </>
      )}

    </>
  );
};

export default DisciplineCourse;
