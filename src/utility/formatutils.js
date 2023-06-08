import moment from "moment";

export function formatISOToDate(date) {
    return moment(date).format("MMM Do YY");
}

export function colorRequestMethod(method) {
    const endColour = "\x1b[0m"
    let color = ""
  
    switch(method) {
      case "GET":
        color = "\x1b[32m"
        break;
      case "POST":
        color = "\x1b[34m"
        break;
      case "DELETE":
        color = "\x1b[31m"
        break;
      default:
        return method
    }
    return `${color}${method}${endColour}`
  }