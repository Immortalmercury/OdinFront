import { Tooltip } from '@material-ui/core';
import { Typography, IconButton } from '@material-ui/core';
import { Avatar } from '@material-ui/core';
import { Edit, Email } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import Centered from '../../../components/Centered';
import Section from './../../../components/Section/index';
import { Button } from '@material-ui/core';

const DisciplineAbout = (props) => {
  const [update, setUpdate] = useState(null);
  const [data, setData] = useState(null);

  return (
    <>
      <Section
        requestData={{
          method: 'get_teachers',
          discipline: props.match.params.id_discipline,
        }}
        setData={setData}
        update={update}
        setUpdate={setUpdate}
        debug
      >
        {data && (<>
          <Centered style={{minHeight:400,alignItems:"flex-start",padding:50,flexDirection:"row", flexWrap:"wrap",justifyItems:'flex-start'}}>
            {data.map((el) =>
              <div style={{display:'flex',alignItems:'center',marginBottom:40,}}>
                <Avatar src={el.photo} style={{ margin: 10, marginLeft:40, width: 150, height: 150 }} />
                <div style={{display:'flex',flexDirection:"column",alignItems:'center', marginLeft:0, justifyItems:'center',minWidth: 350}}>
                <Typography variant="h4" style={{marginBottom: 20}}>
                  {el.s_name +
                  " " +
                  (el.f_name + " ") +
                  (el.fth_name!==null ? el.fth_name:'')}
                </Typography>
                <Tooltip arrow position="top" title="Написать по E-mail">
                  <Button
                    color={"primary"}
                    variant="contained"
                    startIcon={<Email />}
                    onClick={() => {
                      window.location.href = "mailto:"+el.email;
                    }}
                  >
                  Отправить Email
                </Button>
                </Tooltip>
                </div>
              </div>
            )}
          </Centered>
       </>)} 
      </Section>
    </>
  );
};

export default DisciplineAbout;
