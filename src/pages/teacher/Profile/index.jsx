import { Avatar, Button, Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Centered from "../../../components/Centered";
import API from "../../../services/API";
import Header from "./../../../components/Header/Header";
import Typography from "@material-ui/core/Typography";
import useStyles from "./styles";
import UploadFileButton from "../../../components/FileButtons/UploadFileButton";
import LoadingPage from "./../../../components/Loading/index";

const TableItem = ({ name, col }) => {
  return (
    <>
      <div style={{ width: "100%", display: "flex", marginBottom: 15 }}>
        <div style={{ width: 150 }}>{name}</div>
        <div style={{ flexGrow: 1 }}>{col}</div>
      </div>
    </>
  );
};

const Profile = (props) => {
  var classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  const getData = async () => {
    // setLoading(true);
    setError(false);
    await API.call({
      method: "get_full_user_data",
    }).then((result) => {
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    getData();
    return () => {
      setData(null);
      setLoading(true);
    };
  }, []);

  return (
    <>
      <Header history={props.history} title={"Мой профиль"} />
      {loading ? (
        <LoadingPage />
      ) : error ? (
        <Centered>
          <Typography color="textSecondary">{error}</Typography>
        </Centered>
      ) : (
        <div
          style={{
            display: "flex",
            padding: 20,
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 300,
              height: "100%",
              alignItems: "center",
              justifyContent: "space-around",
              flexDirection: "column",
            }}
          >
            <Avatar
              src={data.photo}
              style={{ width: 250, height: 250 }}
              variant="rounded"
              className={classes.profile_btn2}
            />
            <UploadFileButton
              data={{
                method: "upload_avatar",
              }}
              label={"Изменить фото"}
              color="primary"
              variant={"outlined"}
              buttonType={"Button"}
              successCallback={() => getData()}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "60%",
              height: "100%",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <div variant="h3" style={{ marginBottom: 15 }}></div>
            <TableItem
              name={<Typography variant="h6">ФИО :</Typography>}
              col={
                <Typography variant="h6">
                  {data.s_name + " " + data.f_name + " " + data.fth_name}
                </Typography>
              }
            />
            <TableItem
              name={<Typography variant="h6">Email :</Typography>}
              col={<Typography variant="h6">{data.email}</Typography>}
            />
            <TableItem
              name={<Typography variant="h6">Роль :</Typography>}
              col={
                <Typography variant="h6">
                  {data.role === 3 ? "Администратор" : "Преподаватель"}
                </Typography>
              }
            />
            <TableItem
              name={<Typography variant="h6">Логин :</Typography>}
              col={<Typography variant="h6">{data.login}</Typography>}
            />
            <TableItem
              name={<Typography variant="h6">Пароль :</Typography>}
              col={
                <Button variant="outlined" color="primary" size="small">
                  Изменить
                </Button>
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
