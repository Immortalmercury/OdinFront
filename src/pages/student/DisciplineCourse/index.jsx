import React, { useState } from "react";
import Section from "../../../components/Section";
import { Paper, Button, IconButton, Badge, FormControlLabel, Radio, Typography,FormControl,RadioGroup,Tooltip } from "@material-ui/core";
import useStyles from "./styles";
import { Close, Edit } from "@material-ui/icons";
import { red, green, orange } from '@material-ui/core/colors';
import RequestButton from "../../../components/Buttons/RequestButton";
import Centered from "../../../components/Centered";
import LabResultCard from "../LabResultCard";

const DisciplineCourse = (props) => {
  var classes = useStyles();
  let debug = true;
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(null);
  const [choosedTheme, setChoosedTheme] = useState(null);
  const [choosing, setChoosing] = useState(false);

  return (
    <Section
      setData={(resultData) => {
        setData(resultData);
        if (resultData.myTheme) {
          setChoosedTheme(resultData.myTheme.id_theme+"")
        } else {
          setChoosing(true);
        }
      }}
      update={update}
      setUpdate={setUpdate}
      requestData={{
        method: "get_course_data",
        discipline: props.match.params.id_discipline,
      }}
      debug
    >
      {data && (
        <>
          {data.myTheme !== null && (
            <Paper className={classes.myTheme}>
              <div className={classes.myThemeContent}>
                <div className={classes.myThemeTitle}>
                  <Typography variant="h6">Тема:</Typography>
                </div>
                <Typography variant="h6">{data.myTheme.description}</Typography>
              </div>
              {data.myTheme.confirmed === 1 && (
                <Badge style={{backgroundColor: green[300],borderRadius:20,padding:"3px 10px",color:'white', margin:10, width:100}}>
                  <Typography>Одобрена</Typography>
                </Badge>
              )}
              {data.myTheme.confirmed === 0 && (
                <div style={{width: 310}} className={classes.myThemeButtons}>
                  <Badge style={{backgroundColor: orange[300],borderRadius:20,padding:"3px 10px",color:'white', marginRight:10}}>
                    <Typography>На рассмотрении</Typography>
                  </Badge>
                  
                <Tooltip arrow title={'Изменить'} placement="top">
                  <IconButton
                  variant="outlined"
                  color="primary"
                  disabled={choosing}
                  onClick={() => {
                    setChoosing(true);
                  }}
                >
                  <Edit/>
                </IconButton>
                </Tooltip>
                <RequestButton
                    onSuccess={(resultData) => {
                      setUpdate('silent')
                    }}
                    requestData={{
                      method: "remove_course_theme",
                      discipline: props.match.params.id_discipline,
                    }}
                    label='Отменить выбор'
                    buttonType={'IconButton'}
                    icon={<Close />}
                    style={{color:red[500]}}
                    debug={debug}
                  />
                
              </div>
              )}
              {data.myTheme.confirmed === -1 && (
                <div style={{width: 160}} className={classes.myThemeButtons}>
                  <Badge style={{backgroundColor: red[300],borderRadius:20,padding:"3px 10px",color:'white'}}>
                    <Typography>Отклонена</Typography>
                  </Badge>
                  <RequestButton
                    onSuccess={(resultData) => {
                      setUpdate('silent')
                    }}
                    requestData={{
                      method: "remove_course_theme",
                      discipline: props.match.params.id_discipline,
                    }}
                    label='Отменить выбор'
                    buttonType={'IconButton'}
                    icon={<Close />}
                    style={{color:red[500]}}
                    debug={debug}
                  />
                </div>
              )}
              
            </Paper>
          )}
          {(data.myTheme === null || choosing) ? (
            <Paper className={classes.themes}>
              {data.themes ? (<>
                <Typography variant="h6">{data.myTheme === null ? "Выберите тему" : "Выберите другую тему"}</Typography>
                <FormControl component="fieldset" style={{ paddingLeft: 20, paddingTop:10 }}>
                  <RadioGroup value={choosedTheme} onChange={(e) => {setChoosedTheme(e.target.value)}}>
                    {data.themes.map((el) =>
                      <FormControlLabel value={"" + el.id_theme} control={<Radio color="primary" />} label={el.description} style={{marginTop:5}}/>
                    )}
                  </RadioGroup>
                </FormControl>
                <div style={{ width: "100%", display: "flex", alignItems: 'center', justifyContent: data.myTheme !== null ? 'flex-end':'center', marginTop: 20 }}>
                  <RequestButton
                    onSuccess={(resultData) => {
                      setChoosing(false);
                      setUpdate('silent')
                    }}
                    requestData={{
                      method: "set_course_theme",
                      discipline: props.match.params.id_discipline,
                      theme: choosedTheme,
                    }}
                    style={{ width: data.myTheme !== null ? 350:500 }} variant="contained" color="primary" size="large"
                    label='Подтвердить выбор'
                    buttonType={'Button'}
                    debug={debug}
                  />
                  {data.myTheme !== null && (
                    <Button
                      style={{ width: 150 }} variant="outlined" color="primary" size="large"
                      onClick={() => {
                        setChoosing(false);
                        if (data.myTheme !== null)
                          setChoosedTheme(data.myTheme.id_theme + "");
                      }}
                    >Отмена</Button>
                  )}
                </div>
              </>) : (
                <Centered height={400}>
                    <Typography variant='h5'>Нет доступных тем</Typography>
                    {data.myTheme !== null ? (
                      <Button
                        style={{ width: 350, marginTop: 20 }} variant="contained" color="primary"
                        onClick={() => {
                          setChoosing(false);
                        }}
                      >Закрыть</Button>
                    ) : (<>
                        <Typography variant='h6'>Обратитесь к преподавателю</Typography>
                          <Button
                          style={{ width: 350, marginTop: 20 }} variant="outlined" color="primary"
                          onClick={() => {
                            props.setTab('about');
                          }}
                        >Список преподавателей</Button>
                    </>)}
                </Centered>
              )}
            </Paper>
          ) : (
            <LabResultCard
              lab={data.course}
              setUpdate={setUpdate}
              
              filesCaption={"Материалы"}
            />
          )}
        </>
      )}
    </Section>
  );
};

export default DisciplineCourse;
