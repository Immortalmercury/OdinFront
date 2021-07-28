/* eslint-disable array-callback-return */
import React,{ useState, useEffect } from 'react';
import { Grid, IconButton, Button } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import API from '../../../../services/API';
import LoadingPage from '../../../../components/Loading';
import { AttachFile, Info } from '@material-ui/icons';
import useStyles from "./styles";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';
import { Fab } from '@material-ui/core';

//// const monthA = ' января , февраля , марта , апреля , мая , июня , июля , августа , сентября , октября , ноября , декабря '.split(',');
//// const Statuses = 'Ожидает проверки,Оценено,Ответ ожидает проверки'.split(',');



const convertColumns = (data) => {
  let cols = [];
  cols.push({
    name: "name",
    label: "Студент",
    options: {
      filter: true,
      sort: true,
    }
  });
  if (data.labs !== null) {
    for (let index = 0; index < data.labs.length; index++) {
      const el = data.labs[index];
      cols.push({
        name: "lab"+el.id_lab,
        label: 'ЛР. '+(index+1) + ' (ID' + el.id_lab+')',
        options: {
          filter: false,
          sort: false,
        }
      });
    }
  }
  cols.push({
    name: "avgmark",
    label: "Средняя оценка",
    options: {
      filter: false,
      sort: true,
    }
  });
  return cols;
}

const convertData = (data, classes, openDialog,setDialogData) => {
  let newData = [];
  if (data !== null && data.students !== undefined){
    for (let indexstudent = 0; indexstudent < data.students.length; indexstudent++) {
      const el = data.students[indexstudent];
      if (el === undefined) continue;
      let lab_status = [];
      let marks = [];
      for (let index = 0; index < data.labs.length; index++) {
        let has_mark = false;
        data.labs[index].complete_labs.map((answer, Aindex) => {
          if (answer.id_student === el.id_user) {
            switch (answer.status) {
              case 1:
                lab_status.push(
                  <IconButton size='small' className={classes.NewStatusButton}
                    onClick={() => {
                      setDialogData({
                        ...answer,
                        name: el.s_name + ' ' + el.f_name[0] + '.' + (el.fth_name!==null ? el.fth_name[0] + '.':''),
                        lab: data.labs[index].description,
                        id_student: el.id_user,
                        deadline: data.labs[index].deadline,
                        labIndex: index,
                        userIndex: indexstudent,
                        answerIndex: Aindex,
                      });
                      openDialog();
                    }}>
                    <Info />
                  </IconButton>
                );
                has_mark = true;
                break;
            
              case 2:
                if (answer.mark !== null) {
                  lab_status.push(answer.mark);
                  marks.push(answer.mark);
                  has_mark = true;
                }
                break;
            
              case 3:
                if (answer.mark !== null) {
                  lab_status.push(
                    
                    <IconButton size='small' className={classes.ReloadStatusButton}
                    onClick={() => {
                      setDialogData({
                        ...answer,
                        name: el.s_name + ' ' + el.f_name[0] + '.' + (el.fth_name!==null ? el.fth_name[0] + '.':''),
                        lab: data.labs[index].description,
                        deadline: data.labs[index].deadline,
                      });
                      openDialog();
                    }}>
                      <div style={{ display: "flex", alignItems: 'center' }}>
                        <span>
                          {answer.mark}
                        </span>
                        <Info />
                      </div>
                    </IconButton>
                  );
                  marks.push(answer.mark);
                  has_mark = true;
                }
                break;
            
              default:
                lab_status.push('-');
                break;
            }
          }
        })
        if (!has_mark) {
          lab_status.push('-');
        }
      }
      let avg = 0;
      let count = 0;
      marks.map(i => { avg = avg + i; count++; });
      if (count > 0) {
        avg = parseFloat(avg / count).toFixed(2);
      } else {
        avg = '-';
      }
      newData.push([
        el.s_name + ' ' + el.f_name[0] + '.' + (el.fth_name!==null ? el.fth_name[0] + '.':''),
        ...lab_status,
        avg
      ]);
    }
  }
  console.log(newData);
  return newData;
  
}
 
const getData = async (id_discipline,id_group,setData,setLoading) => {
  await API.call({
    method: "lab_in_group",
    discipline: id_discipline,
    group: id_group,
  }).then(result => {
    if (result.success) {
      console.clear();
      console.log(result.data);
      setData(result.data);
    }
    setLoading(false);
  });
}

