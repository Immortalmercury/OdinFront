/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  Card,
  CardContent,
  Typography,
  Paper,
  Drawer,
  IconButton,
  List,
} from "@material-ui/core";
import {
  Filter1,
  Filter2,
  Filter3,
  Filter4,
  Filter5,
  Filter6,
  Filter7,
  Filter8,
  Filter9,
  Filter9Plus,
  ExitToApp,
  Notifications,
  LibraryBooks,
} from "@material-ui/icons";
import TimelineIcon from "@material-ui/icons/Timeline";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
// import { useUserDispatch, logoutUser } from "./../../context/UserContext";

// styles
import useStyles from "./styles";

// components 
import SidebarLink from "./components/SidebarLink/SidebarLink";

// context
// import { useLayoutDispatch } from "./../../context/LayoutContext";
import { Divider } from "@material-ui/core";
// import Logo from "./../Logo/index";
import { Avatar } from "@material-ui/core";
import { Badge } from "@material-ui/core";
// import API from "../../services/API";
// import LoadingPage from "./../Loading/index";
// import Notification from "./../Notification/Notification";
import CloseIcon from "@material-ui/icons/Close";
import { logoutUser, useUserDispatch } from "../../../../context/UserContext";
import { useLayoutDispatch } from "../../../../context/LayoutContext";
import API from "../../../../services/API";
// import Notification from './../../../../components/Notification/Notification';
import Logo from './../../../../components/Logo/index';
import LoadingPage from "../../../../components/Loading";
import Notification from './../../../../components/Notification/Notification';

function SemesterIcon(num) {
  switch (num) {
    case 1:
      return <Filter1 />;
    case 2:
      return <Filter2 />;
    case 3:
      return <Filter3 />;
    case 4:
      return <Filter4 />;
    case 5:
      return <Filter5 />;
    case 6:
      return <Filter6 />;
    case 7:
      return <Filter7 />;
    case 8:
      return <Filter8 />;
    case 9:
      return <Filter9 />;
    default:
      return <Filter9Plus />;
  }
}

