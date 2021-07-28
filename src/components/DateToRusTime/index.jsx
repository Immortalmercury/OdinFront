import React from "react";

const monthA = " января , февраля , марта , апреля , мая , июня , июля , августа , сентября , октября , ноября , декабря ".split(
  ",",
);
const DateToRusTime = ({ time }) => {
  let date = new Date(time);

  return (
    <>
      {time
        && date.getDate() +
          monthA[date.getMonth()] +
          date.getFullYear() +
          " в " +
          date.getHours() +
          ":" +
          (date.getMinutes() < 10 ? "0":'') +
          date.getMinutes()
        }
    </>
  );
};

export default DateToRusTime;
