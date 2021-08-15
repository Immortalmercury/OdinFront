import React from 'react';
import { Button } from '@material-ui/core';
import useStyles from "./styles";
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';

const WeUseCookieMessage = () => {
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(['acceptedCookie']);
  useEffect(() => {
  }, [cookies]);
  if (cookies.acceptedCookie === 'accepted') {
    return (<></>);
  }
  return (<>
    <div className={classes.wrap}>
      <div className={classes.message}>
        На этом ресурсе используются файлы Cookie, для поддержания работоспособности ресурса и обеспечения вашей безопасности на ресурсе.
        Продолжая использовать этот ресурс или нажимая на кнопку "Соглашаюсь" вы соглашаетесь с &nbsp;
        <a href="https://api.aucfpls.ru/storage/documents/cookie-policy.pdf" target="blank" className={classes.messageLink}>политикой использования файлов Cookie</a>.
      </div>
      <Button variant="contained" fullWidth margin="normal" style={{ marginTop: 7 }}
        onClick={() => {
          setCookie('acceptedCookie', 'accepted', { path: '/' });
        }}
      >
        Соглашаюсь
      </Button>
    </div>
  </>);
}

export default WeUseCookieMessage;
