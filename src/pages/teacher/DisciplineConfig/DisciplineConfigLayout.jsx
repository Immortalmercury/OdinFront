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
import DisciplineEduConfig from './DisciplineEduConfig/index';
import DisciplineLecturesConfig from './DisciplineLecturesConfig/index';
import DisciplineTestsConfig from './DisciplineTestsConfig/index';
import { useUserState } from "../../../context/UserContext";
import { Helmet } from 'react-helmet';

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
  const [data, setData] = useState(null);
  const urlTab = props.match.params.tab;
  const [tab, setTab] = useState(null);
  const id_discipline = props.match.params.id_discipline;
  const [loading, setLoading] = useState(true);

  function customSetTab(value) {
    setTab(value);
    props.history.push('/teacher/discipline/' + id_discipline + "/" + value);
  }

  useEffect(() => {
    if (urlTab !== null && urlTab !== undefined) {
      setTab(urlTab);
    } else {
      customSetTab('edu');
    }
    return (() => {
      setTab(null);
    });
  }, [urlTab]);

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

  var { role } = useUserState();
  return (<>
      <Helmet
        titleTemplate={"%s - " + (loading&&!data ? 'Загрузка' : data.description+" (Конфигурации) - ") +
          (role === 'teacher' ? "Преподаватель":"Администратор") +
          " - СДО АУЦ ФПЛС"}
      />
      <Header history={props.history} title={loading&&!data ? 'Загрузка' : data.description+" (Конфигурации)"} />
      {loading ? (<LoadingPage />) : (<>
        
        <Paper style={{marginBottom:10}}>
          <AppBar position="static" color="transparent">
            <Tabs
              value={tab}
              onChange={(e, newValue) => {
                customSetTab(newValue);
              }}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {/* <Tab value={'labs'} label="Практические" {...tabProps(0)} /> */}
              <Tab value={'edu'} label="Учебная программа" {...tabProps(1)} />
              <Tab value={'lectures'} label="Лекции" {...tabProps(2)} />
              <Tab value={'tests'} label="Тесты" {...tabProps(2)} />
              <Tab value={'teachers'} label="Преподаватели" {...tabProps(6)} />
              {/* <Tab value={'groups'} label="Группы" {...tabProps(7)} /> */}
              <Tab value={'resources'} label="Ресурсы" {...tabProps(5)} />
            </Tabs>
          </AppBar>
        </Paper>
          <TabPanel value={tab} index={'edu'}>          <DisciplineEduConfig {...props}/></TabPanel>
          <TabPanel value={tab} index={'lectures'}>     <DisciplineLecturesConfig {...props}/></TabPanel>
          <TabPanel value={tab} index={'tests'}>        <DisciplineTestsConfig {...props}/></TabPanel>
          <TabPanel value={tab} index={'groups'}>       <DisciplineGroupsConfig {...props}/></TabPanel>
          <TabPanel value={tab} index={'teachers'}>     <DisciplineMainConfigs {...props} updateExamForms={ updateExamForms }/></TabPanel>
          <TabPanel value={tab} index={'labs'}>         <DisciplineLabsConfig {...props}/></TabPanel>
          <TabPanel value={tab} index={'resources'}>    <DisciplineResources {...props}/></TabPanel>
      </>)}
    </>
  );
}