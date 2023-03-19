function clickableTable(numberOfRows, route) {
  console.log(numberOfRows)
  for (let i = 0; i < numberOfRows; i += 1) {
    
    const row = document.getElementById(`clickableRow-${i}`);
    const href = row.children.namedItem("clickableRow-href").innerHTML.trim()
    console.log(`${route}${href}`)
    row.addEventListener("click", () => {
      window.location.href = `${route}${href}`;
      console.log(`${route}${href}`)
    });
  }
}
