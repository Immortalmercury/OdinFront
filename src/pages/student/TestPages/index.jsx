import React, { useState } from "react";
import useStyles from "./styles";
import { Helmet } from "react-helmet";
import { withRouter } from 'react-router-dom';
import Section from "../../../components/Section";
import PageTitle from "../../../components/PageTitle";
import {Button, Paper, Typography} from "@material-ui/core";
import SecondsToRusTime from "../../../components/SecondsToRusTime";
import Centered from "../../../components/Centered";
import {Check, FiberManualRecord} from "@material-ui/icons";
import RequestV2Button from "../../../components/Buttons/RequestV2Button";
import { useLocation } from 'react-router-dom'

const TestPage = (props) => {
  // component default variables
  const classes = useStyles();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(null);
  const id_discipline = props.match.params.id_discipline;
  const test_id = props.match.params.test_id;
  const route = "discipline/" + id_discipline + '/test/' + test_id;
  const newAttemptAPIRoute = 'test/'+test_id+'/attempt';
  const newAttemptPageRoute = location.pathname+'/attempt/';
  
  // component specified variables
  // Snippets:
  const [attemptsData, setAttemptsData] = useState(null);
  const [attemptLoaded, setAttemptLoaded] = useState(true);
  const [newAttemptData, setNewAttemptData] = useState(null);
  
  // uef
  
  return(
    <>
      <Helmet title={data && data.description}/>
      <PageTitle title={data && data.name}/>
      <Section update={update} setUpdate={setUpdate} setData={setData}
          request={{route}}
          noDataAllowed
          debug
      >
        {data!==null && (<>
          { (data?.unavailableReason !== "TEST_PASSED" && data?.result) ? (<>
            <Paper elevation={3} className={classes.rootPaper} style={{height:200}}>
              <span style={{ color: (data.result.success ? "green":"red"), position: "absolute", left: 20, top: 20 }}>
                <Typography>
                    <FiberManualRecord style={{ height: 12 }} />
                    Промежуточный результат
                </Typography>
              </span>
              <Centered>
                <Typography variant={'h6'} style={{paddingBottom:10}}>
                  { (data.result?.status === 'completed') ? (<>
                  <span style={{color:'green'}}>Тест пройден</span>
                </>):(<>
                  <span style={{color:'red'}}>Тест не пройден</span>
                </>)}
                </Typography>
                <Typography variant={"h5"}>Ваш результат: {data?.result.progress}%</Typography>
                { (data.result?.fail_reason === 'wrong_answers') && (<>
                  <Typography style={{paddingBottom:10}}>
                    Вы не набрали необходимое количество правильных ответов или не ответили на один из обязательных вопросов.
                  </Typography>
                </>)}
                { (data.result?.fail_reason === 'violation') && (<>
                  <Typography style={{paddingBottom:10}}>
                    Были зафиксированы нарушения при прохождении теста, тест досрочно завершен.
                  </Typography>
                </>)}
              </Centered>
            </Paper>
          </>):null}
          <Paper elevation={3} className={classes.rootPaper}>
            { (!data?.available) ? (<>
              { (data?.unavailableReason === "TEST_PASSED") ? (<>
                <span style={{ color: "green", position: "absolute", left: 20, top: 20 }}>
                  <Typography>
                      <FiberManualRecord style={{ height: 12 }} />
                      Тест пройден
                  </Typography>
                </span>
              </>):(<>
                <span style={{ color: "red", position: "absolute", left: 20, top: 20 }}>
                  <Typography>
                      <FiberManualRecord style={{ height: 12 }} />
                      Тест недоступен
                  </Typography>
                </span>
              </>)}
            </>):(<>
              <span style={{ color: "green", position: "absolute", left: 20, top: 20 }}>
                <Typography>
                    <FiberManualRecord style={{ height: 12 }} />
                    Тест доступен. { (data.max_attempts > 0) ? (<>
                  Осталось попыток: {data?.attemptsLeft} из {data.max_attempts}
                  { (data.additionalAttempts) ? (<>. Дополнительных: {data.additionalAttempts}</>):null}
                </>):(<> Количество попыток не ограничено </>)}
                </Typography>
              </span>
            </>)}
            
            <Centered>
              { (!data?.available && data?.unavailableReason === 'EDU_NOT_ALLOWS') && (<>
                <Typography>Чтобы открыть доступ к тесту, </Typography>
                <Typography>завершите предыдущие пункты программы обучения</Typography>
              </>)}
              { (!data?.available && data?.unavailableReason === 'NO_MORE_ATTEMPTS') && (<>
                <Typography variant={"h6"}>У вас закончились попытки.</Typography>
                <Typography>Сейчас вы не можете приступить к тесту.</Typography>
                <Typography>Запросите две дополнительные попытки и вернитесь к выполнению теста позже.</Typography>
                <Typography style={{ marginTop: 20 }}>О выдаче дополнительных попыток вы будете уведомлены по E-mail.</Typography>
                <Button
                  variant={"contained"}
                  color={"primary"}
                  // onClick={()=>{props.history.push(location.pathname.split('/test')[0]+'/edu')}}
                  onClick={()=>{props.history.goBack()}}
                >
                  Запросить дополнительные попытки
                </Button>
              </>)}
              { (!data?.available && data?.unavailableReason === 'TEST_PASSED') && (<>
                <Typography variant={"h4"}>Тест завершен</Typography>
                <Typography variant={"h5"}>Ваш результат: {data?.result.progress}%</Typography>
              </>)}
              { (!data?.available) && (<>
                <Button
                  variant={"contained"}
                  color={"primary"}
                  className={classes.beginTestButton}
                  // onClick={()=>{props.history.push(location.pathname.split('/test')[0]+'/edu')}}
                  onClick={()=>{props.history.goBack()}}
                >
                  Назад
                </Button>
              </>)}
              { (data?.available) && (<>
                <Typography variant="h4" className={classes.paperTitle}>
                  {(data.parameters.test_type === 'selfControl') ? "Тест для самоконтроля":"Тест на оценку"}
                </Typography>
                {(data.time) && (<>
                  <Typography variant="h6">Тест рассчитан на ~ <SecondsToRusTime time={data.time}/></Typography>
                </>)}
                {(data.pass_weight) && (<>
                  <Typography variant="h6">Для успешной сдачи необходимо ответить на {data.pass_weight}% вопросов</Typography>
                </>)}
                {newAttemptData !== null ? (<>
                  <Typography variant="h6" style={{ marginTop: 30 }}>
                    <span style={{ color: "green", marginRight: 10, paddingTop: 5 }}>
                      <Check style={{marginTop:5}}/>
                    </span>
                    Вариант получен
                  </Typography>
                  <Typography variant="h6" style={{ margin: 3 }}>
                    Попытка номер {newAttemptData?.number}
                  </Typography>
                  <Typography variant="h6" style={{ margin: 3 }}>
                    Всего вопросов: {newAttemptData?.questionsCount}
                  </Typography>
                  { (newAttemptData?.time !== null) && (<>
                    <Typography variant="h6" style={{ margin: 3 }}>
                      Точное время: <SecondsToRusTime time={newAttemptData.time}/>
                    </Typography>
                  </>)}
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    className={classes.beginTestButton}
                    onClick={()=>{
                      if (newAttemptData?.id)
                      {
                        let id = newAttemptData?.id;
                        setNewAttemptData(null);
                        props.history.push(newAttemptPageRoute+id);
                      }
                    }}
                  >
                    Начать
                  </Button>
                </>):(<>
                  <RequestV2Button
                    variant="contained"
                    color="primary"
                    label="Получить вариант и приступить"
                    buttonType="Button"
                    debug
                    className={classes.beginTestButton}
                    request={{
                      method: 'POST',
                      route: newAttemptAPIRoute,
                    }}
                    onSuccess={(data) => {
                      setNewAttemptData(data);
                    }}
                  />
                </>)}
              </>)}
            </Centered>
          </Paper>
          <Section setData={setAttemptsData}
              request={{route:"test/"+test_id+"/attempt"}}
              noDataAllowed
              debug
          >
            {console.log({data:attemptsData})}
            {/*{attemptsData && attemptsData.map(el => {
              return(<>
              
              </>);
            })}*/}
          </Section>
        </>)}
      </Section>
    </>
  );
}

export default withRouter(TestPage);