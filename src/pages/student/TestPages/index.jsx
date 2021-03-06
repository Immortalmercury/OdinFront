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
                    ?????????????????????????? ??????????????????
                </Typography>
              </span>
              <Centered>
                <Typography variant={'h6'} style={{paddingBottom:10}}>
                  { (data.result?.status === 'completed') ? (<>
                  <span style={{color:'green'}}>???????? ??????????????</span>
                </>):(<>
                  <span style={{color:'red'}}>???????? ???? ??????????????</span>
                </>)}
                </Typography>
                <Typography variant={"h5"}>?????? ??????????????????: {data?.result.progress}%</Typography>
                { (data.result?.fail_reason === 'wrong_answers') && (<>
                  <Typography style={{paddingBottom:10}}>
                    ???? ???? ?????????????? ?????????????????????? ???????????????????? ???????????????????? ?????????????? ?????? ???? ???????????????? ???? ???????? ???? ???????????????????????? ????????????????.
                  </Typography>
                </>)}
                { (data.result?.fail_reason === 'violation') && (<>
                  <Typography style={{paddingBottom:10}}>
                    ???????? ?????????????????????????? ?????????????????? ?????? ?????????????????????? ??????????, ???????? ???????????????? ????????????????.
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
                      ???????? ??????????????
                  </Typography>
                </span>
              </>):(<>
                <span style={{ color: "red", position: "absolute", left: 20, top: 20 }}>
                  <Typography>
                      <FiberManualRecord style={{ height: 12 }} />
                      ???????? ????????????????????
                  </Typography>
                </span>
              </>)}
            </>):(<>
              <span style={{ color: "green", position: "absolute", left: 20, top: 20 }}>
                <Typography>
                    <FiberManualRecord style={{ height: 12 }} />
                    ???????? ????????????????. { (data.max_attempts > 0) ? (<>
                  ???????????????? ??????????????: {data?.attemptsLeft} ???? {data.max_attempts}
                  { (data.additionalAttempts) ? (<>. ????????????????????????????: {data.additionalAttempts}</>):null}
                </>):(<> ???????????????????? ?????????????? ???? ???????????????????? </>)}
                </Typography>
              </span>
            </>)}
            
            <Centered>
              { (!data?.available && data?.unavailableReason === 'EDU_NOT_ALLOWS') && (<>
                <Typography>?????????? ?????????????? ???????????? ?? ??????????, </Typography>
                <Typography>?????????????????? ???????????????????? ???????????? ?????????????????? ????????????????</Typography>
              </>)}
              { (!data?.available && data?.unavailableReason === 'NO_MORE_ATTEMPTS') && (<>
                <Typography variant={"h6"}>?? ?????? ?????????????????????? ??????????????.</Typography>
                <Typography>???????????? ???? ???? ???????????? ???????????????????? ?? ??????????.</Typography>
                <Typography>?????????????????? ?????? ???????????????????????????? ?????????????? ?? ?????????????????? ?? ???????????????????? ?????????? ??????????.</Typography>
                <Typography style={{ marginTop: 20 }}>?? ???????????? ???????????????????????????? ?????????????? ???? ???????????? ???????????????????? ???? E-mail.</Typography>
                <Button
                  variant={"contained"}
                  color={"primary"}
                  // onClick={()=>{props.history.push(location.pathname.split('/test')[0]+'/edu')}}
                  onClick={()=>{props.history.goBack()}}
                >
                  ?????????????????? ???????????????????????????? ??????????????
                </Button>
              </>)}
              { (!data?.available && data?.unavailableReason === 'TEST_PASSED') && (<>
                <Typography variant={"h4"}>???????? ????????????????</Typography>
                <Typography variant={"h5"}>?????? ??????????????????: {data?.result.progress}%</Typography>
              </>)}
              { (!data?.available) && (<>
                <Button
                  variant={"contained"}
                  color={"primary"}
                  className={classes.beginTestButton}
                  // onClick={()=>{props.history.push(location.pathname.split('/test')[0]+'/edu')}}
                  onClick={()=>{props.history.goBack()}}
                >
                  ??????????
                </Button>
              </>)}
              { (data?.available) && (<>
                <Typography variant="h4" className={classes.paperTitle}>
                  {(data.parameters.test_type === 'selfControl') ? "???????? ?????? ????????????????????????":"???????? ???? ????????????"}
                </Typography>
                {(data.time) && (<>
                  <Typography variant="h6">???????? ?????????????????? ???? ~ <SecondsToRusTime time={data.time}/></Typography>
                </>)}
                {(data.pass_weight) && (<>
                  <Typography variant="h6">?????? ???????????????? ?????????? ???????????????????? ???????????????? ???? {data.pass_weight}% ????????????????</Typography>
                </>)}
                {newAttemptData !== null ? (<>
                  <Typography variant="h6" style={{ marginTop: 30 }}>
                    <span style={{ color: "green", marginRight: 10, paddingTop: 5 }}>
                      <Check style={{marginTop:5}}/>
                    </span>
                    ?????????????? ??????????????
                  </Typography>
                  <Typography variant="h6" style={{ margin: 3 }}>
                    ?????????????? ?????????? {newAttemptData?.number}
                  </Typography>
                  <Typography variant="h6" style={{ margin: 3 }}>
                    ?????????? ????????????????: {newAttemptData?.questionsCount}
                  </Typography>
                  { (newAttemptData?.time !== null) && (<>
                    <Typography variant="h6" style={{ margin: 3 }}>
                      ???????????? ??????????: <SecondsToRusTime time={newAttemptData.time}/>
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
                    ????????????
                  </Button>
                </>):(<>
                  <RequestV2Button
                    variant="contained"
                    color="primary"
                    label="???????????????? ?????????????? ?? ????????????????????"
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