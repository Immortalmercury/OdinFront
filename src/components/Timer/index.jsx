/* eslint-disable react-hooks/exhaustive-deps */
import { Typography, CircularProgress } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import React, { useState } from "react";
import Centered from "./../Centered/index";
import useCountDown from "react-countdown-hook";
import { useEffect } from "react";
import CheckIcon from "@material-ui/icons/Check";

const Timer = ({ time=60000, onTimeout, size = 150,fontSize=32,p100 }) => {
  const now = new Date();
  const [p100local, setp100local] = useState(p100);
  // eslint-disable-next-line no-unused-vars
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(time);
  const [hoursLeft, setHoursLeft] = useState(null);
  const [minutesLeft, setMinutesLeft] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const open = () => {
    if (onTimeout !== undefined) {
      if (time < 0) {
        onTimeout(start);
      }
    }
  }

  useEffect(() => {
    if (time < 0) {
      open();
      pause();
    } else {
      start(time);
    }
  }, [time]);

  useEffect(() => {
    let tempTime = timeLeft / 1000;
    let tempDaysLeft = Math.floor(tempTime / 60 / 60 / 24);
    let tempHoursLeft = Math.floor(tempTime / 60 / 60) - tempDaysLeft * 24;
    let tempMinutesLeft =
      Math.floor(tempTime / 60) - tempHoursLeft * 60 - tempDaysLeft * 24 * 60;
    let tempSecondsLeft =
      Math.floor(tempTime) -
      (tempHoursLeft * 60 + tempDaysLeft * 24 * 60 + tempMinutesLeft) * 60;
    setHoursLeft(tempHoursLeft);
    setMinutesLeft(tempMinutesLeft);
    setSecondsLeft(tempSecondsLeft);
    if (timeLeft < 1) {
      open()
    }
    return () => {
      setHoursLeft(null);
      setMinutesLeft(null);
      setSecondsLeft(null);
    };
  }, [timeLeft]);

  return (
      <Centered>
        <div style={{ position: "relative", width: size, height: size+15 }}>
          <div style={{ position: "absolute", left: 1, top: 1 }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={size}
              aria-describedby="timerbg"
              thickness={1}
              style={{ color: "grey" }}
            />
          </div>
          <div
            style={{ position: "absolute", left: 0, top: 0, color: "grey" }}
          >
            {timeLeft > 60000 ? (
              <CircularProgress
                variant="determinate"
                value={
                  timeLeft === 0
                    ? 100
                    : Math.round((timeLeft / p100local) * 100) + 1
                }
                size={size+2}
                aria-describedby="timer"
                thickness={2}
            />
            ) : (
              <CircularProgress
                variant={timeLeft === 0 ? 'indeterminate' : "determinate"}
                value={
                  timeLeft === 0
                    ? 100
                    : Math.round((secondsLeft / 60) * 100) + 1
                }
                size={size+2}
                aria-describedby="timer"
                thickness={2}
                style={timeLeft > 0 ? { color: "red" } : { color: "green" }}
              />
            )}
          </div>
          {timeLeft > 0 ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
              display: "flex",
                flexDirection:'column',
                justifyContent: "center",
                alignItems: 'center',
                width: size,
                height: size+2,
              }}
            ><div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: 'center',
            }}>
            {hoursLeft > 0 && (<>
              <Typography variant="h4" style={{ fontSize:fontSize }}>{hoursLeft}</Typography>
              <Typography variant="h4" style={{ padding: "0px 2px", fontSize:fontSize }}>
                :
              </Typography>
            </>)}
              <Typography variant="h4" style={{ fontSize:fontSize }}>
                {minutesLeft < 10 && "0"}
                {minutesLeft}
              </Typography>
              <Typography variant="h4" style={{ padding: "0px 2px", fontSize:fontSize }}>
                :
              </Typography>
              <Typography variant="h4" style={{ fontSize:fontSize }}>
                {secondsLeft < 10 && "0"}
                {secondsLeft}
              </Typography>
              </div>
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                left: 1,
                top: Math.floor((size-fontSize)/4),
                display: "flex",
                justifyContent: "center",
                width: "100%",
                color: "green",
                fontSize: Math.floor((size-Math.floor((size-fontSize)/4)*2)),
              }}
            >
              <CheckIcon fontSize="inherit" />
            </div>
          )}
        </div>
      </Centered>
  );
};

export default Timer;
