import moment from "moment";
import stripAnsi from 'strip-ansi';

export function formatISOToDate(date) {
  console.log("moment received: ", date)
    return moment(date).format("MMM Do YY");
}

export function formatStringToISO(string) {
  console.log("moment received: ", date)
    return moment(string).toISOString();
}

export function formatStripAnsi(string) {
  if(typeof(string) === "object") {
    return string
  }
  return stripAnsi(string)
}

