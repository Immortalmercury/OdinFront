import React, { useEffect, useState } from 'react';
import { TextField, Typography } from '@material-ui/core';
import useStyles from "./styles";
import Editor from '../../../../components/Editor';
import AlertDialog from '../../../../components/AlertDialog';
import SecondsPicker from '../../../../components/SecondsPicker';
import ControlableModal from '../../../../components/Modal/ControlableModal';
import RequestV2Button from '../../../../components/Buttons/RequestV2Button';
import Section from '../../../../components/Section';

const EditModal = ({
  onClose = () => { },
  onSave = (data) => { },
  open,
  setOpen,
  id = null,
  route
}) => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(false);
  const [closeConfirmation, setCloseConfirmation] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    if (id !== null) { 
      setUpdate('silent');
    }
    return (() => {
      setUpdate(false);
      setFormChanged(false);
    })
  }, [id]);

  function close(success = false) {
    if (success) onSave();
    setFormChanged(false);
    setOpen(false);
    onClose();
  }

  // const form = (<>
      
  //   </>);

  return (
      <ControlableModal
        modalTitle={id === null ? 'Создать лекцию' : 'Редактировать лекцию (ID '+ id +')'}
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
      
        <Section update={update} setUpdate={setUpdate} setData={setData}
          request={{ route: route + '/' + id }}
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
        value={(data && data.name) || null}
        onChange={(e) => {
          if (data.name !== e)
            setFormChanged(true);
          setData({ ...data, name: e.target.value });
        }}
      />
      <SecondsPicker
        label="Плановое время изучения"
        value={(data && data.time) || null}
        onChange={(e) => {
          if (data.time !== e)
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
      <RequestV2Button
        variant="contained"
        style={{ marginTop: 15, marginBottom: 15 }}
        fullWidth={true}
        margin="normal"
        color="primary"
        request={{
          method: (id !== null ? 'PUT' : 'POST'),
          route: route + (id !== null ? '/' + id : ""),
          data
        }}
        onSuccess={() => close(true)}
        label="Сохранить"
        />
      </Section>
      
    </ControlableModal>
  );
}

export default EditModal;
