import React from "react";
import { Route, Switch, Redirect, withRouter, } from "react-router-dom";
import classnames from "classnames";
import useStyles from "./styles";
// import Header from "./../Header/Header";

// pages
import ProfileRightBar from "./ProfileRightBar";
import Semester from '../../../pages/student/semester/Semester';
import DisciplineLayout from '../discipline/DisciplineLayout';
import LabsTimeline from '../../../pages/student/LabsTimeline/index';
import Sidebar from "./Sidebar/Sidebar";
import CoursesList from '../../../pages/student/courses/CoursesList';

function StudentLayout(props) {
  var classes = useStyles();
  return (<>
    <div className={classes.root}>
      <Sidebar history={props.history} />
      <div className={classnames(classes.content)}>
        <Switch>
          <Route exact path="/student/" render={() => <Redirect to="/student/timeline" />}/>
          <Route exact path="/student/timeline/" component={LabsTimeline} />

          <Route exact path="/student/semester/" component={Semester} />
          <Route exact path="/student/semester/:semester_num" component={Semester} />
          <Route exact path="/student/semester/:semester_num/discipline/:id_discipline"
              render={(props) => <Redirect to={'./' + props.match.params.id_discipline + "/labs"} />} />
          <Route path="/student/semester/:semester_num/discipline/:id_discipline/:tab" component={DisciplineLayout} />

          <Route exact path="/student/courses/" component={CoursesList} />
        </Switch>
      </div>
      <ProfileRightBar />
    </div>
  </>);
}

export default withRouter(StudentLayout);
