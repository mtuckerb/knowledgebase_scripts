const processDueDates = async (dv, courseId) => {
  const pages = dv.pages(`${courseId}`) 

  .filter(p => p.file.name !== courseId && p.file.ext == "md") 

  let allEntries = [];

  for (const page of pages.values) {
    if (!page.file?.path) {return}
    const path = page.file.path
    try {
      const file = await dv.app.vault.getFileByPath(path)
      const content = await dv.app.vault.read(file);
      const regex = /## Due Dates([\s\S]*?)(?=\n#|$)/; 
      const matches = content?.match(regex);
      if (matches) {
        const tableData = matches[1].trim(); 
        const lines = tableData.split('\n').slice(1); 
        for (const line of lines) {
          const columns = line.split('|')
            .map(c => c.trim())
          .filter(c => c)
          .filter(Boolean)

          let dueDate = columns[0]; 
          let assignment = columns[1]; 
          if (dueDate && assignments) { 
            assignment = new Date(dueDate) < new Date() ? `<span stlye="color: #e3e3e0;">~~${assignment}~~</span>` : assignment
            if (dueDate && assignment) {
              allEntries.push([dueDate,assignment ]); 
            }
          }
        }
      } 
    }catch(e) {console.log(e, page)}
  }


  dv.table(["Due Date", "Task Description"], allEntries);
}

module.exports = {processDueDates}
