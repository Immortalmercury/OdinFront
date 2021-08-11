import React, { useState } from 'react';
import { TextField, Typography } from '@material-ui/core';
import useStyles from "./styles";
import Editor from '../../../../components/Editor';
import SecondsPicker from '../../../../components/SecondsPicker';

const EditForm = ({data, setData, setFormChanged}) => {
  const classes = useStyles();
  const [initContent, setInitContent] = useState((data && data.content) || null);

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
      initialContent={initContent}
      setContent={(e) => {
        if (initContent !== e)
          setFormChanged(true);
        setData({ ...data, content: e });
      }}
    />
  </>);
}

export default EditForm;
