import React, {useEffect, useState} from "react";
import useStyles from "../styles";
import { Helmet } from "react-helmet";
import {useLocation, withRouter} from 'react-router-dom';
import Section from "../../../../components/Section";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Paper,
  Radio,
  RadioGroup,
  Typography
} from "@material-ui/core";
import Centered from "../../../../components/Centered";
import RequestV2Button from "../../../../components/Buttons/RequestV2Button";
import DateToRusTime from "../../../../components/DateToRusTime";
import SecondsToRusTime from "../../../../components/SecondsToRusTime";

const AttemptProgressPage = (props) => {
  // component default variables
  const classes = useStyles();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(null);
  const test_id = props.match.params.test_id;
  const attempt_id = props.match.params.attempt_id;
  const route = 'test/'+test_id+'/attempt/'+attempt_id+'/question';
  const resultRoute = 'test/'+test_id+'/attempt/'+attempt_id;
  
  const [answer, setAnswer] = useState([]);
  const [answerUpdate, setAnswerUpdate] = useState(true);
  
  const [attemptState, setAttemptState] = useState('progress');
  
  // component specified variables
/*  function escFunction(event){
    if(event.keyCode === 27 || event.keyCode === 122) {
      event.preventDefault();
      var keyCode = event.keyCode || event.which;
  
      //your keyCode contains the key code, F1 to F12
      //is among 112 and 123. Just it.
      console.log(keyCode);
    }
  }
  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return(()=>{
      document.removeEventListener("keydown", escFunction, false);
    })
  }, []);*/
  
  function continueTest(newData) {
    setAnswer([]);
    if (newData !== 'NO_MORE_QUESTIONS'){
      setData(newData);
    } else {
      setData(null);
      setAttemptState('result');
      setUpdate('refresh');
    }
    
  }
  
  function toggleAnswer(value) {
    let temp = [];
    if (Array.isArray(answer))
      temp = answer;
    const index = temp.indexOf(value);
    if (index !== -1){
      temp.splice(index, 1);
    }else{
      temp.push(value);
    }
    setAnswer(temp);
    setAnswerUpdate(false);
  }
  
  const CheckBoxes = () => {
    useEffect(() => {
      setAnswerUpdate(true);
    }, []);
    return(<>
      <FormControl component="fieldset">
        <FormGroup>
          { answerUpdate && data !== null && Object.entries(data?.answers).map((el)=> {
            const key = el[0];
            const val = el[1].text;
            return (
              <FormControlLabel
                control={<Checkbox
                  checked={answer.indexOf(key) !== -1}
                  onChange={()=>toggleAnswer(key)}
                />}
                label={<div dangerouslySetInnerHTML={{__html: val}}/>}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    </>);
  }
  
  if (attemptState === 'progress')
    return(
      <>
        {/*<ReactFullscreen>
          {({ ref, onRequest, onExit }) => {
            // onRequest();
            return (
              <div
                ref={ref}
                onKeyPress={escFunction}
                style={{ backgroundColor: 'red', width: 120, height: 120 }}
              >
                <button onClick={() => onRequest()}>FullScreen</button>
                <button onClick={() => onExit()}>Screen</button>
              </div>
            )}
          }}
        </ReactFullscreen>*/}
        <Helmet title={"Выполнение теста"}/>
        <div style={{
          position: 'absolute',
          left:0,
          top: 0,
          width: '100vw',
          minHeight: '100vh',
          background: '#F6F7FF',
          zIndex: 5000,
        }}>
          <Centered style={{minHeight:'100vh'}}>
            <Section update={update} setUpdate={setUpdate} setData={setData}
              request={{route}}
              noDataAllowed
              debug
              onError={(response)=>{
                console.log({data:response});
                if (response.data.status === 405)
                setAttemptState('result');
              }}
            >
              <Typography variant={'h4'} style={{padding:20,width: 700}}>Вопрос {data?.number}</Typography>
              <Paper elevation={6} style={{minHeight: 350, width: 700, padding:20, position:"relative", paddingBottom: 70}}>
                {/*<Typography variant={'h6'} >{data?.text}</Typography>*/}
                {/*<div style={{display:'flex', flexDirection:'column'}}>*/}
                  <div dangerouslySetInnerHTML={{__html: data?.text}} style={{marginBottom:20, fontSize:'large'}}/>
                  { data?.required ? (<>
                    <Typography variant={'h6'} style={{color:'#CC3300', marginBottom:20}}>
                      Внимание! На этот вопрос нужно обязательно дать правильный ответ
                    </Typography>
                  </>):null}
    
                  <Typography variant={'h6'} >
                    Ваш ответ:
                  </Typography>
                  { (data?.id_type === 1) && (<>
                    <RadioGroup value={answer} onChange={(e)=> {setAnswer(e.target.value);}}>
                      { data && Object.entries(data?.answers).map((el)=> {
                        const key = el[0];
                        const val = el[1].text;
                        return (
                          <FormControlLabel
                            value={key}
                            control={<Radio color={"primary"}/>}
                            label={<div dangerouslySetInnerHTML={{__html: val}}/>}
                          />
                        );
                      })}
                    </RadioGroup>
                  </>)}
                { (data?.id_type === 2) && (<>
                  <CheckBoxes/>
                </>)}
                <div style={{position:'absolute',bottom:0,left:0,width:'100%', padding: '0 10px', height:70,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <RequestV2Button
                    color={"primary"}
                    variant={"outlined"}
                    label={"Пропустить вопрос"}
                    successLabel={"Пропустить вопрос"}
                    request={{method:'PUT',route,data: {answer:[]}}}
                    onSuccess={continueTest}
                  />
                  <RequestV2Button
                    color={"primary"}
                    variant={"contained"}
                    label={"Продолжить"}
                    successLabel={"Продолжить"}
                    disabled={answer === null || answer === []}
                    request={{method:'PUT',route,data: {answer}}}
                    onSuccess={continueTest}
                  />
                </div>
                {/*</div>*/}
              </Paper>
            </Section>
          </Centered>
        </div>
      </>
    );
  
  if (attemptState === 'result')
    return(<>
      <Helmet title={"Результат попытки"}/>
      <div style={{
        position: 'absolute',
        left:0,
        top: 0,
        width: '100vw',
        minHeight: '100vh',
        background: '#F6F7FF',
        zIndex: 5000,
      }}>
        <Centered style={{minHeight:'100vh'}}>
        <Typography variant={'h4'} style={{padding:20,width: 700}}>Результат попытки</Typography>
        <Paper elevation={6} style={{minHeight: 350, width: 700, padding:20, position:"relative"}}>
          <Section update={update} setUpdate={setUpdate} setData={setData}
             request={{route:resultRoute}}
             noDataAllowed
             debug
          >
            { (data !== null) && (<>
            <Centered style={{minHeight:'350px'}}>
              <Typography variant={'h6'} style={{paddingBottom:20}}>Попытка {data?.attempt_number}</Typography>
              <Typography variant={'h6'} style={{paddingBottom:10}}>Начало: <DateToRusTime time={data?.created_at}/></Typography>
              <Typography variant={'h6'} style={{paddingBottom:10}}>
                Затрачено времени: &nbsp;
                <SecondsToRusTime
                  time={(new Date(data?.completed_at) - new Date(data?.created_at))/1000}
                />
              </Typography>
              <Typography variant={'h6'} style={{paddingBottom:10}}>
                Правильных ответов: {data?.progress}%
              </Typography>
              <Typography variant={'h6'} style={{paddingBottom:10}}>
                Итог: { (data?.status === 'completed') ? (<>
                    <span style={{color:'green'}}>тест пройден</span>
                </>):(<>
                  <span style={{color:'red'}}>тест не пройден</span>
                </>)}
              </Typography>
              { (data?.fail_reason === 'wrong_answers') && (<>
                <Typography style={{paddingBottom:10}}>
                  Вы не набрали необходимое количество правильных ответов или не ответили на один из обязательных вопросов.
                </Typography>
              </>)}
              { (data?.fail_reason === 'violation') && (<>
                <Typography style={{paddingBottom:10}}>
                  Были зафиксированы нарушения при прохождении теста, тест досрочно завершен. Вернитесь назад и повторите попытку.
                </Typography>
              </>)}
              <Button
                variant={"contained"}
                color={"primary"}
                className={classes.beginTestButton}
                onClick={()=>{
                  // props.history.push(location.pathname.split('/attempt')[0]);
                  props.history.goBack();
                }}
              >
                Выход
              </Button>
            </Centered>
            </>)}
          </Section>
        </Paper>
      </Centered>
    </div>
    </>);
}

export default withRouter(AttemptProgressPage);