import React,{ useEffect, useState } from 'react';
import { TextField, Typography, MenuItem, FormLabel, FormControlLabel, Checkbox, IconButton, Grid } from '@material-ui/core';
import { Add, Cancel, Edit, Check, Delete } from '@material-ui/icons';
import SecondsPicker from '../../../components/SecondsPicker';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import useStyles from "./styles";

const EditForm = ({data, setData, setFormChanged}) => {
  const classes = useStyles();

  const Field = ({value,onChange}) => {
    const [edit, setEdit] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    if (!edit) {
      return (<div style={{display:'flex'}}>
        <TextField
          label="Вариант ответа"
          multiline
          maxRows={5}
          value={value}
          variant="outlined"
          fullWidth
          disabled
          onClick={()=>setEdit(true)}
        />
        <IconButton
          color={'primary'}
          onClick={()=>setEdit(true)}
        >
          <Edit fontSize="small" />
        </IconButton>
      </div>);
    } else {
      return (<>
        <Grid container spacing={1} direction="row">
          <Grid item direction="column" xs={11} style={{ display: "flex" }}>
            <CKEditor editor={ClassicEditor} 
              data={value}
              onBlur={ ( event, editor ) => {
                const editorData = editor.getData();
                onChange(editorData);
              } }
              onChange={ ( event, editor ) => {
                const editorData = editor.getData();
                setTempValue(editorData);
              } }
            />
          </Grid>
          <Grid item direction="column" xs={1} style={{ display: "flex" }}>
            <IconButton
              className={classes.B2}
              margin="normal"
              variant='outlined'
              color={'primary'}
              onClick={()=>setEdit(false)}
            >
              <Cancel fontSize="small" />
            </IconButton>
            <IconButton
              margin="normal"
              className={classes.B5}
              variant='outlined'
              color={'primary'}
              onClick={() => {
                onChange(tempValue);
                setEdit(false);
              }}
            >
              <Check fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      </>);
    }
  }

  const FieldList = ({
    value = [],
    onChange = (value) => { },
  }) => {
    const defaultValue = { text: null, isCorrect: false };
    const [fields, setFields] = useState(value);

    const makeId = (length) => {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }

    const change = (id, fieldName, value) => {
      let temp = fields;
      temp[id][fieldName] = value;
      onChange(temp);
      
      // let tempArray = [];
      // fields.forEach(el => {
      //   if (el.id === id) {
      //     el[fieldName] = value;
      //   }
      //   tempArray.push(el);
      // });
      // onChange(tempArray);

    }

    const addField = () => {
      let temp = fields;
      let id = makeId(3);
      temp[id] = defaultValue;
      temp[id].id = id;
      onChange(temp);
      // let tempField = defaultValue;
      // tempField.id = makeId(3);
      // onChange(fields.concat([tempField]));
    }

    const removeField = (id) => {
      let temp = fields;
      delete temp[id];
      onChange(temp);
      // let tempArray = [];
      // Object.values(fields)
      // fields.forEach(el => {
      //   if (el.id !== id) {
      //     tempArray.push(el);
      //   }
      // });
      // onChange(tempArray);
    }

    useEffect(() => {
      if (value !== null && value !== undefined && fields !== value) {
        setFields(value);
      }
      if (value === null || value === undefined) {
        setFields({});
      }
    }, [fields,value]);

    return (<>
      {fields !== null && Object.entries(fields).map((item) => {
        let id = item[0];
        let el = item[1];
        return (<div style={{ marginTop: 10 }}>
          <div style={{ width:'100%', display:'flex',justifyContent: 'space-between' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={el.isCorrect || null}
                  onChange={(e) => {
                    change(id, 'isCorrect', e.target.checked);
                  }}
                label=""
                color="primary"
              />}
              label="Правильный ответ"
            />
            
            <IconButton
              color={'primary'}
              className={classes.B2}
              onClick={() => removeField(id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </div>
          <Field
            value={el.text}
            onChange={(value) => {
              change(id, 'text', value);
            }}
          />
          {/* <CKEditor editor={ClassicEditor} 
            data={el.text}
              
            onChange={ ( event, editor ) => {
              const editorData = editor.getData();
              change(el.id, 'text', editorData);
              // setTempValue(data);
              // onChange(tempValue);
            } }
          /> */}
          
          
        </div>);
      })}
      <IconButton
        color={'primary'}
        onClick={() => addField()}
      >
        <Add fontSize="small" />
      </IconButton>
    </>);
  }

  return (<>
    <Grid container spacing={3} direction="row">
      <Grid item direction="column" xs={6} style={{ display: "flex" }}>
        <Typography
          className={classes.editorLabel}
        ><span className={classes.editorLabelText}>Вопрос</span></Typography>
        <CKEditor
            editor={ ClassicEditor }
            data={data?.text}
            onReady={ editor => {
                // console.log( 'Editor is ready to use!', editor );
            } }
            onChange={ ( event, editor ) => {
              const text = editor.getData();
              if (data?.text !== text)
                setFormChanged(true);
              setData({ ...data, text: text });
            } }
        />
        <TextField
          variant="outlined"
          label="Тип ответа"
          select
          margin="normal"
          value={data?.id_type || null}
          onChange={(e) => {
            if (data?.id_type !== e.target.value)
              setFormChanged(true);
            setData({ ...data, id_type: e.target.value });
          }}
        >
          <MenuItem value={1}>Один из вариантов (radio)</MenuItem>
          <MenuItem value={2}>Один или более из вариантов (checkbox)</MenuItem>
        </TextField>
        <TextField
          variant="outlined"
          label="Сложность вопроса"
          select
          margin="normal"
          value={data?.level || null}
          onChange={(e) => {
            if (data?.level !== e.target.value)
              setFormChanged(true);
            setData({ ...data, level: e.target.value });
          }}
        >
          <MenuItem value={1}>Легкий вопрос</MenuItem>
          <MenuItem value={2}>Средний вопрос</MenuItem>
          <MenuItem value={3}>Сложный вопрос</MenuItem>
        </TextField>
        <SecondsPicker
          views={["minutes", "seconds"]}
          format="mm:ss"
          label="Ограничение времени ( минуты : секунды ) ( 0 - неограничено )"
          value={(data?.time) || null}
          onChange={(e) => {
            if (data?.time !== e)
              setFormChanged(true);
            setData({ ...data, time: e });
          }}
        />
        <TextField
          variant="outlined"
          label="Вес правильного ответа (баллы), например: 5"
          fullWidth
          helperText={'Придерживайтесь какого-то определенного диапазона, чтобы не создать "супер-вопрос"'}
          type="number"
          margin="normal"
          value={(data?.weight) || null}
          onChange={(e) => {
            if (data?.weight !== e)
              setFormChanged(true);
            setData({ ...data, weight: e.target.value });
          }}
        />
        <FormControlLabel
          control={<Checkbox
            checked={(data?.required)|| null}
            onChange={(e) => {
              if (data?.required !== e.target.checked)
                setFormChanged(true);
              setData({...data, required: e.target.checked});
            }}
            color="primary"
          />}
          label="На этот вопрос нужно обязательно дать правильный ответ для сдачи теста"
        />
        
      </Grid>
      <Grid item direction="column" xs={6} style={{ display: "flex" }}>
        <FormLabel component="legend">Варианты ответа</FormLabel>
        <FieldList
          value={data?.answers || {}}
          onChange={(e) => {
            if ((data?.answers) !== e)
              setFormChanged(true);
            setData({ ...data, answers: e });
            console.log(e);
          }}
        />

          {/* <form onSubmit={handleSubmit(data => console.log(data))}>
            <Controller
              control={control}
              name="ReactDatepicker"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                // <ReactDatePicker
                //   onChange={onChange}
                //   onBlur={onBlur}
                //   selected={value}
                // />
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
              )}
            />
            
            <input type="submit" />
          </form> */}
        {/* <FormControl component="fieldset" className={classes.formControl} margin="normal">
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
        </FormControl> */}
      </Grid>
    </Grid>
  </>);
}

export default EditForm;
