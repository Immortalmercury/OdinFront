import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle/PageTitle";
// import useStyles from "./styles";
import { AppBar, Paper, Tabs, Tab } from '@material-ui/core';
import DisciplineResources from '../../../pages/student/DisciplineResources/index';
import DisciplineAbout from '../../../pages/student/DisciplineAbout/index';
import DisciplineEduProgram from './../../../pages/student/DisciplineEduProgram/index';
import Section from "../../../components/Section";
import { Helmet } from "react-helmet";
import { withRouter } from 'react-router-dom';


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

function DisciplineLayout(props) {
  // var classes = useStyles();
  const [tab, setTab] = useState(props.match.params.tab);
  const [data, setData] = useState(null);

  const discipline_id = props.match.params.id_discipline;
  const route = "/discipline/" + discipline_id;
  useEffect(() => {}, [discipline_id]);
  
  return (
    <>
      <Section noDataAllowed setData={setData} request={{route}}
      >
        <Helmet title={data && data.description}/>
        <PageTitle title={data && data.description}/>
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
              <Tab value={'edu'} label="Программа обучения" {...tabProps(7)} />
              <Tab value={'resources'} label="Ресурсы" {...tabProps(5)} />
              <Tab value={'about'} label="Преподаватели" {...tabProps(6)} />
            </Tabs>
          </AppBar>
        </Paper>
        <TabPanel value={tab} index={'edu'}>        <DisciplineEduProgram setTab={setTab} {...props}/></TabPanel>
        <TabPanel value={tab} index={'resources'}>  <DisciplineResources setTab={setTab} {...props}/></TabPanel>
        <TabPanel value={tab} index={'about'}>      <DisciplineAbout setTab={setTab} {...props} /></TabPanel>
      </Section>
    </>
  );
}

export default withRouter(DisciplineLayout);