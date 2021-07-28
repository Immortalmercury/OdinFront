import React from "react";
import { Route, Switch, Redirect, withRouter, } from "react-router-dom";
import classnames from "classnames";
import useStyles from "./styles";
import Menu from "./Sidebar/Sidebar";
// pages
import CurrentDisciplines from '../../../pages/teacher/CurrentDisciplines/CurrentDisciplines';
import DisciplineGroupLayout from './../DisciplineLayout/DisciplineGroupLayout';
import Groups from '../../../pages/teacher/Groups/index';
import Users from '../../../pages/teacher/Users/index';
import MyDisciplines from '../../../pages/teacher/MyDisciplines/index';
import DisciplineConfigLayout from "../../../pages/teacher/DisciplineConfig/DisciplineConfigLayout";
import Profile from '../../../pages/teacher/Profile/index';
import AllDisciplines from "../../../pages/teacher/AllDisciplines";

function AdminLayout(props) {
  var classes = useStyles();
  return (<>
    <div className={classes.root}>
      <Menu history={props.history} />
      <div className={classnames(classes.content)}>
        <Switch>
          <Route exact path="/teacher/profile" component={Profile} />
          <Route exact path="/teacher" render={() => <Redirect to="/teacher/current" />} />
          <Route exact path="/teacher/current" component={CurrentDisciplines} />
          <Route exact path="/teacher/my_disciplines" component={MyDisciplines} />
          <Route exact path="/teacher/discipline/:id_discipline" component={DisciplineConfigLayout} />
          <Route exact path="/teacher/discipline/:id_discipline/group/:id_group" component={DisciplineGroupLayout} />
          <Route exact path="/teacher/groups" component={Groups} />
          <Route exact path="/teacher/users" component={Users} />
          <Route exact path="/teacher/all_disciplines" component={AllDisciplines} />
        </Switch>
      </div>
    </div>
  </>);
}

export default withRouter(AdminLayout);
