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
import CoursesList from '../../../pages/student/CoursesList/CoursesList';
import CoursesPage from './../../../pages/student/CoursePage/CoursesPage';
import LecturePage from "../../../pages/student/LecturePage";
import { Helmet } from 'react-helmet';

function StudentLayout(props) {
  var classes = useStyles();
  return (<>
    <Helmet
      defaultTitle={"Студент - СДО АУЦ ФПЛС"}
      titleTemplate={"%s - Студент - СДО АУЦ ФПЛС"}
    />
    <div className={classes.root}>
      <Sidebar history={props.history} />
      <div className={classnames(classes.content)}>
        <Switch>
          <Route exact path="/student/" render={() => <Redirect to="/student/courses" />}/>
          <Route exact path="/student/timeline/" component={LabsTimeline} />

          <Route exact path="/student/semester/" component={Semester} />
          <Route exact path="/student/semester/:semester_num" component={Semester} />
          <Route exact path="/student/semester/:semester_num/discipline/:id_discipline"
              render={(props) => <Redirect to={'./' + props.match.params.id_discipline + "/labs"} />} />
          <Route path="/student/semester/:semester_num/discipline/:id_discipline/:tab" component={DisciplineLayout} />

          <Route exact path="/student/courses/" component={CoursesList} />
          <Route exact path="/student/courses/:course_id" component={CoursesPage} />
          <Route path="/student/courses/:course_id/discipline/:id_discipline/lecture/:lecture_id" component={LecturePage} />
          <Route exact path="/student/courses/:course_id/discipline/:id_discipline"
              render={(props) => <Redirect to={'./' + props.match.params.id_discipline + "/labs"} />} />
          <Route path="/student/courses/:course_id/discipline/:id_discipline/:tab" component={DisciplineLayout} />
        </Switch>
      </div>
      <ProfileRightBar />
    </div>
  </>);
}

export default withRouter(StudentLayout);
