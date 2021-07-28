import React, { useState, useEffect } from "react";
import API from "../../../services/API";
import LoadingPage from '../../../components/Loading/index';
import Header from '../../../components/Header/Header';
import { AppBar, Paper } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DisciplineMainConfigs from "./DisciplineMainConfigs";
import DisciplineGroupsConfig from './DisciplineGroupsConfig/index';
import DisciplineResources from "./DisciplineResources";
import DisciplineLabsConfig from "./DisciplineLabsConfig";
import DisciplineCourse from "./DisciplineCourse";

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

const getData = async (id_discipline,setData,setLoading) => {
  await API.call({
    method: "discipline_data",
    discipline: id_discipline,
  }).then(result => {
    if (result.success) {
      console.log(result.data);
      setData(result.data);
    }
    setLoading(false);
  });
}

export default function DisciplineConfigLayout(props) {
  const [tab, setTab] = useState('groups');
  const [data, setData] = useState(null);
  const id_discipline = props.match.params.id_discipline;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      getData(id_discipline,setData,setLoading);
    return () => {
      setData(null);
      setLoading(true);
    };
  }, [id_discipline]);

  const updateExamForms = (forms) => {
    setData({...data, exam_forms:forms});
  }

  return (
    <>
      <Header history={props.history} title={loading&&!data ? 'Загрузка' : data.description+" (Конфигурации)"} />
      {loading ? (<LoadingPage />) : (<>
        
          <Paper>
          <AppBar position="static" color="transparent">
            <Tabs
              value={tab}
              onChange={(e, newValue) => {
                setTab(newValue);
              }}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
                                                                          <Tab value={'groups'} label="Группы" {...tabProps(7)} />
                                                                          <Tab value={'labs'} label="Лабораторные (Глобально)" {...tabProps(0)} />
              {data&&data.exam_forms.indexOf("Курсовая работа") !== -1 && <Tab value={'course'} label="Курсовые" {...tabProps(1)} />}
              {/* {data&&data.exam_forms.indexOf("Экзамен")         !== -1 && <Tab value={'exam'} label="Экзамен" {...tabProps(2)} />}
              {data&&data.exam_forms.indexOf("Зачет")           !== -1 && <Tab value={'credit'} label="Зачет" {...tabProps(3)} />}
              {data&&data.exam_forms.indexOf("Диф. зачет")      !== -1 && <Tab value={'differentialCredit'} label="Диф. зачет" {...tabProps(4)} />} */}
                                                                          <Tab value={'resources'} label="Ресурсы" {...tabProps(5)} />
                                                                          <Tab value={'total'} label="Конфигурации" {...tabProps(6)} />
            </Tabs>
          </AppBar>
        </Paper>
          <TabPanel value={tab} index={'groups'}>             <DisciplineGroupsConfig {...props}/></TabPanel>
        <TabPanel value={tab} index={'total'}>              <DisciplineMainConfigs {...props} updateExamForms={ updateExamForms }/></TabPanel>
          <TabPanel value={tab} index={'labs'}>               <DisciplineLabsConfig {...props}/></TabPanel>
{data&&data.exam_forms.indexOf("Курсовая работа") !== -1 &&
          <TabPanel value={tab} index={'course'}>             <DisciplineCourse {...props} /></TabPanel>}
{/* {data&&data.exam_forms.indexOf("Экзамен")         !== -1 && 
          <TabPanel value={tab} index={'exam'}>               <DisciplineExam {...props}/></TabPanel>}
{data&&data.exam_forms.indexOf("Зачет")           !== -1 && 
            <TabPanel value={tab} index={'credit'}>           <DisciplineCredit {...props}/></TabPanel>}
{data&&data.exam_forms.indexOf("Диф. зачет")      !== -1 && 
          <TabPanel value={tab} index={'differentialCredit'}> <DisciplineDifferentialCredit {...props}/></TabPanel>} */}
          <TabPanel value={tab} index={'resources'}>          <DisciplineResources {...props}/></TabPanel>
      </>)}
    </>
  );
}