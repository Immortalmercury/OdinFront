import React, { useState } from "react";
import { Paper, Typography } from "@material-ui/core";
import Section from "../../../components/Section";
// import classnames from "classnames";
import useStyles from "./styles";
import { Tooltip } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { AssignmentTurnedIn, Ballot, Forward, MenuBook } from "@material-ui/icons";

export default function DisciplineEduProgram(props) {
  const classes = useStyles();
  const discipline_id = props.match.params.id_discipline;
  const route = "/discipline/" + discipline_id + '/edu';

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
        // requestData={{
        //   method: "getEduProgram",
        //   discipline: props.match.params.id_discipline,
        // }}
        request={{ route }}
        noDataAllowed
        debug
      >
        {data && data.map((el) => {
          return (
            <Paper elevation={3} className={classes.paper}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between', }}>
                <div style={{ display: "flex", alignItems: 'flex-start', flexDirection: 'column', paddingBottom: 5 }}>
                <div style={{ display: "flex", alignItems: 'flex-start', paddingBottom: 5 }}>
                    <span style={{margin:5}}>
                      {(el.instance === 'test'
                        ? (el.item?.parameters?.test_type === "selfСontrol" ?
                        <AssignmentTurnedIn/> : <Ballot />)
                          : <MenuBook />)}

                    </span>
                  <Typography variant="h6" component="h1" className={classes.date}>
                    {el.item.name}
                    </Typography>
                </div>
                  {/* <Typography style={{ paddingLeft: 5 }}>{item.description}</Typography> */}
                  {/* {item.comment &&
                    <Typography style={{ paddingLeft: 5 }}>Комментарий: {item.comment}</Typography>
                  } */}
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* <DownloadFileButton
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
                  /> */}
                  {el.instance === "test" && (
                    <IconButton
                        color={"primary"}
                        onClick={() => {
                          props.history.push('./test/' + el.instance_element_id);
                        }}
                      >
                        <Tooltip title="Перейти к тесту" placement="top" arrow><Forward /></Tooltip>
                    </IconButton>
                  )}
                  {el.instance === "lecture" && (
                    <IconButton
                        color={"primary"}
                        onClick={() => {
                          props.history.push('./lecture/' + el.instance_element_id);
                        }}
                      >
                        <Tooltip title="Читать лекцию" placement="top" arrow><Forward /></Tooltip>
                    </IconButton>
                  )}
                </div>
              </div>
            </Paper>);
        })}
        
      </Section>
    </>
  );
}
