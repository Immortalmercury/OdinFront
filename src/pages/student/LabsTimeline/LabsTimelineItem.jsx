import React, { useState } from 'react';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography'; 
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { red, orange, green } from '@material-ui/core/colors';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import UploadFileButton from '../../../components/Buttons/UploadFileButton';
import DownloadFileButton from '../../../components/Buttons/DownloadFileButton';
import { useEffect } from 'react';
import SecondsToRusTime from '../../../components/SecondsToRusTime';
import { Tooltip } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import ForwardIcon from '@material-ui/icons/Forward';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
  },
  date: {
    padding: '6px 5px',
  },
  separatorDate: {
    padding: '30px',
  },
  dayIcon: {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  redDot: {
    backgroundColor: red[700],
  },
  orangeDot: {
    backgroundColor: orange[500],
  },
  greenDot: {
    backgroundColor: green[500],
  },
  redText: {
    color: red[700],
  },
  orangeText: {
    color: orange[500],
  },
  greenText: {
    color: green[500],
  },
  monthText: {
    marginBottom: 5,
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
  dashedTail: {
    backgroundColor: 'transparent',
    border: '1px dashed ' + theme.palette.secondary.main,
  },
  oppositeContent: {
    padding: 0,
    flex: 0,
  },
  hidden: {
    display: "none",
  }
}));

const LabsTimelineItem = ({ data, hidden, separatorTime = null, history, semester }) => {
  var timeLeft = null;
  var DeadlineComplete = null;
  const [successCallback, setSuccessCallback] = useState(false);

  useEffect(() => {
    if (successCallback) {
      
      data.answer = {
        mark: null,
        is_checking: true,
        completeDate: Math.floor(new Date() / 1000),
        intervalBetweenDeadlineNComplete: Math.floor((data.deadline.datetime - new Date()) / 1000),
      };
      if (data.answer.intervalBetweenDeadlineNComplete > 60 * 60 * 24 * 2) {
        data.dotColor = 'default';
      } else {
        data.dotColor = 'orange';
      }
    }
    return (() => {
      setSuccessCallback(false);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successCallback]);
  const classes = useStyles();
  return (<>
    {/* Оторбражение сепаратора */}
    {separatorTime&&data.dotColor!=='red'&&(data.deadline&&data.deadline.timeLeft>0)&& <>
      <TimelineItem key={data.id_lab+'interval'} >
        <TimelineOppositeContent className={classes.oppositeContent} />
        <TimelineSeparator>
          <TimelineDot variant="default" className={classes.dayIcon}>
            <QueryBuilderIcon/>
          </TimelineDot>
          <TimelineConnector className={classes.dashedTail} />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="h6" component="h1" className={classes.separatorDate} color='textSecondary'>
            <SecondsToRusTime time={separatorTime}/>
          </Typography>
        </TimelineContent>
      </TimelineItem>
    </>}
    {/* Отображение основной карточки */}
      <TimelineItem key={data.id_lab} className={classnames({
            [classes.hidden]: data.answer&&data.answer.is_checking&&hidden,
          })}>
      <TimelineOppositeContent className={classes.oppositeContent} />
      <TimelineSeparator>
        <TimelineDot color="primary" variant="default"
          className={classnames(classes.dayIcon,{
            [classes.redDot]: data.dotColor==='red',
            [classes.orangeDot]: data.dotColor === 'orange',
            [classes.greenDot]: data.dotColor==='default'&&data.answer&&data.answer.is_checking
          })}>
          <Typography >
            {data.deadline.day}
          </Typography>
        </TimelineDot>
        
        <TimelineConnector className={classes.secondaryTail} />
      </TimelineSeparator>
      <TimelineContent>
        <div style={{display:"flex",alignItems:"center"}}>
        <Typography variant="h6" component="h1" className={classes.date}>
          {data.deadline.month}
        </Typography>
        <Typography className={classnames({
            [classes.redText]: data.dotColor==='red',
            [classes.orangeText]: data.dotColor==='orange',
            [classes.greenText]: data.dotColor==='default'&&data.answer&&data.answer.is_checking,
          })}>
            {data.answer && data.answer.is_checking && ' (Проверяется) '}              
          {((!data.answer)||(data.answer&&!data.answer.is_checking)) && (<>(
            {(timeLeft = data.deadline.timeLeft) > 0 ?
                'Осталось ' :
                (timeLeft = -timeLeft) > 0 && 'Просрочено на '}
            <SecondsToRusTime time={timeLeft}/>
          )</>)}
          </Typography>
          
          {data.answer && data.answer.is_checking && <Typography className={classnames({
            [classes.redText]: (DeadlineComplete = data.answer.intervalBetweenDeadlineNComplete) < 0,
            [classes.greenText]: DeadlineComplete > 0,
          })} style={{paddingLeft:5}}>
            {DeadlineComplete > 0 ? 
              ' Сдано за ': 
              (DeadlineComplete = -DeadlineComplete) > 0 && ' Сдано с опозданием на '}
            <SecondsToRusTime time={DeadlineComplete}/>
            {data.answer.intervalBetweenDeadlineNComplete > 0 && ' до крайнего срока '}
          </Typography>}
        </div>
        <Paper elevation={3} className={classes.paper}>
      <div style={{display:"flex",alignItems:"center",justifyContent: 'space-between',}}>
          <div style={{display:"flex", alignItems: 'flex-start',flexDirection: 'column',paddingBottom:5}}>
          
          <Typography variant="h6" component="h1" className={classes.date}>
            {data.discipline}
          </Typography>
          <Typography style={{ paddingLeft: 5 }}>{data.description}</Typography>
              {data.comment &&
                <Typography style={{ paddingLeft: 5 }}>Комментарий: {data.comment}</Typography>
              }
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <DownloadFileButton
              buttonType="IconButton"
              color="primary"
              filename={data.file}
              data={{
                method: "get_lab_file",
                file: data.file,
                lab: data.id_lab,
              }}
              label="Скачать задание"
            />
            <UploadFileButton
              className={classes.greenText}
              buttonType="IconButton"
              color="primary"
              label="Отправить ответ"
              data={{
                method: 'upload_user_answer',
                lab: data.id_lab,
              }}
              successCallback={setSuccessCallback}
            />
            <Tooltip title="На страницу предмета" placement="top" arrow>
              <IconButton aria-label="upload" onClick={() => {
                history.push('/app/semester/'+semester+'/discipline/'+data.id_discipline)
              }}>
                <ForwardIcon />
              </IconButton>
            </Tooltip>
          </div>
          </div>
        </Paper>
      </TimelineContent>
    </TimelineItem>
  </>);
}

export default LabsTimelineItem;