function Sidebar({ location, history }) {
  var classes = useStyles();
  var userDispatch = useUserDispatch();
  var layoutDispatch = useLayoutDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [menu, setMenu] = useState(null);

  const makeMenu = (items) => {
    let menu = [
      {
        id: 0,
        label: "Таймлайн",
        link: "/student/timeline",
        icon: <TimelineIcon />,
      },
      {
        id: 10,
        label: "Курсы",
        link: "/student/courses",
        icon: <LibraryBooks />,
      },
    ];
    items.map((el) => {
      menu.push({
        id: el,
        label: el + " семестр",
        link: "/student/semester/" + el,
        icon: SemesterIcon(el),
      });
    });
    setMenu(menu);
  };

  const getData = async () => {
    await API.call({
      method: "get_sidebar_data",
    }).then((result) => {
      if (result.success) {
        console.log(result.data);
        setData(result.data);
        makeMenu(result.data.menu);
      }
      setLoading(false);
      getNotifications();
    });
  };

  useEffect(() => {
    getData();
    return () => {
      setData(false);
      setLoading(true);
    };
  }, []);

  const timer = React.useRef();

  // ! Включает(true)/Выключает(false) получение новых уведомлений
  const [timerRuns, setTimerRuns] = useState(false);
  const [notifications, setNotifications] = useState(null);

  const appendNotification = (newValues) => {
    let newData = newValues;
    Object.entries(notifications).map((e) => {
      newData.push(e[1]);
    });
    setNotifications(newData);
  };

  function handleNotificationCall(text) {
    var componentProps = {
      type: "feedback",
      message: text,
      variant: "contained",
      color: "primary",
    };
    sendNotification(componentProps, {
      type: "info",
      position: toast.POSITION.TOP_RIGHT,
      progressClassName: classes.progress,
      className: classes.notification,
      autoClose: 5000,
      hideProgressBar: true,
      bodyClassName: classes.notificationBody,
    });
  }

  const getNotifications = async () => {
    await API.call({
      method: "get_user_notifications",
    }).then((result) => {
      if (result.success) {
        setNotifications(result.data);
      }
      setTimerRuns(false);
    });
  };
  const updateNotifications = () => {
    timer.current = window.setTimeout(async () => {
      await API.call({
        method: "get_new_user_notifications",
      }).then((result) => {
        if (result.success) {
          if (result.data.length > 0) {
            console.log("received Notifications: " + result.data.length);

            result.data.map((el) => {
              handleNotificationCall(el.text);
            });
            appendNotification(result.data);
          } else {
            // console.log("No new Notifications, updateTime: "+new Date().toLocaleString());
          }
        }
      });
      setTimerRuns(true);
    }, 10000);
  };

  useEffect(() => {
    if (!timerRuns) {
      updateNotifications();
    }
    return () => {
      clearTimeout(timer.current);
      setTimerRuns(false);
    };
  }, [timerRuns]);

  function sendNotification(componentProps, options) {
    return toast(
      <Notification
        {...componentProps}
        className={classes.notificationComponent}
      />,
      options,
    );
  }

  function CloseButton({ closeToast, className }) {
    return <CloseIcon className={className} onClick={closeToast} />;
  }

  return (
    <>
      <ToastContainer
        className={classes.toastsContainer}
        closeButton={
          <CloseButton className={classes.notificationCloseButton} />
        }
        closeOnClick={false}
        progressClassName={classes.notificationProgress}
      />
      <Card
        style={{
          width: "240px",
          position: "fixed",
          top: 0,
          zIndex: 1001,
          height: 138,
          left: 0,
        }}
      >
        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Logo type="simple" style={{ width: "100%", padding: 0 }} />
        </CardContent>
      </Card>
      <Drawer
        variant={"permanent"}
        className={classNames(classes.drawer)}
        classes={{
          paper: classes.drawerPaper,
        }}
        open={true}
      >
        <Paper elevation={0}>
          {loading ? (
            <LoadingPage />
          ) : (
            <>
              <List className={classes.sidebarList}>
                {menu !== null &&
                  menu.map((link) => (
                    <SidebarLink
                      key={link.id}
                      location={location}
                      isSidebarOpened={true}
                      {...link}
                    />
                  ))}
              </List>
            </>
          )}
        </Paper>
      </Drawer>
      <Card
        style={{
          height: 150,
          width: 239,
          marginTop: 15,
          position: "fixed",
          bottom: 0,
          left: 0,
        }}
      >
        <Divider />
        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {!loading && (
            <>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <IconButton
                  style={{ transform: "rotate(180deg)", color: "red" }}
                  className={classes.profile_btn}
                  onClick={() => logoutUser(userDispatch, history)}
                >
                  <ExitToApp />
                </IconButton>
                <IconButton
                  onClick={(e) => layoutDispatch({ type: "TOGGLE_PROFILE" })}
                >
                  <Avatar
                    src={data&& data.user&& data.user.photo&& data.user.photo}
                    style={{ width: 70, height: 70, cursor: "pointer" }}
                    className={classes.profile_btn}
                  />
                </IconButton>
                <IconButton
                  // disabled
                  onClick={() =>
                    handleNotificationCall(
                      'Работа "Лабораторная работа 4" по предмету "Новые информационные технологии" была проверена. Проверил: Зууфина Валентина Максимовна. Оценка: 5',
                    )
                  }
                  color="primary"
                  className={classes.profile_btn}
                >
                  <Badge
                    // badgeContent={isNotificationsUnread ? notifications.length : null}
                    // style={{backgroundColor: '#FF9800'}}
                    // badgeContent={5}
                    color="error"
                  >
                    <Notifications />
                  </Badge>
                </IconButton>
              </div>
              <Typography variant="h6">
                {data&&data.user && data.user.s_name + " " + data.user.f_name}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default withRouter(Sidebar);
