/* eslint-disable react-hooks/exhaustive-deps */
import { Typography, CircularProgress } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import React, { useState } from "react";
import Centered from "../Centered/index";
import useCountDown from "react-countdown-hook";
import { useEffect } from "react";
import CheckIcon from "@material-ui/icons/Check";

const ProgressCircle = ({ size = 150,fontSize=32,maxValue,value }) => {
 
  return (
      <Centered>
        <div style={{ position: "relative", width: size, height: size+15 }}>
          <div style={{ position: "absolute", left: 1, top: 1 }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={size}
              aria-describedby="progress-bg"
              thickness={1}
              style={{ color: "grey" }}
            />
          </div>
          {/* <div
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
          </div> */}
          {/* {timeLeft > 0 ? (
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
          )} */}
        </div>
      </Centered>
  );
};

export default ProgressCircle;
