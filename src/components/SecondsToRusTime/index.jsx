import React from 'react';

const SecondsToRusTime = ({time}) => {
  var daysLeft = null;
  var hoursLeft = null;
  var minutesLeft = null;

  return (<>
    {(daysLeft = Math.floor(time / 60 / 60 / 24)) >0 && daysLeft}
    {(daysLeft>5 && daysLeft<20) || daysLeft%10 > 4 || (daysLeft%10 === 0 && daysLeft>=20) ? ' дней ' :
      daysLeft%10 > 1 ? ' дня ' :
        daysLeft%10 > 0 && ' день '}
    {(hoursLeft = Math.floor(time / 60 / 60) - (daysLeft * 24)) >0 && hoursLeft}
    {hoursLeft > 21 ? ' часа ' :
      hoursLeft > 20 ? ' час ' :
        hoursLeft > 4 ? ' часов ' :
        hoursLeft > 1 ? ' часа ' :
            hoursLeft > 0 && ' час '}
    {(minutesLeft = Math.floor(time / 60) - (hoursLeft * 60) - (daysLeft * 24 * 60)) >0 && minutesLeft}
    {(minutesLeft>5 && minutesLeft<20) || minutesLeft%10 > 4 || (minutesLeft%10 === 0 && minutesLeft>=20) ? ' минут' :
      minutesLeft%10 > 1 ? ' минуты' :
        minutesLeft % 10 > 0 && ' минуту'}
  </>);
}

export default SecondsToRusTime;
