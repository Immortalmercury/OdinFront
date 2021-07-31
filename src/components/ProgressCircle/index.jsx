/* eslint-disable react-hooks/exhaustive-deps */
import { Typography, CircularProgress } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import React, { useState } from "react";
import Centered from "../Centered/index";
import useCountDown from "react-countdown-hook";
import { useEffect } from "react";
import CheckIcon from "@material-ui/icons/Check";

const ProgressCircle = ({ size = 150, fontSize = 32, maxValue, value }) => {
  
  useEffect(() => {
    
  }, [value]);
 
  return (
      <Centered>
        <div style={{ position: "relative", width: size+2, height: size+15 }}>
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
          <div
            style={{ position: "absolute", left: 0, top: 0, color: "grey" }}
          >
              <CircularProgress
                variant="determinate"
                value={
                  value === 0
                    ? 0
                    : Math.round((value / maxValue) * 100) 
                }
                size={size+2}
                aria-describedby="progress-val"
                thickness={2}
                style={//value > 0 ? { color: "red" } : 
                  { color: "green" }
                }
              />
          </div>
          {value !== maxValue ? (
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
              <Typography variant="h4" style={{ fontSize:fontSize }}>
                {
                  value === 0
                    ? 0
                    : Math.round((value / maxValue) * 100)
                }%
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

export default ProgressCircle;
