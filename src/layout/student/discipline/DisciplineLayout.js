import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle/PageTitle";
import API from "../../../services/API";
// import useStyles from "./styles";
import {
  // Button,
  AppBar
} from '@material-ui/core';
import LoadingPage from '../../../components/Loading/index';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import { Switch } from 'react-router-dom';
// import { Route } from 'react-router-dom';
// import { Redirect } from 'react-router-dom';
import DisciplineLabs from '../../../pages/student/DisciplineLabs/index';
import DisciplineCourse from '../../../pages/student/DisciplineCourse/index';
import DisciplineExam from '../../../pages/student/DisciplineExam/index';
import DisciplineCredit from '../../../pages/student/DisciplineCredit/index';
import DisciplineDifferentialCredit from '../../../pages/student/DisciplineDifferentialCredit/index';
import DisciplineResources from '../../../pages/student/DisciplineResources/index';
import DisciplineAbout from '../../../pages/student/DisciplineAbout/index';
import { Paper } from '@material-ui/core';
import DisciplineEduProgram from './../../../pages/student/DisciplineEduProgram/index';


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


const getData = async (discipline,setDiscipline,setLoading) => {
  await API.call({
    method: "get_student_discpline",
    discipline: discipline,
  }).then(result => {
    if (result.success) {
      console.log(result.data);
      setDiscipline(result.data);
    }
    setLoading(false);
  });
}

export default function DisciplineLayout(props) {
  // var classes = useStyles();
  const [tab, setTab] = useState(props.match.params.tab);
  // const [tab, setTab] = useState('labs');

  const [discipline, setDiscipline] = useState(null);
  const [loading, setLoading] = useState(true);
  const discipline_id = props.match.params.id_discipline;
  useEffect(() => {
      getData(discipline_id, setDiscipline,setLoading);
    return () => {
      setDiscipline(false);
      setLoading(true);
    };
  }, [discipline_id]);
  
  return (
    <>
      {loading ? (<LoadingPage/>):(<>
        <PageTitle title={discipline && discipline.description}/>
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
              <Tab value={'edu'} label="Программа обучения" {...tabProps(7)} />
              {/* <Tab value={'labs'} label="Лабораторные" {...tabProps(0)} />
              {discipline.exam_forms.indexOf("Курсовая работа") !== -1 && 
              <Tab value={'course'} label="Курсовая работа" {...tabProps(1)} />}
              {discipline.exam_forms.indexOf("Экзамен")         !== -1 && 
              <Tab value={'exam'} label="Экзамен" {...tabProps(2)} />}
              {discipline.exam_forms.indexOf("Зачет")           !== -1 && 
              <Tab value={'credit'} label="Зачет" {...tabProps(3)} />}
              {discipline.exam_forms.indexOf("Диф. зачет")      !== -1 && 
              <Tab value={'differentialCredit'} label="Диф. зачет" {...tabProps(4)} />} */}
              <Tab value={'resources'} label="Ресурсы" {...tabProps(5)} />
              <Tab value={'about'} label="Преподаватели" {...tabProps(6)} />
            </Tabs>
          </AppBar>
        </Paper>
        <TabPanel value={tab} index={'edu'}>        <DisciplineEduProgram setTab={setTab} {...props}/></TabPanel>
        <TabPanel value={tab} index={'labs'}>               <DisciplineLabs setTab={setTab} {...props}/></TabPanel>
        {discipline.exam_forms.indexOf("Курсовая работа") !== -1 &&   
        <TabPanel value={tab} index={'course'}>             <DisciplineCourse setTab={setTab} {...props} /></TabPanel>}
        {discipline.exam_forms.indexOf("Экзамен")         !== -1 &&   
        <TabPanel value={tab} index={'exam'}>               <DisciplineExam setTab={setTab} {...props}/></TabPanel>}
        {discipline.exam_forms.indexOf("Зачет")           !== -1 &&   
        <TabPanel value={tab} index={'credit'}>             <DisciplineCredit setTab={setTab} {...props}/></TabPanel>}
        {discipline.exam_forms.indexOf("Диф. зачет")      !== -1 &&   
        <TabPanel value={tab} index={'differentialCredit'}> <DisciplineDifferentialCredit setTab={setTab} {...props}/></TabPanel>}
        <TabPanel value={tab} index={'resources'}>          <DisciplineResources setTab={setTab} {...props}/></TabPanel>
        <TabPanel value={tab} index={'about'}>              <DisciplineAbout setTab={setTab} {...props}/></TabPanel>
          {/* <Switch> */}
          {/* <Route path="/app/semester/:semester_num/discipline/:id_discipline/labs" render={(props) => { setTab(props.match.params.tab); return (<DisciplineLabs/>); } } />
          <Route path="/app/semester/:semester_num/discipline/:id_discipline/course" render={(props) => { setTab(props.match.params.tab); return (<DisciplineCourse/>); } } />
          <Route path="/app/semester/:semester_num/discipline/:id_discipline/exam" render={(props) => { setTab(props.match.params.tab); return (<DisciplineExam/>); } } />
          <Route path="/app/semester/:semester_num/discipline/:id_discipline/credit" render={(props) => { setTab(props.match.params.tab); return (<DisciplineCredit/>); } } />
          <Route path="/app/semester/:semester_num/discipline/:id_discipline/differentialCredit" render={(props) => { setTab(props.match.params.tab); return (<DisciplineDifferentialCredit/>); } } />
          <Route path="/app/semester/:semester_num/discipline/:id_discipline/resources" render={(props) => { setTab(props.match.params.tab); return (<DisciplineResources/>); } } />
          <Route path="/app/semester/:semester_num/discipline/:id_discipline/about" render={(props) => { setTab(props.match.params.tab); return (<DisciplineAbout/>); } } /> */}
            {/* <Route path="/app/semester/:semester_num/discipline/:id_discipline/labs" component={DisciplineLabs} tabcallback={ setTab }/>
            <Route path="/app/semester/:semester_num/discipline/:id_discipline/course" component={DisciplineCourse} tabcallback={ setTab }/>
            <Route path="/app/semester/:semester_num/discipline/:id_discipline/exam" component={DisciplineExam} />
            <Route path="/app/semester/:semester_num/discipline/:id_discipline/credit" component={DisciplineCredit} />
            <Route path="/app/semester/:semester_num/discipline/:id_discipline/differentialCredit" component={DisciplineDifferentialCredit} />
            <Route path="/app/semester/:semester_num/discipline/:id_discipline/resources" component={DisciplineResources} />
            <Route path="/app/semester/:semester_num/discipline/:id_discipline/about" component={DisciplineAbout} /> */}
          {/* </Switch> */}
      
        {/* </div> */}
        
      </>)}
    </>
  );
}

      