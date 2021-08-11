import React from 'react';
import { TextField, Typography } from '@material-ui/core';
import useStyles from "./styles";
import Editor from '../../../../components/Editor';
import SecondsPicker from '../../../../components/SecondsPicker';
import { MenuItem } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { useEffect } from 'react';
import API from '../../../../services/API';
// import { withRouter } from 'react-router-dom';

const EditForm = ({data, setData, setFormChanged, id_discipline}) => {
  const classes = useStyles();
  const [elementOptions, setElementOptions] = useState([]);
  const [elementSelectOpen, setElementSelectOpen] = useState(false);
  const elementsLoading = elementSelectOpen && elementOptions.length === 0;
  const [type, setType] = useState((data && data.instance) || null);
  const [selectedOption, setSelectedOption] = useState(null);

  function customGetSelectedOption() {
    if (data.instance_element_id === null) return null;
    if (selectedOption === null) {
      elementOptions.forEach(el => {
        if (el.id === data.instance_element_id) {
          setSelectedOption(el);
        }
      });
    }
    return selectedOption;
  }

  function customSetSelectedOption(value) {
    setSelectedOption(value);
    if (value !== null) value = value.id;
    if (data && data.instance_element_id !== value)
      setFormChanged(true);
    setData({ ...data, instance_element_id: value });
  }

  useEffect(() => {

    (async () => {
      if (!data || data.instance === undefined) 
        return undefined;
      
      await API.callV2("GET", '/discipline/' + id_discipline + '/' + data.instance).then((result) => {
        if (result.success) {
          let idName;
          if (data.instance === 'test') {
            idName = 'id_test';
          } else {
            idName = 'id_lecture';
          }
          let tempData = [];
          Object.entries(result.data).map((el) => {
            tempData.push({ id: el[1][idName], label: el[1].name });
          });
          setElementOptions(tempData);
        }
      });
    })();

  }, [elementsLoading, id_discipline,type]);

  useEffect(() => {
    if (data && data.instance !== type) {
      setType(data.instance);
    }
  }, [data, type]);

  useEffect(() => {
    if (!elementSelectOpen) {
      setElementOptions([]);
    }
  }, [elementSelectOpen]);

  return (<>
    <TextField
      variant="outlined"
      label="Тип теста"
      select
      margin="normal"
      value={(data && data.instance) || null}
      onChange={(e) => {
        if (data && data.instance !== e) {
          setFormChanged(true);
          customSetSelectedOption(null);
          // setData({ ...data, instance_element_id: null });
        }
        setData({ ...data, instance: e.target.value });
      }}
    >
        <MenuItem value={'test'}>Тест</MenuItem>
        <MenuItem value={'lecture'}>Лекция</MenuItem>
    </TextField>
    {((data && data.instance) || null) === null ? (
      <TextField
        variant="outlined"
        label="ID теста/лекции"
        margin="normal"
        disabled
        value={(data && data.instance_element_id) || null}
        onChange={(e) => {
          if (data && data.instance_element_id !== e) {
            setFormChanged(true);
          }
          setData({ ...data, instance_element_id: e.target.value });
        }}
      />
    ) : (<>
      <Autocomplete
        value={ customGetSelectedOption(selectedOption) }
        onChange={(event, value) => {
          customSetSelectedOption(value);
        }}
        autoHighlight
        open={elementSelectOpen}
        onOpen={() => setElementSelectOpen(true)}
        onClose={() => setElementSelectOpen(false)}
        getOptionSelected={(option, value) => option === value}
        getOptionLabel={(option) => "(ID"+option.id+") "+option.label}
        renderOption={(option) => (<>(ID{option.id}) {option.label}</>)}
        options={elementOptions}          
        loading={elementsLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Выберите тест/лекцию"
            variant="outlined"
            style={{
              marginTop: 15,
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {elementsLoading && (
                    <CircularProgress color="inherit" size={20} />
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </>)}
    <TextField
      variant="outlined"
      label="Порядок"
      fullWidth
      margin="normal"
      type={"number"}
      value={(data && data.order) || null}
      onChange={(e) => {
        if (data && data.order !== e)
          setFormChanged(true);
        setData({ ...data, order: e.target.value });
      }}
    />
    <FormControlLabel
      control={<Checkbox
        checked={(data && data.required) || null}
        onChange={(e) => {
          if (data && data.required !== e.target.checked)
            setFormChanged(true);
          setData({ ...data, required: e.target.checked });
        }}
        color="primary"
      />}
      label="Обязательное прохождение для доступа к следующим элементам программы"
    />    
  </>);
}

export default EditForm;
