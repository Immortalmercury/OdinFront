import { Check, FiberManualRecord } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import Section from "../../../components/Section";
import Centered from "./../../../components/Centered/index";
import { Paper } from '@material-ui/core';
import DateToRusTime from './../../../components/DateToRusTime/index';
import { Typography } from '@material-ui/core';
import SecondsToRusTime from './../../../components/SecondsToRusTime/index';
import RequestButton from './../../../components/Buttons/RequestButton';
import API from "../../../services/API";
import LabResultCard from "../LabResultCard";
import Timer from "../../../components/Timer";

const DisciplineDifferentialCredit = (props) => {
  const [now, setNow] = useState(new Date());
  const [allowedAfter, setAllowedAfter] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(null);
  const [opening, setOpening] = useState(null);
  const [extraTime, setExtraTime] = useState(null);
  // const [opened, setOpened] = useState(null);
  let examForm = 4;
  let debug = true;

  useEffect(() => {
    
  }, [extraTime]);

  return (
    <Section
      setData={(rData) => {
        setData(rData);
        setNow(new Date());
        if (rData.allowed_after !== null) {
          setAllowedAfter(new Date(rData.allowed_after));
        }
        if (rData.deadline !== null) {
          setDeadline(new Date(rData.deadline));
        }
      }}
      update={update}
      setUpdate={setUpdate}
      requestData={{
        method: "get_exam_data",
        discipline: props.match.params.id_discipline,
        examForm: examForm,
      }}
      timerDecoration={
        <span style={{ color: "red" }}>
          <FiberManualRecord style={{ height: 12 }} />
          Экзамен не начался
        </span>
      }
      debug // ! Console log enabled
    >
      {data && (
        <>
          <div style={{ position: "relative" }}>
          {deadline&&now&&((deadline - now) > 0) && (<>
            <span style={{ color: "green", position: "absolute", right: 30, top: 10, width: 132, height: 160, zIndex: 10 }}>
              {!extraTime ? (
                <Timer
                time={(deadline - now)}
                p100={(deadline - allowedAfter)}
                onTimeout={() => {
                  if (extraTime===null) {
                    setExtraTime(true);
                  }
                }}
                size={120}
                  fontSize={25}
                />
              ) : (
                <span style={{ color: "red" }}>
                  <Timer
                    time={(deadline - now)+300000}
                    p100={300000}
                    onTimeout={async (start) => {setUpdate('silent');}}
                    size={120}
                    fontSize={25}
                  />
                </span>
              )}  
              </span>
              <span style={{ position: "absolute", right: 30, top: 150, width: 132, height: 30, zIndex: 10, display: 'flex',justifyContent: 'center',alignItems: 'center', }}>
                <Typography variant="h5">Вариант{" "+data.variant.variant}</Typography>
              </span>
          </>)}
          {data.variant === null && (
              <>
              <Paper
                elevation={3}
                style={{
                  width: "100%",
                  height: 500,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: 20,
                  marginTop: 10,
                  position: "relative",
                }}
              >
            {allowedAfter > now ? (
              <span style={{ color: "green", position: "absolute", left: 20, top: 20 }}>
                <Typography>
                    <FiberManualRecord style={{ height: 12 }} />
                    Экзамен начался{allowedAfter < deadline && <>{'. Окончание '} <DateToRusTime time={deadline} /></>}
                </Typography>
              </span>
            ) : (
              <span style={{ color: "red", position: "absolute", left: 20, top: 20 }}>
                <Typography>
                    <FiberManualRecord style={{ height: 12 }} />
                    Экзамен завершен
                </Typography>
              </span>
            )}
                <Centered>
                  {allowedAfter > now ? (<>
                    <Typography variant="h6" style={{ margin: 10 }}>
                      Экзамен длится:
                      {allowedAfter > deadline ?
                        "Не ограничено"
                        : <SecondsToRusTime
                          time={
                            (deadline -
                              allowedAfter)
                            / 1000}
                        />}
                    </Typography>

                    <Typography variant="h6" style={{ margin: 10 }}>
                      Осталось времени:
                        <SecondsToRusTime time={(allowedAfter - now) / 1000} />
                    </Typography>

                    {opening && (<>
                      <Typography variant="h6" style={{ margin: 10 }}>
                        <span style={{ color: "green", marginRight: 10 }}>
                          <Check />
                        </span>
                      Вариант получен</Typography>
                      <Typography variant="h6" style={{ margin: 10 }}>Загрузка задания ...</Typography>
                    </>)}
                    
                  
                    <RequestButton
                      variant="contained"
                      color="primary"
                      label="Получить вариант и приступить"
                      buttonType="Button"
                      debug={debug}
                      requestData={{
                        method: 'begin_exam',
                        discipline: props.match.params.id_discipline,
                        examForm: examForm,
                      }}
                      onSuccess={async (data) => {
                        setOpening(true);
                        await API.filecall({
                          method: 'get_lab_file',
                          lab: data.id_lab,
                        }, data.file.split('/').pop(), debug)
                      }}
                    />
                  </>) : (
                    <Typography variant="h4" style={{ margin: 10 }}>
                      Не явился(-лась)
                    </Typography>
                  )}
                </Centered>
          </Paper>
            </>
          )}
          {data.variant !== null && (<>
              <LabResultCard
                lab={data.exam}
                filesCaption={(deadline - now) < 0? false:"Билет"}
                deadlineCaption="Экзамен завершается"
                disableTimeMessage={true}
                setUpdate={setUpdate}
                disableUpload={(data.exam&&data.exam.answer && data.exam.answer.mark > 2)||(deadline - now) < 0}
                restrictUpdateAfterDeadline={true}
                style={{ display: 'flex', position: 'relative', padding: "65px 160px 20px 40px" }}
                decoration={<>
                  {(deadline - now) < 0 ? (
                    <span style={{ color: "red", position: "absolute", left: 20, top: 20 }}>
                      <Typography>
                          <FiberManualRecord style={{ height: 12 }} />
                          Экзамен завершен
                      </Typography>
                    </span>
                  ) : (<>
                    <span style={{ color: "green", position: "absolute", left: 20, top: 20 }}>
                      <Typography>
                          <FiberManualRecord style={{ height: 12 }} />
                          Идет экзамен{allowedAfter < deadline && <>{'. Окончание '} <DateToRusTime time={deadline} /></>}
                      </Typography>
                    </span>
                  </>)}
                </>}
              />
            
            </>)}
          </div>
        </>
      )}
    </Section>
  );
};

export default DisciplineDifferentialCredit;
