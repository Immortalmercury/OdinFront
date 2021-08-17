import React, { useState } from 'react';
import Section from '../../../components/Section/index';
import { Paper } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import PageTitle from '../../../components/PageTitle/PageTitle';
import { Button } from '@material-ui/core';

const LecturePage = (props) => {
  const [data, setData] = useState(null);
  const discipline_id = props.match.params.id_discipline
  const lecture_id = props.match.params.lecture_id
  const route = '/discipline/' + discipline_id + '/lecture/' + lecture_id;

  return (
    <>
      <Section request={{ route }} setData={setData} debug>
        {data && (<>
          <PageTitle title={data && data.name} />
          
          <Paper elevation={3} style={{padding:20, paddingLeft:40}}>
            <div dangerouslySetInnerHTML={{__html:data.content}}/>

          </Paper>
          <Button variant="contained" color="primary" fullWidth onClick={() => {
            props.history.goBack();
          }}
          style={{marginTop:10}}
          >Назад</Button>
        </>)}
      </Section>
    </>
  );
};

export default withRouter(LecturePage);
