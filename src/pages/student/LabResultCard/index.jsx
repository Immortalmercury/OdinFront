import React from "react";
import { Paper, Badge } from "@material-ui/core";
import useStyles from "./styles";
import { Typography } from "@material-ui/core";
import { red, green, orange, blue } from "@material-ui/core/colors";
import Centered from "../../../components/Centered";
import DateToRusTime from "./../../../components/DateToRusTime/index";
import SecondsToRusTime from "../../../components/SecondsToRusTime";
import classnames from "classnames";
import UploadFileButton from "../../../components/Buttons/UploadFileButton";
import DownloadFileButton from "./../../../components/Buttons/DownloadFileButton";
import { GetApp } from "@material-ui/icons";
const Statuses = "Проверка,Оценено,Повторная проверка".split(",");

const LabResultCard = ({
  lab,
  filesCaption = "Задание",
  deadlineCaption = "Дедлайн",
  setUpdate,
  restrictUpdateAfterDeadline = false,
  disableTimeMessage = false,
  disableUpload=false,
  decoration = null,
  style={},
}) => {
  var classes = useStyles();
  let temp = null;

  const Mark = (mark) => {
    return (
      <>
        <Badge
          style={{
            backgroundColor:
              mark > 4
                ? green[500]
                : mark === 4
                ? blue[500]
                : mark === 3
                ? orange[500]
                : red[500],
            borderRadius: 20,
            padding: "3px 10px",
            color: "white",
            margin: 10,
            minWidth: 100,
          }}
        >
          <Typography>
            {mark === 6
              ? "Зачтено"
              : mark === 5
              ? "Отлично (5)"
              : mark === 4
              ? "Хорошо (4)"
              : mark === 3
              ? "Удовлетворительно (3)"
              : mark === 2
              ? "Неудовлетворительно (2)"
              : mark === 1
              ? "Не зачтено" : "Не явился"}
          </Typography>
        </Badge>
      </>
    );
  };

  return (<>
    { lab && (
    <Paper className={classes.themes} style={style}>
      {decoration && decoration}
      {deadlineCaption !== false &&!disableTimeMessage && (
          <span>
          <Typography
            variant="h6"
            style={{ display: "inline-block", minWidth: 200, margin: "10px 0" }}
          >
            {deadlineCaption+": "}
          </Typography>
          <Typography
            variant="h6"
            style={{ display: "inline-block", minWidth: 200, margin: "10px 0" }}
          >
            <DateToRusTime time={lab.deadline} />
          </Typography>
          
            <Typography
              variant="h6"
              style={{ display: "inline-block", minWidth: 200, margin: "10px 0" }}
            >
              {!lab.deadline ||
                (temp = Math.floor((new Date(lab.deadline) - new Date()) / 1000)) >
                0 ? (
                <span className={classes.greenText}>
                  ({"Осталось "}
                  {temp < 60 && temp + " секунд"}
                  <SecondsToRusTime time={temp} />)
                </span>
              ) : (
                !lab.answer && (
                  <span className={classes.redText} style={{ maxWidth: 155 }}>
                    ({"Просрочено на "}
                    {-temp < 60 && "несколько секунд"}
                    <SecondsToRusTime time={-temp} />)
                  </span>
                )
              )}
            </Typography>
          </span>
      )}
      {lab.file&&filesCaption !== false && (!lab.deadline || (new Date() - new Date(lab.deadline) < 0 || !restrictUpdateAfterDeadline)) && (      
        <div style={{ display: "flex" }}>
          <Typography
            variant="h6"
            style={{ display: "inline-block", minWidth: 200, margin: "10px 0" }}
          >
            {filesCaption+": "}
          </Typography>

          <Typography
            variant="h6"
            style={{ display: "inline-block", minWidth: 100, margin: "10px 0" }}
          >
            {lab.file.split('/').pop()}
          </Typography>

          <DownloadFileButton
            variant="outlined"
            color="primary"
            filename={lab.file.split('/').pop()}
            style={{ marginLeft:10 }}
            // style={{ display: "inline-block", minWidth: 200 }}
            data={{
              method: "get_lab_file",
              lab: lab.id_lab,
            }}
            label="Скачать"
            buttonType={"IconButton"}
            icon={<GetApp/>}
          />
        </div>
      )}
      {lab.answer&&lab.answer.file&& (!lab.deadline || (new Date() - new Date(lab.deadline) < 0 || !restrictUpdateAfterDeadline)) && (      
        <div style={{ display: "flex" }}>
          <Typography
            variant="h6"
            style={{ display: "inline-block", minWidth: 200, margin: "10px 0" }}
          >
            Файл ответа{": "}
          </Typography>

          <Typography
            variant="h6"
            style={{ display: "inline-block", minWidth: 100, margin: "10px 0" }}
          >
            {lab.answer.file.split('/').pop()}
          </Typography>

          <DownloadFileButton
            color="secondary"
            filename={lab.answer.file.split('/').pop()}
            style={{ marginLeft:10 }}
            buttonType={"IconButton"}
            data={{
              method: "get_user_answer",
              lab: lab.id_lab,
            }}
            label="Скачать"
            icon={<GetApp/>}
          />
        </div>
      )}
      {lab.answer && (
        <span>
          <Typography
            variant="h6"
            style={{ display: "inline-block", minWidth: 200, margin: "10px 0" }}
          >
            Сдано:{" "}
          </Typography>
          <Typography
            variant="h6"
            style={{ display: "inline-block", minWidth: 200, margin: "10px 0" }}
          >
            {lab.answer.complete_date && (
              <DateToRusTime time={lab.answer.complete_date} />
            )}
          </Typography>
          {!disableTimeMessage && (
            <Typography
              variant="h6"
              style={{ display: "inline-block", minWidth: 200, margin: "10px 0" }}
            >
              {!lab.deadline ||
                (temp = Math.floor(
                  (new Date(lab.deadline) - new Date(lab.answer.complete_date)) /
                  1000,
                )) > 0 ? (
                <div className={classes.greenText}>Вовремя</div>
              ) : (
                <div
                  className={classes.redText}
                // style={{ maxWidth: 155 }}
                >
                  ({"C опозданием на "}
                  {-temp < 60 && -temp + " секунд"}
                  <SecondsToRusTime time={-temp} />)
                </div>
              )}
            </Typography>
          )}
        </span>
      )}
      {((lab.answer && lab.answer.status !== 2) || !lab.answer) && (
        <span>
          <Typography
            variant="h6"
            style={{ display: "inline-block", minWidth: 200, margin: "10px 0" }}
          >
            Статус:
          </Typography>
          {lab.answer ? (
            <Typography
              variant="h6"
              style={{
                display: "inline-block",
                minWidth: 200,
                margin: "10px 0",
              }}
              className={classnames({
                // [classes.greenText]: lab.answer.mark > 2 && ,
                [classes.orangeText]: lab.answer.status !== 2,
                [classes.redText]:
                  lab.answer.mark === 2 && lab.answer.status === 2,
              })}
            >
              {Statuses[lab.answer.status - 1]}
            </Typography>
          ) : (
            <Typography
              variant="h6"
              style={{
                display: "inline-block",
                minWidth: 200,
                margin: "10px 0",
              }}
            >
              {"Нет ответа "}
            </Typography>
          )}
        </span>
      )}

      {lab.answer && lab.answer.mark && (
        <>
          <span>
            <Typography
              variant="h6"
              style={{
                display: "inline-block",
                minWidth: 200,
                margin: "10px 0",
              }}
            >
              Оценка:{" "}
            </Typography>
            <Typography
              variant="h6"
              style={{
                display: "inline-block",
                minWidth: 200,
                margin: "10px 0",
              }}
            >
              {Mark(lab.answer.mark)}
            </Typography>
          </span>
          <span>
            <Typography
              variant="h6"
              style={{
                display: "inline-block",
                minWidth: 200,
                margin: "10px 0",
              }}
            >
              Проверил:{" "}
            </Typography>
            <Typography
              variant="h6"
              style={{
                display: "inline-block",
                minWidth: 200,
                margin: "10px 0",
              }}
            >
              {lab.answer &&
                lab.answer.teacher &&
                lab.answer.teacher.s_name +
                  " " +
                  (lab.answer.teacher.f_name + " ") +
                  (lab.answer.teacher.fth_name && lab.answer.teacher.fth_name)}
            </Typography>
          </span>
        </>
      )}
      {(!lab.deadline || (new Date() - new Date(lab.deadline) < 0 || !restrictUpdateAfterDeadline)) && (
        
        ((lab.answer && lab.answer.mark < 5) || !lab.answer) &&
          (new Date() - new Date(lab.allowed_after) < 15552000000 ||
            !lab.allowed_after)&&!disableUpload&& (
            <Centered style={{ height: 60, marginTop: 30 }}>
              <UploadFileButton
                color="primary"
                variant={
                  (lab.answer &&
                    lab.answer.mark === 2 &&
                    lab.answer.status === 2) ||
                  !lab.answer
                    ? "contained"
                    : "contained"
                }
                label={
                  (lab.answer &&
                    lab.answer.mark === 2 &&
                    lab.answer.status === 2) ||
                  !lab.answer
                    ? "Загрузить ответ"
                    : "Загрузить новый вариант"
                }
                data={{
                  method: "upload_user_answer",
                  lab: lab.id_lab,
                }}
                style={{ width: 400 }}
                // * Тихое обновление страницы успешной загрузки
                successCallback={() => {
                  setUpdate("silent");
                }}
              />
            </Centered>
        )
      )}
      
      </Paper>
    )}
    </>);
};

export default LabResultCard;
