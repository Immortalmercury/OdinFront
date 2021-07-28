import React, { useState } from 'react';
import useStyles from "./styles";
import {Card,CardContent,Switch,FormControlLabel,FormGroup,AppBar,Toolbar,Typography,CardMedia,Drawer} from '@material-ui/core';
import { SupervisedUserCircle,Email,PermIdentity,AccountCircle } from '@material-ui/icons';
import API from '../../../../services/API';
import { useEffect } from 'react';
import { useLayoutDispatch, useLayoutState } from '../../../../context/LayoutContext';
import DisabledEditableTextfield from './../../../../components/DisabledEditableTextfield';
import DisabledEditablePassword from './../../../../components/DisabledEditablePassword';

export default function ProfileRightBar() {
  const classes = useStyles();

  var layoutState = useLayoutState();
  var dispatch = useLayoutDispatch();

  const [emailNotify, setEmailNotify] = useState(false);
  const [appNotify, setAppNotify] = useState(true);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    await API.call({
      method: "get_full_user_data",
    }).then((result) => {
      if (result.success) {
        console.log(result.data);
        setData(result.data);
        setAppNotify(result.data.notify_via_app === 1);
        setEmailNotify(result.data.notify_via_email === 1);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (layoutState.isProfileOpened===true)
    getData();
    return () => {
      setData(false);
      setLoading(true);
    };
  }, [layoutState.isProfileOpened]);

  return (
    <>
      <Drawer
        anchor='right'
        type='persistent'
        open={layoutState.isProfileOpened}
        onClose={(e) => {dispatch({type:"CLOSE_PROFILE"})}}
        classes={{
          paper: classes.paper,
          
        }}
        style={{ minHeight:'100%',height: 'auto', }}
      >
      
        <AppBar position="static" color={'inherit'} >
          <Toolbar className={classes.root}>
              <SupervisedUserCircle className={classes.menuButton}/>
            <Typography variant="h6" className={classes.title}>
              Профиль
            </Typography>
          </Toolbar>
        </AppBar>
        <Card style={{display: 'flex',height: 300,width: '90%',marginTop:15,}}>
          <div style={{display: 'flex',flexDirection: 'column',width: '53%',}}>
            <CardContent style={{flex: '1 0 auto',}}>
              <Typography component="h3" variant="h3">Зайцев Олег</Typography>
              <Typography variant="subtitle1" color="textSecondary">4 курс</Typography>
              <Typography variant="subtitle1" color="textSecondary">группа 12001701</Typography>
            </CardContent>
            <CardContent style={{ paddingBottom: 5 }}>
              <Typography variant="h6" style={{ marginBottom: 10 }}>Уведомления</Typography>
              <FormGroup aria-label="position" row>
                <FormControlLabel 
                  control={
                    <Switch
                      checked={emailNotify}
                      onClick={(e) => setEmailNotify(!emailNotify)}
                      color="primary"
                      classes={{root: classes.switchRoot,switchBase: classes.switchBase,}}
                    />
                  }
                  label="По эл.почте"
                  labelPlacement="start"
                  className={classes.switchLabel}
                />
              </FormGroup>
              <FormGroup aria-label="position" row>
                <FormControlLabel 
                  control={
                    <Switch
                      checked={appNotify}
                      onClick={(e) => setAppNotify(!appNotify)}
                      color="primary"
                      classes={{
                        root: classes.switchRoot,
                        switchBase: classes.switchBase,
                      }}
                    />
                  }
                  label="В приложении"
                  labelPlacement="start"
                  className={classes.switchLabel}
                />
              </FormGroup>
            </CardContent>
          </div>
          <CardMedia style={{width: '48%',}} image={data? data.photo:''} title="User Photo"/>
        </Card>
        <Card style={{display: 'flex',flexDirection: 'column',width: '90%',margin: '15px 0px',padding: '15px 0px',}}>
          <CardContent style={{ paddingBottom: 5 }}>
            <Typography variant="h6" className={classes.title} style={{ paddingBottom: 15 }}>Аутентификация</Typography>
          {!loading && (<>
            <DisabledEditableTextfield label="Login" value={data? data.login:'...'} icon={(<AccountCircle/>)}/>
              <DisabledEditablePassword />
              </>)}
          </CardContent>
        </Card>
        <Card style={{display: 'flex',flexDirection: 'column',width: '90%',margin: '15px 0px',padding: '15px 0px',}}>
          <CardContent style={{ paddingBottom: 5 }}>
            <Typography variant="h6" className={classes.title} style={{ paddingBottom: 15 }}>Персональные данные</Typography>
            {!loading && (<>
              <DisabledEditableTextfield 
              label="Email" 
              value={data? data.email:'...'} 
              icon={(<Email/>)}
            />
            <DisabledEditableTextfield 
              label="Фамилия" 
              value={data? data.s_name:'...'} 
              icon={(<PermIdentity/>)}
            />
            <DisabledEditableTextfield 
              label="Имя" 
              value={data? data.f_name:'...'} 
              icon={(<div style={{ width: 32 }} />)}
            />
            <DisabledEditableTextfield 
              label="Отчество" 
              value={data.fth_name? data.fth_name:'Нет отчества'} 
              icon={(<div style={{ width: 32 }} />)}
            />    
            </>)}
                     
          </CardContent>
        </Card>
      </Drawer>
    </>
  );
}
