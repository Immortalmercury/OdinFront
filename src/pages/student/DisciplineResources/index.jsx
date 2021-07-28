import React,{ useState, useEffect } from 'react';
import {
  Grid,
  // Badge, IconButton, Button, Divider
} from "@material-ui/core";
// import { makeStyles } from "@material-ui/styles";
import MUIDataTable from "mui-datatables";
import API from '../../../services/API';
import LoadingPage from '../../../components/Loading';
// import UploadFileButton from '../../../components/UploadFileButton/index';
import DownloadFileButton from '../../../components/Buttons/DownloadFileButton';
import {
  Archive,
  // AttachFile, Delete,
  Description,
  // GetApp, Info
} from '@material-ui/icons';
// import LabCheckDialog, { DialogProvider, useDialogDispatch } from '../../../components/LabCheckDialog';
// import TextField from '@material-ui/core/TextField';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import { Typography } from '@material-ui/core';
// import { Fab } from '@material-ui/core';
import useStyles from "./styles";

const monthA = ' января , февраля , марта , апреля , мая , июня , июля , августа , сентября , октября , ноября , декабря '.split(',');
const convertData = (data, classes) => {
  // return [];
  let newData = [];
  if (data !== null)
    for (let index = 0; index < data.length; index++) {
      const el = data[index];
      console.log(el);
      let type = null;
      switch (el.type) {
        case 1:
          type = <Archive />;
          break;
      
        case 2:
          type = <Description />;
          break;
      
        default:
          type = el.type;
          break;
      }

      if (el.updated_at === null) el.updated_at = el.created_at;
      el.updated_at = new Date(el.updated_at);
      newData.push([
        type,
        el.description,
        el.updated_at.getDate() + monthA[el.updated_at.getMonth()] + el.updated_at.getFullYear(),
        <DownloadFileButton variant="contained" color="primary" label="Скачать" filename={el.description} data={{method: "get_resource", resource: el.id_resource, }}/>
      ]);
    }
  return newData;
  
}

const getData = async (id_discipline,setData,setLoading) => {
  await API.call({
    method: "get_discipline_resources",
    discipline: id_discipline,
  }).then(result => {
    if (result.success) {
      console.clear();
      console.log(result.data);
      setData(result.data);
    }
    setLoading(false);
  });
}

const DisciplineResources = (props) => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const id_discipline = props.match.params.id_discipline;
  // const id_group = props.match.params.id_group;
  const [loading, setLoading] = useState(true);
  const [rerender, setRerender] = useState(false);

    useEffect(() => {
        getData(id_discipline,setData,setLoading);
      return () => {
        setData(null);
        setLoading(true);
        setRerender(false);
      };
    }, [id_discipline, rerender]);
  
  return (
    <>
      { loading ? (<LoadingPage />) : (<>
        <Grid container spacing={4} style={{ paddingTop: 10 }}>
            <Grid item xs={12}>
              <MUIDataTable 
                title="Список ресурсов"
                data={!loading&&data && convertData(data,classes)}
              columns={[
                "Тип","Название","Версия файла от","Действия"
              ]}
                options={{
                  download:false,
                  draggable:false,
                  filter:false,
                  print: false,
                  selectableRowsHideCheckboxes: true,
                  selectableRowsHeader: false,
                  textLabels: {
                    body: {
                      noMatch: "Ресурсов нет",
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

export default DisciplineResources;
