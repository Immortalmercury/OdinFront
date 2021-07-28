/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import {
  IconButton,
  Dialog,
  DialogContent,
  Tooltip,
} from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import API from "../../../services/API";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";
import MuiTable from "../../../components/MuiTable";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import HiddenValue from "../../../components/HiddenValue";
import SecondsToRusTime from "../../../components/SecondsToRusTime";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import CreateInvitationModal from "./CreateInvitationModal";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AddStudentModal from "./AddStudentModal";

const convertData = (data, classes, removeFromGroup, progress) => {
  let newData = [];
  if (data !== null)
    for (let index = 0; index < data.length; index++) {
      const el = data[index];
      var last_login =
        -(new Date(el.last_login) - new Date()) / 1000 - 60 * 60 * 3;
      let created = new Date(el.created_at);
      let past_time = (new Date().getTime() - created.getTime()) / 1000;
      newData.push([
        el.s_name
          ? el.s_name + " " + el.f_name + (el.fth_name ? " " + el.fth_name : "")
          : el.login,
        el.s_name ? <HiddenValue label="Email" text={el.email} /> : "",
        el.s_name ? (
          !el.last_login ? (
            "Никогда"
          ) : last_login < 60 ? (
            <span style={{ color: "green" }}>
              <FiberManualRecordIcon style={{ height: 12 }} />
              Онлайн
            </span>
          ) : (
            <>
              <SecondsToRusTime time={last_login} />
              {" назад"}
            </>
          )
        ) : !el.created_at ? (
          "Не определен"
        ) : (el.role === 91 && past_time > 60 * 60 * 24 * 7) ||
          (el.role === 92 && past_time > 60 * 60 * 24 * 4) ||
          (el.role === 93 && past_time > 60 * 60 * 24 * 1) ? (
          <span style={{ color: "red" }}>Истек</span>
        ) : (
          <>
            {"Действителен "}
            <SecondsToRusTime
              time={60 * 60 * 24 * (7 - 4 * (el.role - 91)) - past_time}
            />
          </>
        ),
        progress ? (
          <CircularProgress color="primary" size={20} />
        ) : (
          <IconButton
            variant="outlined"
            color="secondary"
            className={classes.B2}
            disabled={el.id_user === undefined}
          >
            {el.s_name ? (
              <Tooltip title="Исключить из группы" placement="top" arrow>
                <RemoveCircleIcon
                  onClick={() => {
                    removeFromGroup(el.id_user);
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Удалить приглашение" placement="top" arrow>
                <DeleteForeverIcon
                  onClick={() => {
                    removeFromGroup(el.id_user);
                  }}
                />
              </Tooltip>
            )}
          </IconButton>
        ),
      ]);
    }
  return newData;
};

const ViewModal = ({ group, setRerender }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(false);
  const [progress, setProgress] = useState(false);
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const removeFromGroup = async (student) => {
    setProgress(true);
    await API.call({
      method: "remove_student_from_group",
      student,
    }).then((result) => {
      if (result.success) {
        console.log(result.data);
        (async () => {
          await API.call({
            method: "get_group_students",
            group,
          }).then((result) => {
            if (result.success) {
              setData(result.data);
            } else {
              setError(result.message);
            }
            setProgress(false);
          });
        })();
      } else {
        setError(result.message);
      }
    });
  };

  useEffect(() => {
    if (open) {
      (async () => {
        setIsLoading(true);
        await API.call({
          method: "get_group_students",
          group,
        }).then((result) => {
          setIsLoading(false);
          if (result.success) {
            console.log(result.data);
            setData(result.data);
          } else {
            setError(result.message);
          }
        });
      })();
    }
  }, [open, group]);

  const appendData = (newValues) => {
    let newData = newValues;
    Object.entries(data).map((e) => {
      newData.push(e[1]);
    });
    setData(newData);
  };

  return (
    <>
      <IconButton
        color="primary"
        variant="outlined"
        onClick={() => setOpen(true)}
      >
        <Tooltip title="Посмотреть список студентов" placement="top" arrow>
          <Visibility />
        </Tooltip>
      </IconButton>

      {open && (
        <Dialog open={open} fullWidth={true} maxWidth={"md"} style={{}}>
          <DialogTitle disableTypography className={classes.modalTitle}>
            <Typography variant="h6">{"Группа " + group}</Typography>
            <div className={classes.modalTitle}>
              <AddStudentModal group={group} appendDataCallback={appendData} />
              <CreateInvitationModal
                group={group}
                appendDataCallback={appendData}
              />
            </div>
            <IconButton
              className={classes.closeButton}
              onClick={() => {
                setOpen(false);
                setRerender(true);
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          {isLoading ? (
            <DialogContent>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: 200,
                  alignItems: "center",
                }}
              >
                <CircularProgress color="primary" size={40} />
              </div>
            </DialogContent>
          ) : (
            <MuiTable
              data={
                error
                  ? []
                  : data
                  ? convertData(data, classes, removeFromGroup, progress)
                  : []
              }
              columns={[
                "Студент/Приглашение",
                "Email",
                "Последняя активность/Срок действия",
                "Действия",
              ]}
              noMatch={error ? error : "Студентов нет"}
              search={false}
              viewColumns={false}
            />
          )}
        </Dialog>
      )}
    </>
  );
};

export default ViewModal;
