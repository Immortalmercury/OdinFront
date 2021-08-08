import React from 'react';
import { TextField, Typography } from '@material-ui/core';
import useStyles from "./styles";
import Editor from '../../../../components/Editor';
import SecondsPicker from '../../../../components/SecondsPicker';
import { MenuItem } from '@material-ui/core';

const EditForm = ({data, setData, setFormChanged}) => {
  const classes = useStyles();

  return (<>
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
      label="Разрешено попыток"
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
        <MenuItem value={'selfСontrol'}>Тест для самоконтроля</MenuItem>
        <MenuItem value={'exam'}>Тест на оценку</MenuItem>
    </TextField>
    
  </>);
}

export default EditForm;
