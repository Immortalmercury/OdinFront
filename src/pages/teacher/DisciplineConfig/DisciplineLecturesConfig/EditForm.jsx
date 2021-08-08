import React from 'react';
import { TextField, Typography } from '@material-ui/core';
import useStyles from "./styles";
import Editor from '../../../../components/Editor';
import SecondsPicker from '../../../../components/SecondsPicker';

const EditForm = ({data, setData, setFormChanged}) => {
  const classes = useStyles();

  return (<>
    <TextField
      variant="outlined"
      label="Название лекции"
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
      label="Плановое время изучения"
      value={(data && data.time) || null}
      onChange={(e) => {
        if (data && data.time !== e)
          setFormChanged(true);
        setData({ ...data, time: e });
      }}
    />
    <Typography
      className={classes.editorLabel}
    ><span className={classes.editorLabelText}>Содержание лекции</span></Typography>
    <Editor
      withoutN1edScript
      initialContent={(data && data.content) || null}
      setContent={(e) => {
        if ((data === null ? null: data.content) !== e)
          setFormChanged(true);
        setData({ ...data, content: e });
      }}
    />
  </>);
}

export default EditForm;
