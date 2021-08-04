import React, { useState, useEffect } from "react";
import API from "../../../services/API";
import LoadingPage from '../../../components/Loading/index';
import Header from '../../../components/Header/Header';
import { AppBar, Paper } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CourseDisciplinesConfig from "./CourseDisciplinesConfig/index";
import CourseStudentsConfig from './CourseStudentsConfig/index';

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

const getData = async (id_course,setData,setLoading) => {
  await API.call({
    method: "courseData",
    course: id_course,
  }).then(result => {
    if (result.success) {
      console.log(result.data);
      setData(result.data);
    }
    setLoading(false);
  });
}

export default function CourseConfigLayout(props) {
  const [tab, setTab] = useState('main');
  const [data, setData] = useState(null);
  const id_course = props.match.params.id_course;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      getData(id_course,setData,setLoading);
    return () => {
      setData(null);
      setLoading(true);
    };
  }, [id_course]);

  return (
    <>
      <Header history={props.history} title={loading&&!data ? 'Загрузка' : "Курс: "+data.name+" (Конфигурации)"} />
      {loading ? (<LoadingPage />) : (<>
        <Paper>
          <AppBar position="static" color="transparent" style={{marginBottom:10}}>
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
              <Tab value={'main'} label="Список дисциплин" {...tabProps(7)} />
              <Tab value={'students'} label="Студенты" {...tabProps(7)} />
            </Tabs>
          </AppBar>
        </Paper>
          <TabPanel value={tab} index={'main'}>             <CourseDisciplinesConfig {...props}/></TabPanel>
          <TabPanel value={tab} index={'students'}>             <CourseStudentsConfig {...props}/></TabPanel>
      </>)}
    </>
  );
}