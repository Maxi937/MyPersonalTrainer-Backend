"use strict"

/* Will make a table clickable - 
**  Example Usage
**  <tr id="clickableRow-{{@index}}">
**  <td id="clickableRow-href-{{@index}}">
*/ 
function clickableTable(numberOfRows, route){
  numberOfRows = numberOfRows - 1
  //console.log(numberOfRows)
  for (let i = 0; i <= numberOfRows; i++) {
    const row = document.getElementById(`clickableRow-${i}`);
    const href = document.getElementById(`clickableRow-href-${i}`).innerHTML.trim()
    //console.log(row)
    row.addEventListener("click", () => {
      window.location.href = `/${route}/${href}`;
    });
  }
}
