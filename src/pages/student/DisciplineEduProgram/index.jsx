import React, { useState } from "react";
import { Paper, Typography } from "@material-ui/core";
import UploadFileButton from "../../../components/Buttons/UploadFileButton";
import DownloadFileButton from "../../../components/Buttons/DownloadFileButton";
import Section from "../../../components/Section";
// import classnames from "classnames";
import useStyles from "./styles";
import { Tooltip } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import ForwardIcon from '@material-ui/icons/Forward';

export default function DisciplineEduProgram(props) {
  const classes = useStyles();
  const [update, setUpdate] = useState(null);
  const [data, setData] = useState(null);

  // const Mark = (mark) => {
  //   return (
  //     <Badge
  //       badgeContent={mark}
  //       color="primary"
  //       classes={{
  //         colorPrimary: classnames({
  //           [classes.greenDot]: mark === 5,
  //           [classes.blueDot]: mark === 4,
  //           [classes.orangeDot]: mark === 3,
  //           [classes.redDot]: mark === 2,
  //         }),
  //       }}
  //     />
  //   );
  // };

  return (
    <>
      <Section
        setData={setData}
        update={update}
        setUpdate={setUpdate}
        requestData={{
          method: "getEduProgram",
          discipline: props.match.params.id_discipline,
        }}
      >
        {data && data.map((item) => {
          return (
            <Paper elevation={3} className={classes.paper}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between', }}>
                <div style={{ display: "flex", alignItems: 'flex-start', flexDirection: 'column', paddingBottom: 5 }}>
              
                  <Typography variant="h6" component="h1" className={classes.date}>
                    {item.edu_item.name}
                  </Typography>
                  <Typography style={{ paddingLeft: 5 }}>{item.description}</Typography>
                  {item.comment &&
                    <Typography style={{ paddingLeft: 5 }}>Комментарий: {item.comment}</Typography>
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
                    successCallback={()=>{}}
                  />
                  <Tooltip title="На страницу предмета" placement="top" arrow>
                    <IconButton aria-label="upload" >
                      <ForwardIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </Paper>);
        })}
        {/* <MuiTable
          style={{ paddingTop: 10 }}
          title="Список лабораторных работ"
          columns={[
            "Название",
            "Приложение",
            "Дедлайн",
            "Статус",
            "Сдано",
            "Оценка",
            "Проверил",
            "Действия",
          ]}
          noMatch="Извините, ничего не найдено"
          data={
            !data
              ? []
              : (() => {
                  let newData = [];
                  for (let index = 0; index < data.length; index++) {
                    const el = data[index];
                    let temp = null;
                    newData.push([
                      // *Название
                      <>
                        {el.description}{" "}
                        {el.comment && (
                          <>
                            <br />
                            {"(" + el.comment + ")"}
                          </>
                        )}
                      </>,
                      // *Приложение
                      el.file && (
                        <DownloadFileButton
                          size="small"
                          variant="outlined"
                          color="primary"
                          filename={el.file.split("/").pop()}
                          data={{
                            method: "get_lab_file",
                            lab: el.id_lab,
                          }}
                          label="Скачать"
                        />
                      ),
                      // *Дедлайн
                      el.deadline && <DateToRusTime time={el.deadline} />,
                      // el.comment,
                      // *Статус
                      el.answer ? (
                        <div
                          className={classnames({
                            // [classes.greenText]: el.answer.mark > 2 && ,
                            [classes.orangeText]: el.answer.status !== 2,
                            [classes.redText]:
                              el.answer.mark === 2 && el.answer.status === 2,
                          })}
                        >
                          {Statuses[el.answer.status - 1]}
                        </div>
                      ) : (
                        <div className={classes.completeCol}>
                          <div>Нет ответа</div>
                          {!el.deadline ||
                          (temp = Math.floor(
                            (new Date(el.deadline) - new Date()) / 1000,
                          )) > 0 ? (
                            <div className={classes.greenText}>
                              {"Осталось "}
                              {temp < 60 && temp + " секунд"}
                              <br />
                              <SecondsToRusTime time={temp} />
                            </div>
                          ) : (
                            <div
                              className={classes.redText}
                              style={{ maxWidth: 155 }}
                            >
                              {"Просрочено на "}
                              {-temp < 60 && "несколько секунд"}
                              <br />
                              <SecondsToRusTime time={-temp} />
                            </div>
                          )}
                        </div>
                      ),
                      // * Сдано
                      el.answer && el.answer.complete_date && (
                        <div className={classes.completeCol}>
                          <>
                            <DateToRusTime time={el.answer.complete_date} />
                          </>
                          {!el.deadline ||
                          (temp = Math.floor(
                            (new Date(el.deadline) -
                              new Date(el.answer.complete_date)) /
                              1000,
                          )) > 0 ? (
                            <div className={classes.greenText}>Вовремя</div>
                          ) : (
                            <div
                              className={classes.redText}
                              // style={{ maxWidth: 155 }}
                            >
                              {"C опозданием на "}
                              {-temp < 60 && -temp + " секунд"}
                              <br />
                              <SecondsToRusTime time={-temp} />
                            </div>
                          )}
                        </div>
                      ),
                      // * Оценка
                      el.answer && el.answer.mark && Mark(el.answer.mark),
                      // * Препод что проверил
                      el.answer &&
                        el.answer.teacher &&
                        el.answer.teacher.s_name +
                          " " +
                          (el.answer.teacher.f_name[0] + ".") +
                          (el.answer.teacher.fth_name &&
                            el.answer.teacher.fth_name[0] + "."),
                      // * Кнопка загрузки ответа
                      ((el.answer && el.answer.mark < 5) || !el.answer) &&
                        (new Date() - new Date(el.allowed_after) <
                          15552000000 ||
                          !el.allowed_after) && (
                          // (new Date() - new Date(el.allowed_after)) < 1000*60*60*24*30*6
                          <UploadFileButton
                            key={index}
                            size="small"
                            variant="contained"
                            color={
                              (el.answer &&
                                el.answer.mark === 2 &&
                                el.answer.status === 2) ||
                              !el.answer
                                ? "primary"
                                : "default"
                            }
                            label={
                              (el.answer &&
                                el.answer.mark === 2 &&
                                el.answer.status === 2) ||
                              !el.answer
                                ? "Загрузить ответ"
                                : "Пересдать"
                            }
                            data={{
                              method: "upload_user_answer",
                              lab: el.id_lab,
                            }}
                            // * Тихое обновление страницы успешной загрузки
                            successCallback={() => {
                              setUpdate("silent");
                            }}
                          />
                        ),
                    ]);
                  }
                  return newData;
                })()
          }
        /> */}
      </Section>
    </>
  );
}
