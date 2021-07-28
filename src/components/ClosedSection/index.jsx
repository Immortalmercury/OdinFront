/* eslint-disable react-hooks/exhaustive-deps */
import { Typography, CircularProgress } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import React, { useState } from "react";
import Centered from "./../Centered/index";
import useCountDown from "react-countdown-hook";
import { useEffect } from "react"; 
import CheckIcon from "@material-ui/icons/Check";

const ClosedSection = ({ time, onOpen, decoration = null, sectionName }) => {
  const now = new Date();
  // eslint-disable-next-line no-unused-vars
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(60000);
  const [hoursLeft, setHoursLeft] = useState(null);
  const [minutesLeft, setMinutesLeft] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const p100 = 24 * 60 * 60 * 1000;
  const open = () => {
    if (onOpen !== undefined) {
      if (time < new Date()) {
        onOpen();
      }
    }
  }

  useEffect(() => {
    if (time < new Date()) {
      open();
      pause();
    } else {
      start(time - now);
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
      {decoration && (
        <div style={{ position: "absolute", left: 20, top: 20 }}>
          {decoration}
        </div>
      )}
      <Centered>
        {timeLeft > 1000 * 60 * 60 * 24 ? (
          <>
            <Typography variant="h3" style={{ padding: 20 }}>
              {sectionName ? sectionName : "Этот раздел"} откроется
            </Typography>
            <Typography variant="h4">
              {time.toLocaleDateString() + " в " + time.toLocaleTimeString()}
            </Typography>
          </>
        ) : (
          <>
            {timeLeft > 0 ? (
              <Typography variant="h3" style={{ padding: 20 }}>
                {sectionName ? sectionName : "Этот раздел"} откроется через
              </Typography>
            ) : (
              <Typography variant="h3" style={{ padding: 20 }}>
                {"Пожалуйста подождите этот раздел открывается..."}
              </Typography>
            )}
            <div style={{ position: "relative", width: 150, height: 150 }}>
              <div style={{ position: "absolute", left: 1, top: 1 }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={150}
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
                        : Math.round((timeLeft / p100) * 100) + 1
                    }
                    size={152}
                    aria-describedby="timer"
                    thickness={2}
                  />
                ) : (
                  <CircularProgress
                    variant="determinate"
                    value={
                      timeLeft === 0
                        ? 100
                        : Math.round((secondsLeft / 60) * 100) + 1
                    }
                    size={152}
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
                    left: 1,
                    top: 61,
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Typography variant="h4">{hoursLeft}</Typography>
                  <Typography variant="h4" style={{ padding: "0px 2px" }}>
                    :
                  </Typography>
                  <Typography variant="h4">
                    {minutesLeft < 10 && "0"}
                    {minutesLeft}
                  </Typography>
                  <Typography variant="h4" style={{ padding: "0px 2px" }}>
                    :
                  </Typography>
                  <Typography variant="h4">
                    {secondsLeft < 10 && "0"}
                    {secondsLeft}
                  </Typography>
                </div>
              ) : (
                <div
                  style={{
                    position: "absolute",
                    left: 1,
                    top: 31,
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    color: "green",
                    fontSize: "5.5rem",
                  }}
                >
                  <CheckIcon fontSize="inherit" />
                </div>
              )}
            </div>
            {timeLeft > 0 && (
              <Typography variant="h6" style={{ padding: 20 }}>
                {(time.getDay() !== now.getDay() ? "завтра" : "") +
                  " в " +
                  time.getHours() +
                  ":" +
                  (time.getMinutes() < 10 ? "0" : "") +
                  time.getMinutes()}
              </Typography>
            )}
          </>
        )}
      </Centered>
    </Paper>
  );
};

export default ClosedSection;
