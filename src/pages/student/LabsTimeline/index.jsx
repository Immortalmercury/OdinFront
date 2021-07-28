import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import API from '../../../services/API';
import PageTitle from '../../../components/PageTitle';
import LoadingPage from '../../../components/Loading';
 import LabsTimelineItem from './LabsTimelineItem';
import { Badge } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
  oppositeContent: {
    // border: "1px solid black",
    padding: 0,
    flex: 0,
  },
  B2: {
    backgroundColor: "red",
  },
  B3: {
    backgroundColor: "orange",
  },
  B4: {
    backgroundColor: "blue",
  },
  B5: {
    backgroundColor: "green",
  },
  
}));

const monthA = 'Января,Февраля,Марта,Апреля,Мая,Июня,Июля,Августа,Сентября,Октября,Ноября,Декабря'.split(',');
// const Statuses = 'Ожидает проверки,Оценено,Ответ ожидает проверки'.split(','); 
const convertData = (data,classes) => {
  let newData = [];
  for (let index = 0; index < data.length; index++) {
    const el = data[index];
    // ответа нет
    var answer = null;
    // Лаба не проверяется
    var is_checking = false;
    // точка серая
    var dotColor = 'default';
    // Дедлайнов нет
    var deadline = null;
    // Определение дедлайнов
    if (el.deadline !== null) {
      let deadlineDateObject = new Date(el.deadline);
      let totalSeconds = Math.round((deadlineDateObject - new Date()) / 1000);
      // let timeLeftAbs = Math.abs(totalSeconds);
      // var daysLeft = Math.floor(timeLeftAbs / 60 / 60 / 24);
      // var hoursLeft = Math.floor(timeLeftAbs / 60 / 60) - (daysLeft * 24);
      // var minutesLeft = Math.floor(timeLeftAbs / 60) - (hoursLeft * 60) - (daysLeft * 24 * 60);
      deadline = {
        datetime: deadlineDateObject,
        date: deadlineDateObject.getDate() + ' ' +
          monthA[deadlineDateObject.getMonth()] + ' ' +
          deadlineDateObject.getFullYear() + ' ' +
          deadlineDateObject.getHours() + ':' +
          deadlineDateObject.getMinutes(),
        day: deadlineDateObject.getDate(),
        month: monthA[deadlineDateObject.getMonth()],
        year: deadlineDateObject.getFullYear(),
        time: deadlineDateObject.getHours() + ':' + deadlineDateObject.getMinutes(),
        timeLeft: totalSeconds
          
      };
    }

    // Проверим ответ, если лаба оценена >2 ее выводить не надо, иначе работаем
    if (el.answer !== null) {
      // Значит есть ответ, надо проверить оценку, если двойка или не проверено, тогда выводим (не проверено тоже выводим? с Флагом!)
      // Сначала проверим статус
      let mark = null;
      // и предположим что заба залита и проверяется
      is_checking = true;
      if (el.answer.status === 2) {
        // Значит проверено => ченем оценку
        if (el.answer.mark > 2) {
          // По сути если оценка не 2
          // Тогда эту лабу отображать не надо
          continue;
        } else {
          // Иначе выведем что по лабе двойка
          mark = <Badge badgeContent={2} color="primary" classes={{ colorPrimary: classes.B2 }} />
          // а еще лаба уже не проверяется
          is_checking = false;
        }
      }
      // let completeDate = ;
      // let totalSeconds = ;
      // в остальных случая выводим
      answer = {
        mark,
        is_checking,
        completeDate: Math.floor((new Date(el.answer.complete_date)) / 1000),
        intervalBetweenDeadlineNComplete: Math.floor((deadline.datetime - new Date(el.answer.complete_date)) / 1000),
      };
      
    }

    // Но еще зададим цвет точки
    if (deadline !== null) {
      // тогда посмотрим сколько там времени осталось
      // если в секундах меньше двух дней 
      if (deadline.timeLeft < 60 * 60 * 24 * 2) {
        // но если уже на проверке, то путь будет желтым
        if (is_checking) {
          dotColor = 'orange';
        } else {
          // А если не проверено или сдано на 2 => цвет красный
          dotColor = 'red';
        }
      }
    }
    
    
    newData.push({
      // type: 'dot',
      dotColor,
      id_lab: el.id_lab,
      description: el.description, 
      id_discipline: el.discipline.id_discipline,
      discipline: el.discipline.description,
      comment: el.comment,
      file: el.file,
      answer,
      deadline
            
    });
  }

  return newData;
}

const getData = async (setData,setLoading, convertData,classes) => {
  await API.call({
    method: "get_labs_of_current_semester",
  }).then(result => {
    if (result.success) {
      // console.log(result.data);
      let temp = convertData(result.data,classes);
      // console.log(temp);
      setData(temp);
    }
    setLoading(false);
  });
}

const getSemester = async (setSemeter) => {
  await API.call({
    method: "get_current_semester",
  }).then((result) => {
    if (result.success) {
      // console.log(result.data);
      if (result.data.semester)
        setSemeter(result.data.semester);
    }
  });
}

export default function LabsTimeline(props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [hiddenCheckingLabs, setHiddenCheckingLabs] = useState(true);
  const [showIntervals, setShowIntervals] = useState(true);
  const [semester, setSemester] = useState(null);
  // const [prevDate, setPrevDate] = useState(null);
  var prevDate = null;

  const classes = useStyles();

  useEffect(() => {
    getSemester(setSemester);
    getData(setData, setLoading, convertData, classes);
    return () => {
      setData(null);
      setLoading(true);
      setSemester(null);
    };
  }, [classes]);

  return (<>{loading ? (<LoadingPage />) : (<>
    <PageTitle title="Таймлайн" />
    <Paper style={{padding:10}}>
      <FormGroup aria-label="position" row>
        <FormControlLabel 
          label="Отображать лабораторные на проверке"
          labelPlacement="start"
          control={
            <Switch
              checked={hiddenCheckingLabs}
              onClick={(e) => setHiddenCheckingLabs(!hiddenCheckingLabs)}
              color="primary"
              classes={{
                root: classes.switchRoot,
                switchBase: classes.switchBase,
              }}
            />
          }
          className={classes.switchLabel}
        />
        <FormControlLabel 
          label="Отображать временные промежутки"
          labelPlacement="start"
          control={
            <Switch
              checked={showIntervals}
              onClick={(e) => setShowIntervals(!showIntervals)}
              color="primary"
              classes={{
                root: classes.switchRoot,
                switchBase: classes.switchBase,
              }}
            />
          }
          className={classes.switchLabel}
        />
      </FormGroup>
    </Paper>
    
    <Timeline>     
      {data && data.map(item => {
        let separatorTime = null;
        if (showIntervals) {
          if (prevDate === null) {
            if (item.deadline.timeLeft) {
              prevDate = item.deadline.timeLeft;
            }
          } else {
            if (!(item.answer && item.answer.is_checking && !hiddenCheckingLabs) &&
              item.deadline.timeLeft - prevDate > 60 * 60 * 24) {
              separatorTime = item.deadline.timeLeft - prevDate;
              prevDate = item.deadline.timeLeft;
            }
          }
        }
        return (
          <LabsTimelineItem
            data={item}
            hidden={!hiddenCheckingLabs}
            separatorTime={separatorTime}
            history={props.history}
            semester={semester}
          />
        );
      })}
      {/* {data && data.map(item => )} */}
    </Timeline>
  </>)}</>);
}

