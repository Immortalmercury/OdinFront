import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru";
import { useState } from 'react';
import { useEffect } from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers';

const SecondsPicker = ({
  label,
  value = null,
  onChange=(v)=>{}
}) => {

  const [time, setTime] = useState(value);
  const offset = new Date(0).getTimezoneOffset() * 60;

  function handleChange(date) {
    setTime(date);
    onChange(convertTime(date));
  }

  function convertTime(value) {
    if (value === null) return value;
    if (Number.isInteger(value)) {
      return new Date(value * 1000);
    } else {
      let seconds = value.getTime() / 1000 - offset;
      if (seconds === 0)
        return null;
      return seconds;
    }
  }

  useEffect(() => {
    setTime(convertTime(value + offset));
    return (() => {
      setTime(null);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ ruLocale }>
        <KeyboardTimePicker
          clearable
          ampm={false}
          inputVariant="outlined"
          margin="normal"
          id="time-picker"
          initialFocusedDate={"01.01.1970 00:00:00"}
          format="HH:mm:ss"
          label={label}
          value={time}
          onChange={handleChange}
          views={["hours", "minutes", "seconds"]}
        />
      </MuiPickersUtilsProvider>
  );
}

export default SecondsPicker;
