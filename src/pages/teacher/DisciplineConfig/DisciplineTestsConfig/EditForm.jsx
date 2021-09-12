import React from 'react';
import { TextField, FormGroup, Grid, Switch } from '@material-ui/core';
import useStyles from "./styles";
// import Editor from '../../../../components/Editor';
import SecondsPicker from '../../../../components/SecondsPicker';
import { MenuItem } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';

const EditForm = ({data, setData, setFormChanged}) => {
  const classes = useStyles();

  return (<>
    <Grid container spacing={3} direction="row">
      <Grid item direction="column" xs={6} style={{display:"flex"}}>
        <TextField
          variant="outlined"
          label="Название теста"
          fullWidth
          margin="normal"
          value={(data && data.name) || null}
          onChange={(e) => {
            if (data && data.name !== e)
              setFormChanged(true);
            setData({ ...data, name: e.target.value });
          }}
        />
        <TextField
          variant="outlined"
          label="Тип теста"
          select
          margin="normal"
          value={(data && data.parameters && data.parameters.test_type) || null}
          onChange={(e) => {
            if (data && data.parameters && data.parameters.test_type !== e)
              setFormChanged(true);
            setData({ ...data, parameters: { ...data.parameters, test_type: e.target.value }});
          }}
        >
            <MenuItem value={'selfControl'}>Тест для самоконтроля</MenuItem>
            <MenuItem value={'exam'}>Тест на оценку</MenuItem>
        </TextField>
        <SecondsPicker
          label="Ограничение времени"
          value={(data && data.time) || null}
          onChange={(e) => {
            if (data && data.time !== e)
              setFormChanged(true);
            setData({ ...data, time: e });
          }}
        />
        <TextField
          variant="outlined"
          label="Порог прохождения теста (процент правильных ответов)"
          fullWidth
          type="number"
          margin="normal"
          value={(data && data.pass_weight) || null}
          onChange={(e) => {
            if (data && data.pass_weight !== e)
              setFormChanged(true);
            setData({ ...data, pass_weight: e.target.value });
          }}
        />
        <TextField
          variant="outlined"
          label="Разрешено попыток ( 0 - неограниченно )"
          fullWidth
          type="number"
          margin="normal"
          value={(data && data.max_attempts) || null}
          onChange={(e) => {
            if (data && data.max_attempts !== e)
              setFormChanged(true);
            setData({ ...data, max_attempts: e.target.value });
          }}
        />
        <TextField
          variant="outlined"
          label="Отображение результатов тестирования"
          select
          margin="normal"
          value={(data && data.parameters && data.parameters.show_results) || null}
          onChange={(e) => {
            if (data && data.parameters && data.parameters.show_results !== e)
              setFormChanged(true);
            setData({ ...data, parameters: { ...data.parameters, show_results: e.target.value }});
          }}
        >
            <MenuItem value={'not'}>Не показывать</MenuItem>
            <MenuItem value={'mark'}>Показывать только правильность ответа (оценку за вопрос)</MenuItem>
            <MenuItem value={'answer'}>Показывать правильный ответ и оценку за вопрос</MenuItem>
            <MenuItem value={'description'}>Показывать правильный ответ, оценку и обоснование</MenuItem>
        </TextField>
      </Grid>
      <Grid item direction="column" xs={6} style={{ display: "flex" }}>
        <TextField
          variant="outlined"
          label="Начальное количество вопросов при прохождении теста"
          fullWidth
          type="number"
          margin="normal"
          value={(data && data.parameters && data.parameters.questions_for_attempt)|| null}
          onChange={(e) => {
            if (data && data.parameters && data.parameters.questions_for_attempt !== e.target.value)
              setFormChanged(true);
            setData({
              ...data, parameters:
              {...data.parameters, questions_for_attempt: e.target.value}
            });
          }}
        />
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              label="Легких"
              fullWidth
              type="number"
              margin="normal"
              value={(data && data.parameters && data.parameters.easy_questions)|| null}
              onChange={(e) => {
                if (data && data.parameters && data.parameters.easy_questions !== e.target.value)
                  setFormChanged(true);
                setData({
                  ...data, parameters:
                  {...data.parameters, easy_questions: e.target.value}
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              label="Средних"
              fullWidth
              type="number"
              margin="normal"
              value={(data && data.parameters && data.parameters.middle_questions)|| null}
              onChange={(e) => {
                if (data && data.parameters && data.parameters.middle_questions !== e.target.value)
                  setFormChanged(true);
                setData({
                  ...data, parameters:
                  {...data.parameters, middle_questions: e.target.value}
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              label="Тяжелых"
              fullWidth
              type="number"
              margin="normal"
              value={(data && data.parameters && data.parameters.hard_questions)|| null}
              onChange={(e) => {
                if (data && data.parameters && data.parameters.hard_questions !== e.target.value)
                  setFormChanged(true);
                setData({
                  ...data, parameters:
                  {...data.parameters, hard_questions: e.target.value}
                });
              }}
            />
          </Grid>
        </Grid>
        <FormControl component="fieldset" className={classes.formControl} margin="normal">
          <FormLabel component="legend">Как усложнять тест с каждой новой попыткой?</FormLabel>
          <FormGroup style={{marginLeft:10,marginTop:5}}>
            <FormControlLabel
            control={<Checkbox
              checked={(data && data.parameters && data.parameters.harder_attempts_more_questions)|| null}
              onChange={(e) => {
                if (data && data.parameters && data.parameters.harder_attempts_more_questions !== e.target.checked)
                  setFormChanged(true);
                setData({
                  ...data, parameters:
                  {...data.parameters, harder_attempts_more_questions: e.target.checked}
                });
              }}
              color="primary"
            />}
              label="Увеличивать кол-во вопросов (+ дополнительное время)"
            />
            <FormControlLabel
            control={<Checkbox
              checked={(data && data.parameters && data.parameters.harder_attempts_level)|| null}
              onChange={(e) => {
                if (data && data.parameters && data.parameters.harder_attempts_level !== e.target.checked)
                  setFormChanged(true);
                setData({
                  ...data, parameters:
                  {...data.parameters, harder_attempts_level: e.target.checked}
                });
              }}
              color="primary"
            />}
              
              label="Увеличивать сложность вопросов"
            />
          </FormGroup>
        {/* </FormControl> */}
        {/* <FormControl component="fieldset" className={classes.formControl} margin="normal"> */}
          <FormLabel component="legend">Контроль списывания</FormLabel>
          <FormGroup style={{marginLeft:10,marginTop:5}}>
            <FormControlLabel
            control={<Switch
              checked={(data && data.parameters && data.parameters.question_time_limited)|| null}
              onChange={(e) => {
                if (data && data.parameters && data.parameters.question_time_limited !== e.target.checked)
                  setFormChanged(true);
                setData({
                  ...data, parameters:
                  {...data.parameters, question_time_limited: e.target.checked}
                });
              }}
              color="primary"
            />}
              label="Ограничение времени для каждого вопроса"
            />
            <FormControlLabel
            control={<Switch
              checked={(data && data.parameters && data.parameters.test_defender)|| null}
              onChange={(e) => {
                if (data && data.parameters && data.parameters.test_defender !== e.target.checked)
                  setFormChanged(true);
                setData({
                  ...data, parameters:
                  {...data.parameters, test_defender: e.target.checked}
                });
              }}
              color="primary"
            />}
              label="Жесткий контроль при тестировании"
            />
            {(data && data.parameters && data.parameters.test_defender) && (<>
              <FormControlLabel
                control={<Switch
                  checked={(data && data.parameters && data.parameters.defender_warnings)|| null}
                  onChange={(e) => {
                    if (data && data.parameters && data.parameters.defender_warnings !== e.target.checked)
                      setFormChanged(true);
                    setData({
                      ...data, parameters:
                      {...data.parameters, defender_warnings: e.target.checked}
                    });
                  }}
                color="primary"
              />}
                label="Выдавать 2 предупреждения перед фиксацией нарушения"
              />
              <FormControlLabel
                control={<Switch
                  checked={(data && data.parameters && data.parameters.max_hardness_after_violation)|| null}
                  onChange={(e) => {
                    if (data && data.parameters && data.parameters.max_hardness_after_violation !== e.target.checked)
                      setFormChanged(true);
                    setData({
                      ...data, parameters:
                      {...data.parameters, max_hardness_after_violation: e.target.checked}
                    });
                  }}
                color="primary"
              />}
                label="Максимальная сложность теста при следующей попытке, если нарушение было зафиксировано"
              />
            </>)}
          </FormGroup>
        </FormControl>
      </Grid>
    </Grid>
  </>);
}

export default EditForm;
