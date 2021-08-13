import React, { useEffect, useState } from 'react';
// import useStyles from "./styles";
import EditForm from './EditForm';
import AlertDialog from '../../../components/AlertDialog';
import ControlableModal from '../../../components/Modal/ControlableModal';
import RequestV2Button from '../../../components/Buttons/RequestV2Button';
import Section from '../../../components/Section';

const EditModal = ({
  onClose = () => { },
  onSave = (data) => { },
  open,
  setOpen,
  id = null,
  route
}) => {
  // const classes = useStyles();
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
      setData(null);
      setFormChanged(false);
    })
  }, [id, open]);

  function close(success = false) {
    if (success) onSave();
    setFormChanged(false);
    onClose();
    setOpen(false);
  }

  const saveButton = (
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
      // onSuccess={() => {}}
      onSuccess={() => close(true)}
      label="Сохранить"
    />
  );

  return (
      <ControlableModal
        modalTitle={id === null ? 'Создать тест' : 'Редактировать тест (ID '+ id +')'}
        onClose={() => {
          if (formChanged === true) {
            setCloseConfirmation(true);
            return false;
          }
          close();
          return true;
        }}
        width="lg"
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
      {id === null ? (
        <>
          <EditForm data={data} setData={setData} setFormChanged={setFormChanged}/>
          {saveButton}
        </>
      ) : (
        <Section update={update} setUpdate={setUpdate} setData={setData}
          request={id === null ? null : { route: route + '/' + id }}
        >
          <EditForm data={data} setData={setData} setFormChanged={setFormChanged}/>
          {saveButton}
        </Section>
      )}
    </ControlableModal>
  );
}

export default EditModal;
