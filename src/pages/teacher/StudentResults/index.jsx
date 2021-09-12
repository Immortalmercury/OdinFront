import {
  Button, Grid, IconButton,
} from "@material-ui/core";
import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import useStyles from "./styles";
// import SettingsIcon from "@material-ui/icons/Settings";
import {useLocation, withRouter} from "react-router-dom";
import Section from "../../../components/Section";
import Header from "../../../components/Header/Header";
import MuiTable from "../../../components/MuiTable";
import Centered from "../../../components/Centered";
import {Close} from "@material-ui/icons";
import SecondsToRusTime from "../../../components/SecondsToRusTime";
import DateToRusTime from "../../../components/DateToRusTime";

const StudentResults = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(null);
  const [userData, setUserData] = useState(null);
  
  const id_course = props.match.params.id_course;
  const user_id = props.match.params.user_id;
  const route = '/course/'+id_course+'/user/'+user_id;
  const [printData, setPrintData] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  
  return (
    <>
      <Section request={{route: '/user/' + user_id}} setData={setUserData}>
        <Header history={props.history} title={!data ? 'Загрузка' : "Результаты студента: "+userData?.s_name+" "+userData?.f_name+""} />
      </Section>
      <Section requestData={{method: 'get_user_profile_data'}} setData={setCurrentUserData}></Section>
      <Section
        request={{route}}
        setData={setData}
        update={update}
        setUpdate={setUpdate}
        debug
        noDataAllowed
      >
        <MuiTable
          className={classes.tableToolbarRoot}
          title={
            <div disableTypography className={classes.modalTitle}>
              <Typography variant="h6">
                {"Список результатов студента"}
              </Typography>
            </div>
          }
          style={{display:((printData === null) ? "block":"none")}}
          viewColumns={false}
          search={true}
          columns={["Дисциплина","Тест","Результат","Номер попытки","Версия для печати"]}
          noMatch={"Студент не сдал ни одного теста"}
          data={
            !data
              ? []
              : (() => {
                let newData = [];
                data.forEach(el => {
                  newData.push([
                    el.description,
                    el.name,
                    el.progress,
                    el.attempt_number,
                    <Button
                      onClick={() => {setPrintData(el)}}
                      variant={"outlined"}
                      color={"primary"}
                    >Открыть</Button>
                  ]);
                });
  
                return newData;
              })()
          }
        />
      </Section>
      { (printData !== null) && (<>
        <div style={{
          position: 'absolute',
          left:0,
          top: 0,
          width: '100vw',
          minHeight: '100vh',
          background: '#F6F7FF',
          zIndex: 5000,
        }}>
          
          <Centered>
            <div style={{width:600,position:'relative', minHeight:'100vh'}}>
              <div
                style={{position:'absolute',right:30, top: 30 ,width:40,height:40,borderRadius:'50%',backgroundColor: '#9C27B0', color: '#F6F7FF',cursor:'pointer'}}
                onClick={()=>{setPrintData(null);}}
              ><Centered>
                <Close/>
              </Centered>
              </div>
              <Typography variant={"h3"} style={{marginTop:10,marginBottom:30}}>Результаты выполнения теста</Typography>
              <Grid container spacing={3}>
                <Grid item xs={3}><Typography variant={"body1"} style={{marginTop:10}}
                >Студент</Typography></Grid>
                <Grid item xs={9}><Typography variant={"body1"} style={{marginTop:10}}
                >{userData?.s_name} {userData?.f_name} {userData?.fth_name} (#{userData?.id_user})</Typography></Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={3}><Typography variant={"body1"} style={{marginTop:10}}
                >Дисциплина</Typography></Grid>
                <Grid item xs={9}><Typography variant={"body1"} style={{marginTop:10}}
                >{printData.description} (#{printData?.id_discipline})</Typography></Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={3}><Typography variant={"body1"} style={{marginTop:10}}
                >Тест</Typography></Grid>
                <Grid item xs={9}><Typography variant={"body1"} style={{marginTop:10}}
                >{printData.name} (#{printData?.id_test})</Typography></Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={3}><Typography variant={"body1"} style={{marginTop:30}}
                >Номер попытки</Typography></Grid>
                <Grid item xs={9}><Typography variant={"body1"} style={{marginTop:30}}
                >{printData.attempt_number} (#{printData?.id_attempt})</Typography></Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={3}><Typography variant={"body1"} style={{marginTop:10}}
                >Результат</Typography></Grid>
                <Grid item xs={9}><Typography variant={"body1"} style={{marginTop:10}}
                >{printData.progress}% правильных ответов</Typography></Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={3}><Typography variant={"body1"} style={{marginTop:10}}
                >Всего вопросов</Typography></Grid>
                <Grid item xs={9}><Typography variant={"body1"} style={{marginTop:10}}
                >{printData.questionsCount}</Typography></Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={3}><Typography variant={"body1"} style={{marginTop:10}}
                >Тест пройден </Typography></Grid>
                <Grid item xs={9}><Typography variant={"body1"} style={{marginTop:10}}
                >за <SecondsToRusTime
                  time={(new Date(printData?.completed_at) - new Date(printData?.created_at))/1000}
                /></Typography></Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={3}><Typography variant={"body1"} style={{marginTop:10}}
                >Время начала </Typography></Grid>
                <Grid item xs={9}><Typography variant={"body1"} style={{marginTop:10}}
                >{new Date(printData?.created_at).toLocaleString()}</Typography></Grid>
              </Grid>
              
              <div style={{marginTop:130, marginRight:10,display:'flex',justifyContent:'space-between'}}>
                <Typography variant={"body1"}
                >___.___.______</Typography>
                <Typography variant={"body1"}
                >____________________/___________________/</Typography>
              </div>
              <div style={{marginRight:65,display:'flex',justifyContent:'flex-end'}}>
                <span style={{marginRight:260}}>(Дата)</span>
               <span style={{marginRight:85}}>(Подпись)</span>(Ф.И.О.)
              </div>
              <Grid container spacing={3}>
                <Grid item xs={3}><Typography variant={"body1"} style={{marginTop:20}}
                > </Typography></Grid>
                <Grid item xs={9}><Typography variant={"body1"} style={{marginTop:20}}
                >{''}</Typography></Grid>
              </Grid>
              <div style={{marginTop:100, padding:10, color: '#DADCE0', borderTop:'2px solid #DADCE0',borderBottom:'1px' +
                  ' solid #DADCE0'}}>
                Ответ сгенерирован автоматически системой "СДО АУЦ ФПЛС", доступной по адресу https://edu.aucfpls.ru/.
                Пользователь - {currentUserData?.s_name} {currentUserData?.f_name} {currentUserData?.fth_name} (#{currentUserData?.id_user}).<br/>
                Дата и время - {new Date().toLocaleString()}.
              </div>
            </div>
          </Centered>
        </div>
      </>)}
    </>
  );
};

export default withRouter(StudentResults);