const setMarkLab = async (id_lab,id_student,mark,comment = '') => {
  await API.call({
    method: "mark_for_lab",
    id_lab,
    id_student,
    mark,
    comment
  }).then(result => {
    if (result.success) {
      console.clear();
      console.log(result.data);
    }
  });
}

const DisciplineTotal = (props) => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const id_discipline = props.match.params.id_discipline;
  const id_group = props.match.params.id_group;
  const [loading, setLoading] = useState(true);
  const [rerender, setRerender] = useState(false);

    useEffect(() => {
        getData(id_discipline,id_group,setData,setLoading);
      return () => {
        setData(null);
        setLoading(true);
        setRerender(false);
      };
    }, [id_discipline, id_group, rerender]);

  const [open, setOpen] = React.useState(false);
  const [dialogData, setDialogData] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      { loading ? (<LoadingPage />) : (<>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="xs" scroll="body">
          <DialogTitle id="form-dialog-title">{dialogData&& dialogData.lab}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <Typography variant="h6">
                  Выполнил: {dialogData&& dialogData.name}
                </Typography>
                </Grid>
                <Grid item xs={12}>
                <Typography variant="h6">
                  Ответ: {dialogData && <Button variant="outlined" color="primary" size="small"><AttachFile/>Скачать файл</Button>}
                </Typography>
                </Grid>
                <Grid item xs={12}>
                <Typography variant="h6">
                  Дедлайн: {dialogData && dialogData.complete_date}
                </Typography>
                </Grid>
                <Grid item xs={12}>
                <Typography variant="h6">
                  Сдано: {dialogData && dialogData.deadline}
                </Typography>
                </Grid>
            </Grid>

          </DialogContent>
            <DialogActions>
            <Typography variant="h5">

            Оценить:
            </Typography>
            <Fab className={classes.B2}
              onClick={() => {
                setMarkLab(dialogData.id_lab, dialogData.id_student, 2);
                // setData(...data,data.labs[dialogData.labIndex].)
                // getData(id_discipline, id_group, setData, setLoading);
                // setData(null);
                setRerender(true);
                handleClose();
              }}
            >2</Fab>
            <Fab className={classes.B3}
              onClick={() => {
                setMarkLab(dialogData.id_lab, dialogData.id_student, 3);
                // getData(id_discipline,id_group,setData,setLoading);
                setRerender(true);
                handleClose();
              }}
            >3</Fab>
            <Fab className={classes.B4}
              onClick={() => {
                setMarkLab(dialogData.id_lab, dialogData.id_student, 4);
                // getData(id_discipline,id_group,setData,setLoading);
                setRerender(true);
                handleClose();
              }}
            >4</Fab>
            <Fab className={classes.B5}
              onClick={() => {
                setMarkLab(dialogData.id_lab, dialogData.id_student, 5);
                // getData(id_discipline, id_group, setData, setLoading);
                setRerender(true);
                handleClose();
              }}
            >5</Fab>
        </DialogActions>
        </Dialog>
          <Grid container spacing={4} style={{ paddingTop: 10 }}>
            <Grid item xs={12}>
              <MUIDataTable 
                title="По Лабораторным работам"
                data={!loading&&data && convertData(data,classes,handleClickOpen,setDialogData)}
                columns={!loading&&data && convertColumns(data)}
                options={{
                  download:false,
                  draggable:false,
                  filter:false,
                  print: false,
                  selectableRowsHideCheckboxes: true,
                  selectableRowsHeader: false,
                  textLabels: {
                    body: {
                      noMatch: "Лабораторных работ нет",
                      toolTip: "Сортировать",
                      columnHeaderTooltip: column => `Сортировать ${column.label}`
                    },
                    pagination: {
                      next: "Следующая страница",
                      previous: "Предыдущая страница",
                      rowsPerPage: "Показывать по:",
                      displayRows: "из",
                    },
                    toolbar: {
                      search: "Поиск",
                      downloadCsv: "Загрузить CSV",
                      print: "Распечатать",
                      viewColumns: "Отображать столбцы",
                      filterTable: "Фильтрация данных",
                    },
                    filter: {
                      all: "Все",
                      title: "Фильтры",
                      reset: "Сбросить",
                    },
                    viewColumns: {
                      title: "Показывать только",
                      titleAria: "Показать/Скрыть столбцы",
                    },
                    selectedRows: {
                      text: "строк выборано",
                      delete: "Удалить",
                      deleteAria: "Удалить выбранные строки",
                    },
                  }
                }}
              />
            </Grid>
        </Grid>
        
      </>)}
    </>
  );
};

export default DisciplineTotal;
