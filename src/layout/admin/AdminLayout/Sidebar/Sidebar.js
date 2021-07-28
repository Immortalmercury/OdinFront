import React, { useEffect, useState } from "react";
import { Button, Drawer, IconButton, List } from "@material-ui/core";
import { Card, CardContent, Typography, Paper } from '@material-ui/core';

import {
  NotificationsNone as NotificationsIcon,
  FormatSize as TypographyIcon,
  FilterNone as UIElementsIcon,
  BorderAll as TableIcon,
  Filter1 as Semester1Icon,
  Filter2 as Semester2Icon,
  Filter3 as Semester3Icon,
  Filter4 as Semester4Icon,
  Filter5 as Semester5Icon,
  Filter6 as Semester6Icon,
  Filter7 as Semester7Icon,
  Filter8 as Semester8Icon,
  Filter9 as Semester9Icon,
  Filter9Plus as SemesterOtherIcon,
  ExitToApp,
  Notifications,
  Group,
  Dashboard,
  School,Layers,
  PermIdentity
} from "@material-ui/icons";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import photo from './123123.jpg'
// import { useUserDispatch, logoutUser } from "./../../context/UserContext";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";

// context
import { Divider } from "@material-ui/core";
import { Avatar } from "@material-ui/core";
import ViewListIcon from '@material-ui/icons/ViewList';
import { logoutUser, useUserDispatch, useUserState } from "../../../../context/UserContext";
import API from "../../../../services/API";
import { useLayoutDispatch } from "../../../../context/LayoutContext";
import LoadingPage from './../../../../components/Loading/index';

const structure = [
  { id: 6, label: "Текущие дисциплины", link: "/teacher/current", icon: <Dashboard /> },
  { id: 7, label: "Мои дисциплины", link: "/teacher/my_disciplines", icon: <Layers /> },
  { id: 8, label: "Группы", link: "/teacher/groups", icon: <Group /> }, 
];
const structureAdmin = [
  { id: 6, label: "Текущие дисциплины", link: "/teacher/current", icon: <Dashboard /> },
  { id: 7, label: "Мои дисциплины", link: "/teacher/my_disciplines", icon: <Layers /> },
  { id: 8, label: "Группы", link: "/teacher/groups", icon: <Group /> },
  { id: 5, type: "divider" },
  { id: 11, type: "title", label: "Администрирование" },
  { id: 9, label: "Пользователи", link: "/teacher/users", icon: <PermIdentity /> },   
  { id: 12, label: "Все дисциплины", link: "/teacher/all_disciplines", icon: <ViewListIcon /> },  
];

const getData = async (setData, setIsLoading) => {
  setIsLoading(true);
  await API.call({method: "get_user_data",}).then(result => {
    if (result.success) {
      console.log(result.data);
      setData(result.data);
    }
    setIsLoading(false);
  });
}

function Sidebar({ location, currentSemester, history }) {
  var classes = useStyles();
  var userDispatch = useUserDispatch();
  var { role } = useUserState();
  // const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    getData(setData,setLoading);
    return () => {
      setData(false);
      setLoading(true);
    };
  },[]);

  // global
  var isSidebarOpened = true;
  var layoutDispatch = useLayoutDispatch();

  return (<>
    <Card className={classes.profileCard}>
        <Divider/>
      <CardContent className={classes.profileCardContent}>
        {loading ? (<LoadingPage />) : (<>
          <div style={{ display: 'flex', width: '40%',height: '100%', alignItems: 'center', justifyContent: 'space-around' }}>


            <Avatar src={data.photo} style={{ width: 100, height: 100}}
              variant="rounded"
              className={classes.profile_btn2} />
    
          </div>
          <div style={{ display: 'flex',flexDirection: 'column', width: '60%', height: '100%', alignItems: 'center', justifyContent: 'space-around' }}>
            <Typography variant="h6">
              {
                data.s_name + ' ' +
                data.f_name[0] + '.' +
                data.fth_name[0] + '.'
              }
            </Typography>
            <Button variant="outlined" color="default" size="small" className={classes.profile_btn2}
              onClick={e => {history.push('/teacher/profile')}}
            >Профиль</Button>
            <Button variant="outlined" color="error" size="small" className={classes.exit_btn}
              onClick={() => logoutUser(userDispatch,history)}
            >Выход</Button>
          </div>
        </>)}
      </CardContent>
        
        
    </Card>
    <Drawer variant={"permanent"}
      className={classNames(classes.drawer)}
      classes={{
        paper: classes.drawerPaper,
      }}
      open={isSidebarOpened}
    >
        <List className={classes.sidebarList}>
        { 
          (role === 'teacher' ? structure:structureAdmin).map(link => (
            <SidebarLink
              key={link.id}
              location={location}
              isSidebarOpened={isSidebarOpened}
              {...link}
            />
          ))}
        </List>
    </Drawer>
  </>);

}

export default withRouter(Sidebar);
