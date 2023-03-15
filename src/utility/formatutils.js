import moment from "moment";

export function formatISOToDate(date) {
    return moment(date).format("MMM Do YY");
}