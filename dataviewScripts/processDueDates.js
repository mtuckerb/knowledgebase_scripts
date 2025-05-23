const processDueDates = async (dv, courseId, cutOff=[]) => {

  const pages = dv.pages(`${courseId}`) 
  .filter(p => p.file.name !== courseId && p.file.ext == "md") 

  let allEntries = [];

  for (const page of pages.values) {
    if (!page.file?.path) {return}
    const path = page.file.path
    try {
      const file = await dv.app.vault.getFileByPath(path)
      const content = await dv.app.vault.read(file);
      const regex = /# Due Dates([\s\S]*?)(?=\n#|$)/; 
      const matches = content?.match(regex);
      if (matches) {
        const tableData = matches[1].trim(); 
        const lines = tableData.split('\n').slice(1); 
        for (const line of lines) {
          const columns = line.split('|')
            .map(c => c.trim())
          .filter(c => c)
          let dueDate = columns[0] 
          let assignment = columns[1] 
          if (!Date.parse(dueDate)) {continue}
          if (cutOff.length == 1) {
            if (moment(dueDate).isBetween(cutOff[1], cutOff[0])) {
              continue
            }
          }
          const uniqueRow = !allEntries.some(e => (e[0].match(moment(dueDate)?.format("YYYY-MM-DD")) && e[1] == assignment))
          if (assignment && uniqueRow) { 
            if ( moment(dueDate)?.isBefore(moment().add(1,"d"), 'day')) {
             continue 
            }
            else if (moment(dueDate).isAfter(moment().subtract(1,"w"))) {
              formattedDueDate = `<span class="due one_week">${moment(dueDate)?.format("YYYY-MM-DD ddd")}</span>`
            } else if (moment(dueDate).isAfter(moment().subtract(2,"w"))) { 
              formattedDueDate = `<span class="due two_weeks">${moment(dueDate)?.format("YYYY-MM-DD ddd")}</span>`
            }else {
              formattedDueDate = moment(dueDate)?.format("YYYY-MM-DD ddd")
            } 
            allEntries.push([dueDate,formattedDueDate,assignment,`[[${path}]]` ]); 
          }
        }
      } 
    }catch(e) {console.log(e, page)}
  }
  const table = dv.markdownTable(["Due Date", "Task Description", "File"], allEntries.sort((a,b) => moment(a[0]) - moment(b[0])).map(a => [a[1],a[2],a[3]]))
  dv.el('div', table)
}

module.exports = {processDueDates}
window.processDueDates = processDueDates;
