import React from 'react';
import ControlableModal from '../../../../components/Modal/ControlableModal';
import { useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { useState } from 'react';

import { Typography } from '@material-ui/core';
import Editor from '../../../../components/Editor';
import { Button } from '@material-ui/core';
import useStyles from "./styles";
import SecondsPicker from '../../../../components/SecondsPicker';
import AlertDialog from './../../../../components/AlertDialog/index';

const EditModal = ({
  onClose = () => { },
  open,
  setOpen,
  name,
  time = null,
  initialContent,
  onSave=(data)=> { },
  title,
}) => {
  const classes = useStyles();
  const [nameValue, setNameValue] = useState(name);
  const [timeValue, setTimeValue] = useState(time);
  const [content, setContent] = useState(initialContent);

  const [closeConfirmation, setCloseConfirmation] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    setNameValue(name);
    setTimeValue(time);
    setContent(initialContent);
    return(() => {
      setNameValue(null);
      setTimeValue(null);
      setContent(null);
      setFormChanged(false);
    })
  }, [name,time,initialContent]);

  return (
    <ControlableModal
      onClose={() => {
        if (formChanged === true) {
          setCloseConfirmation(true);
          return false;
        }
        setFormChanged(false);
        onClose();
        return true;
      }}
      modalTitle={title}
      width="xl"
      open={open}
      setOpen={setOpen}
      noOpenButton
    >
      <AlertDialog
        open={closeConfirmation}
        setOpen={setCloseConfirmation}
        question={"Несохраненные данные будут потеряны. Закрыть редактор?"}
        description={null}
        successCallback={() => {
          setFormChanged(false);
          setOpen(false);
          onClose();
        }}
        failCallback={() => {}}
      />
      <TextField
        variant="outlined"
        label="Название лекции"
        fullWidth
        margin="normal"
        value={nameValue}
        onChange={(e) => {
          if (nameValue !== e)
            setFormChanged(true);
          setNameValue(e.target.value);
        }}
      />
      <SecondsPicker
        label="Плановое время изучения"
        value={timeValue}
        onChange={(e) => {
          if (timeValue !== e)
            setFormChanged(true);
          setTimeValue(e);
        }}
      />
      <Typography
        className={classes.editorLabel}
      ><span className={classes.editorLabelText}>Содержание лекции</span></Typography>
      <Editor
        withoutN1edScript
        initialContent={initialContent}
        setContent={(e) => {
          // let newContent = e.replace("<script src=\"//cdn.public.n1ed.com/OSZMDFLT/widgets.js\"></script>", '')
          if (initialContent !== e) // && initialContent !== newContent)
            setFormChanged(true);
          setContent(e);
        }}
      />
      <Button
        variant="contained"
        style={{marginTop: 15, marginBottom: 15}}
        fullWidth
        margin="normal"
        color="primary"
        onClick={() => {
          onSave(nameValue,timeValue,content);
        }}
      >
        Сохранить
      </Button>
    </ControlableModal>
  );
}

export default EditModal;
