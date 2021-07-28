import React, { useState, useEffect } from "react";
// import API from "../../services/API";
// import LoadingPage from '../Loading/index';
// import Header from '../Header/Header';
import { AppBar, Button, Paper } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DisciplineLabs from './../../../pages/teacher/Discipline/DisciplineLabs/index';
import DisciplineCourse from './../../../pages/teacher/Discipline/DisciplineCourse/index';
import DisciplineExam from './../../../pages/teacher/Discipline/DisciplineExam/index';
import DisciplineCredit from './../../../pages/teacher/Discipline/DisciplineCredit/index';
import DisciplineDifferentialCredit from './../../../pages/teacher/Discipline/DisciplineDifferentialCredit/index';
import DisciplineTotal from './../../../pages/teacher/Discipline/DisciplineTotal/index';
import API from "../../../services/API";
import LoadingPage from "../../../components/Loading";
import Header from './../../../components/Header/Header';
// import DisciplineCourse from './../../../pages/student/DisciplineCourse/index';
// import DisciplineCourse from './../../../pages/teacher/Discipline/DisciplineCourse/index';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (children)}
    </div>
  );
}

function tabProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const getData = async (id_discipline,id_group,setData,setLoading) => {
  await API.call({
    method: "discipline_data",
    discipline: id_discipline,
    // group: id_group,
  }).then(result => {
    if (result.success) {
      console.log(result.data);
      setData(result.data);
    }
    setLoading(false);
  });
}

export default function DisciplineGroupLayout(props) {
  const [tab, setTab] = useState('total');
  const [data, setData] = useState(null);
  const id_discipline = props.match.params.id_discipline;
  const id_group = props.match.params.id_group;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData(id_discipline, id_group, setData, setLoading);
    return () => {
      setData(null);
      setLoading(true);
    };
  }, [id_discipline, id_group]);

  return (
    <>
      <Header history={props.history} title={loading && !data ? 'Загрузка' : data.description + ' ' + id_group}
        button={<Button color="inherit" variant="outlined" onClick={() => {
          props.history.push('/teacher/discipline/'+id_discipline)
        }}>Конфигурации дисциплины</Button>}
      />
      {loading ? (<LoadingPage />) : (<>
        
          <Paper>
          {/* <div className={classes.root}> */}
          <AppBar position="static" color="transparent">
            <Tabs
              value={tab}
              onChange={(e, newValue) => {
                setTab(newValue);
                // props.history.push('./'+newValue)
              }}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
                                                                          <Tab value={'total'} label="Сводка" {...tabProps(0)} />
                                                                          <Tab value={'labs'} label="Лабораторные" {...tabProps(0)} />
              {data&&data.exam_forms.indexOf("Курсовая работа") !== -1 && <Tab value={'course'} label="Курсовая" {...tabProps(1)} />}
              {data&&data.exam_forms.indexOf("Экзамен")         !== -1 && <Tab value={'exam'} label="Экзамен" {...tabProps(2)} />}
              {data&&data.exam_forms.indexOf("Зачет")           !== -1 && <Tab value={'credit'} label="Зачет" {...tabProps(3)} />}
              {data&&data.exam_forms.indexOf("Диф. зачет")      !== -1 && <Tab value={'differentialCredit'} label="Диф. зачет" {...tabProps(4)} />}
                                                                          {/* <Tab value={'about'} label="О дисциплине" {...tabProps(6)} /> */}
            </Tabs>
          </AppBar>
        </Paper>
          <TabPanel value={tab} index={'total'}>              <DisciplineTotal {...props}/></TabPanel>
          <TabPanel value={tab} index={'labs'}>               <DisciplineLabs {...props}/></TabPanel>
          <TabPanel value={tab} index={'course'}>             <DisciplineCourse {...props} /></TabPanel>
          <TabPanel value={tab} index={'exam'}>               <DisciplineExam {...props}/></TabPanel>
            <TabPanel value={tab} index={'credit'}>           <DisciplineCredit {...props}/></TabPanel>
          <TabPanel value={tab} index={'differentialCredit'}> <DisciplineDifferentialCredit {...props}/></TabPanel>
          {/* <TabPanel value={tab} index={'about'}>              <DisciplineAbout {...props}/></TabPanel>        */}
      
      </>)}
    </>
  );
}
