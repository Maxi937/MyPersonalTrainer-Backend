/* Will make a table clickable - 
    Anything tagged with "id="clickableRow" will be used as an index
    Anything tagged with "id="clickableRow-href" will be used as the endpoint

    function takes the route in to construct the endpoint - {route}{endpoint} NOTE: no backspace included so backslash should be passed in the route if required

    
**  Example Usage
**  <tr id="clickableRow-{{@index}}">
**  <td id="clickableRow-href-{{@index}}">
*/
function clickableTable(numberOfRows, route) {
  console.log(numberOfRows)
  for (let i = 0; i < numberOfRows; i += 1) {
    const row = document.getElementById(`clickableRow-${i}`);
    const href = row.children.namedItem("clickableRow-href").innerHTML.trim()
    row.addEventListener("click", () => {
      window.location.href = `${route}${href}`;
    });
  }
}
