import React, { useEffect, useState } from "react";
// import Header from "../../components/Header/Header";
// import LoadingPage from "../../components/Loading";
// import MuiTable from "../../components/MuiTable";
// import API from "../../services/API";
// import { Avatar } from "@material-ui/core";
// import { Check, Close, Delete } from "@material-ui/icons";
// import useStyles from "./styles";
// import SecureOptionSwitcher from "../../../components/SecureOptionSwitcher";
// import RequestButton from '../../../components/FileButtons/RequestButton';
// import CreateThemeModal from "./CreateThemeModal";

const DisciplineCourse = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [passwordForDelete, setPasswordForDelete] = useState("");
  const [deleteAllowed, setDeleteAllowed] = useState(false);
  const [rerender, setRerender] = useState(false);
  // const classes = useStyles();

  // const getData = async () => {
  //   setLoading(true);
  //   await API.call({
  //     method: "all_disciplines",
  //   }).then((result) => {
  //     if (result.success) {
  //       setData(result.data);
  //     }
  //     setLoading(false);
  //   });
  // };

  useEffect(() => {
    // getData(setData, setLoading);
    return () => {
      setData(null);
      setLoading(true);
      setRerender(false);
    };
  }, [rerender]);

  // const convertData = () => {
  //   let newData = [];
  //   if (data !== null)
  //     for (let index = 0; index < data.length; index++) {
  //       const el = data[index];

  //       newData.push([
  //         el.description,
  //         el.id_student !== null ? (
  //           <div style={{ display: "flex", alignItems: "center" }}>
  //             <Avatar
  //               sizes={50}
  //               src={el.student.photo}
  //               style={{ marginRight: 10 }}
  //             />
  //             {el.student.s_name +
  //               " " +
  //               (el.student.f_name && el.student.f_name[0] + ".") +
  //               (el.student.fth_name && el.student.fth_name[0] + ".")}
  //           </div>
  //         ) : (
  //           "Отсутствует"
  //         ),
  //         <div style={{ display: "flex" }}>
  //           {el.confirmed === 0 (<>
  //             <RequestButton
  //               color="primary"
  //               className={classes.B5}
  //               buttonType={"IconButton"}
  //               icon={<Check/>}
  //               label="Подтвердить"
  //               style={{ marginLeft: 10 }}
  //               requestData={{
  //                 method: "confirm_theme",
  //                 theme: el.id_theme,
  //               }}
  //               onSuccess={setRerender(true)}
                
  //             />
  //             <RequestButton
  //               className={classes.B3}
  //               color="secondary"
  //               buttonType={"IconButton"}
  //               icon={<Close/>}
  //               label="Отклонить"
  //               style={{ marginLeft: 10 }}
  //               requestData={{
  //                 method: "decline_theme",
  //                 theme: el.id_theme,
  //               }}
  //               onSuccess={setRerender(true)}
                
  //             />
  //           </>)}
  //           {passwordForDelete && deleteAllowed && (
  //             <RequestButton
  //             className={classes.B2}
  //             color="secondary"
  //             buttonType={"IconButton"}
  //             icon={<Delete/>}
  //             label="Удалить"
  //             style={{ marginLeft: 10 }}
  //             requestData={{
  //               method: "delete_theme",
  //               theme: el.id_theme,
  //             }}
  //             onSuccess={setRerender(true)}
              
  //           />)}
            
              
            
  //         </div>,
  //       ]);
  //     }
  //   return newData;
  // };

  return (
    <>
      {/* <Header history={props.history} title={"Мои дисциплины"} />
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
            columns={["Название", "Студент", "Действия"]}
            data={!loading && data ? convertData() : []}
            />
            <div style={{ paddingBottom: 100 }}></div>
          <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
          <div style={{ position: "fixed", right: 0, bottom: 0, margin: 30 }}>
            <CreateThemeModal setRerender={setRerender} />
          </div>
        </div>
          </>
      )} */}

    </>
  );
};

export default DisciplineCourse;
