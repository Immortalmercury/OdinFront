import React, { useEffect, useState } from 'react';
import { TextField, Typography } from '@material-ui/core';
import useStyles from "./styles";
import Editor from '../../../../components/Editor';
import AlertDialog from '../../../../components/AlertDialog';
import SecondsPicker from '../../../../components/SecondsPicker';
import ControlableModal from '../../../../components/Modal/ControlableModal';
import RequestV2Button from '../../../../components/Buttons/RequestV2Button';

const EditModal = ({
  onClose = () => { },
  onSave = (data) => { },
  open,
  setOpen,
  data,
  route
}) => {
  const classes = useStyles();
  const [nameValue, setNameValue] = useState(null);
  const [timeValue, setTimeValue] = useState(null);
  const [content, setContent] = useState(null);

  const [closeConfirmation, setCloseConfirmation] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    if (data !== null) { 
      setNameValue(data.name);
      setTimeValue(data.time);
      setContent(data.content);
    }
    return(() => {
      setNameValue(null);
      setTimeValue(null);
      setContent(null);
      setFormChanged(false);
    })
  }, [data]);

  function close(success = false) {
    if (success) onSave();
    setFormChanged(false);
    setOpen(false);
    onClose();
  }
  
  const saveButton = (
    <RequestV2Button
      variant="contained"
      style={{ marginTop: 15, marginBottom: 15 }}
      fullWidth={true}
      margin="normal"
      color="primary"
      request={{
        method: (data !== null ? 'PUT' : 'POST'),
        route: route + (data !== null ? '/' + data.id : ""),
        data: {
          name: nameValue,
          time: timeValue,
          content: content
        }
      }}
      onSuccess={() => close(true)}
      label="Сохранить"
    />
  );

  return (
    <ControlableModal
      modalTitle={(data !== null && Number.isInteger(data.id)) ? 'Редактировать: '+data.name:'Создать лекцию'}
      onClose={() => {
        if (formChanged === true) {
          setCloseConfirmation(true);
          return false;
        }
        close();
        return true;
      }}
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
        initialContent={data === null ? null: data.content}
        setContent={(e) => {
          if ((data === null ? null: data.content) !== e)
            setFormChanged(true);
          setContent(e);
        }}
      />
      {saveButton}
    </ControlableModal>
  );
}

export default EditModal;
