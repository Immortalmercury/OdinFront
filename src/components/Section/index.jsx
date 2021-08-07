/* eslint-disable react-hooks/exhaustive-deps */
import { Paper } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import LoadingPage from "../Loading";
import { Typography } from "@material-ui/core";
import Centered from "../Centered";
import ClosedSection from "../ClosedSection";
import API from "../../services/API";
import { Button } from '@material-ui/core';

const Section = ({
  children,
  requestData,
  request,
  setData,
  update,
  setUpdate = null,
  timerDecoration = null,
  debug = false,
  noDataAllowed = false,
}) => {
  const [pageOpenedAt] = useState(new Date());
  const [opened, setOpened] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openTime, setOpenTime] = useState(null);

  const responseHandler = (result) => {
    if (result.success) {
      if (result.data !== undefined) {
        setData(result.data);
        if (result.data.allowed_after !== undefined &&result.data.allowed_after !== null && result.data.openTime === undefined) {
          setOpenTime(result.data.allowed_after);
        } else if (result.data.openTime !== undefined && result.data.openTime !== null) {
          setOpenTime(result.data.openTime);
        } else {
          setOpened(true);
        }
      } else if (noDataAllowed) {
        setData(result.data);
        setOpened(true);
      } else {
        setError(
          <>
            <Typography variant="h5">Запрос выполнен</Typography>
            <Typography variant="h6">
              Статус ответа: {result.status}
            </Typography>
            <Typography variant="h6">Данные не предоставлены</Typography>
          </>,
        );
      }
    } else {
      setError(
        <>
          <Typography variant="h5">Ошибка выполнения запроса</Typography>
          <Typography variant="h6">Статус ответа: {result.status}</Typography>
          {(typeof result.message === 'string' || result.message instanceof String) && (
            <>
              <Typography variant="h6">
                Сообщение: {result.message}
              </Typography>
            </>
          )}
        </>,
      );
    }
    setLoading(null);
  }

  const getData = async (opening = false) => {
    if (opening) setLoading(true);
    if (request === null) {
      setOpened(true);
      setLoading(false);
    }
    if (request !== undefined) {
      await API.callV2(
        request.method || 'GET',
        request.route,
        request.data || null,
        debug
      ).then(responseHandler);
    } else {
      await API.call(requestData, null, debug).then(responseHandler);
    }
  };

  useEffect(() => {
    if (update === 'refresh') setLoading(true);
    if (update === 'silent' || update === 'refresh' || update === null)
      getData();
    return () => {
      if (setUpdate) setUpdate(false);
      setError(null);
      setOpenTime(null);
    };
  }, [update]);

  useEffect(() => {
    // console.log({
    //   pageOpenedAt:pageOpenedAt,
    //   openDate:new Date(openTime),
    //   openTime: openTime,opened,
    //   2: openTime !== null,
    //   3: new Date(openTime) > pageOpenedAt
    // });
    if (opened && openTime !== null && new Date(openTime) > pageOpenedAt) {
      getData(true);
    }
  }, [opened]);

  return (
    <>
      {loading ? (
        <LoadingPage style={{ height: "calc(100vh - 250px)" }} />
      ) : error ? (
        <Paper
          elevation={3}
          style={{
            width: "100%",
            height: 500,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: 20,
            marginTop: 10,
            position: "relative",
          }}
        >
            <Centered>
              {error}
              <Button
                color="primary"
                variant="outlined"
                size="large"
                onClick={() => {
                  getData(true);
                }}
                style={{marginTop:20}}
              >Повторить запрос</Button>
            </Centered>
        </Paper>
      ) : opened ? (
        children
      ) : openTime ? (
        <ClosedSection
          decoration={timerDecoration}
          time={new Date(openTime)}
            onOpen={() => {
            setOpened(true);
          }}
        />
      ) : (
        "Раздел не является закрытым, но не открылся"
      )}
    </>
  );
};

export default Section;
