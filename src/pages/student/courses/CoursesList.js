import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  CardActions,
  CardContent,
  Card,
  CardActionArea,
  Divider,
} from "@material-ui/core";

// styles
import useStyles from "./styles"; 

import PageTitle from "../../../components/PageTitle/PageTitle";
import { Typography } from "../../../components/Wrappers/Wrappers";
import API from "../../../services/API";
import LoadingPage from '../../../components/Loading';
import Section from '../../../components/Section/index';
import ProgressCircle from './../../../components/ProgressCircle/index';



const getData = async (semester_num,setDisciplines,setLoading) => {
  await API.call({
    method: "disciplines_by_semester",
    semester: semester_num,
  }).then(result => {
    if (result.success) {
      console.log(result.data);
      setDisciplines(result.data);
    }
    setLoading(false);
  });
}

export default function CoursesList(props) {
  var classes = useStyles();
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(null);

  return (<>
    <PageTitle title="Курсы"/>
    <Section
      setData={setData}
      update={update}
      setUpdate={setUpdate}
      requestData={{
        method: "getCourses",
      }}
      debug // ! Console log enabled
    >
      <Grid container spacing={4}>
          {data ? data.map(item => (
              <Grid item lg={4} md={4} sm={6} xs={12} key={item.id_course}>
              <Card className={classes.root} style={{ height: "100%" }}>
                <CardActionArea className={classes.CardActionAreaRoot} onClick={() => {
                  props.history.push('/student/courses/'+item.id_course)
                }}>
                      <CardContent style={{width:'100%'}} className={classes.CardContent}>
                        <div style={{width:'100%',paddingRight:15}}>
                          <Typography color="textSecondary" variant="h6">
                            {item.name}
                          </Typography>
                      <Divider style={{ marginBottom: 20 }} />
                      <Button color="primary" size="small" className={classes.CardButton} fullWidth
                        component={'div'} onClick={() => {
                          props.history.push('/student/courses/'+item.id_course)
                        }}>
                              Перейти 
                        </Button>
                        </div>
                        <div>

                        <ProgressCircle
                            size={80}
                            maxValue={100}
                            value={item.progress}
                            fontSize={22}
                            />
                        </div>
                  </CardContent>
                  </CardActionArea>
                  
              </Card>
            </Grid>
          )) : (
            <Typography color="textSecondary" gutterBottom variant="h5">
            Ничего нет
          </Typography>
          )}
            

          </Grid>
    </Section>
  </>);

  // return (
  //   <>
  //     {loading ? (<LoadingPage />) : (
  //       <>
  //         <PageTitle title="Дисциплины"/>
          // <Grid container spacing={4}>
          // {disciplines ? disciplines.map(item => (
          //     <Grid item lg={4} md={4} sm={6} xs={12} key={item.id_discipline}>
          //     <Card className={classes.root} style={{ height: "100%" }}>
          //       <CardActionArea className={classes.CardActionAreaRoot} onClick={() => {
          //         props.history.push('/student/semester/'+semester+'/discipline/'+item.id_discipline+'/labs')
          //       }}>
          //             <CardContent style={{width:'100%'}} className={classes.CardContent}>
          //               <div>
          //                 <Typography color="textSecondary" variant="h6">
          //                   {item.description}
          //                 </Typography>
          //                 <Divider style={{ marginBottom: 20 }} />
          //               </div>
          //               <div>
          //                 <Typography className={classes.pos} color="textSecondary" >
          //                   Преподаватели
          //                 </Typography>
          //                 <Typography variant="caption"  color="textSecondary" component="p" >
          //                   {item.teachers.map(teacher => teacher.s_name+' '+teacher.s_name[0]+'.'+(teacher.fth_name!==null? teacher.fth_name[0]+'. ':' ')+' ')}
          //                 </Typography>
          //               </div>
          //             </CardContent>
          //             <CardActions >
          //               <Button color="primary" size="small" component={'div'} onClick={() => {
          //                 props.history.push('/student/semester/'+semester+'/discipline/'+item.id_discipline)
          //               }}>
          //                     Перейти 
          //               </Button>
          //         </CardActions>
          //         </CardActionArea>
                  
          //     </Card>
          //   </Grid>
          // )) : (
          //   <Typography color="textSecondary" gutterBottom variant="h5">
          //   Ничего нет
          // </Typography>
          // )}
            

          // </Grid>
  //       </>
  //     )}
  //   </>
  // );
}
