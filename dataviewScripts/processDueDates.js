const processDueDates = ( courseId, cutOff = []) => {
  const startDate =
    cutOff.length > 0
      ? moment(cutOff[0]).format("YYYY-MM-DD")
      : moment().subtract(1, "day").format("YYYY-MM-DD")
  const endDate = moment(cutOff[1]).format("YYYY-MM-DD")

  const pages = dv
    .pages(`${courseId}`)
    .filter((p) => p.file.name !== courseId && p.file.ext == "md")

  let allEntries = []

  for (const page of pages.values) {
    if (!page?.file?.path) { return }
      app.vault.read(app.vault.getFileByPath(page.file.path)).then( content  => {
        const regex = /# Due Dates([\s\S]*?)(?=\n#|$)/
        const matches = content?.match(regex)
        if (matches) {
          const tableData = matches[1].trim()
          const lines = tableData.split("\n").slice(1)
          for (const line of lines) {
            const columns = line
              .split("|")
              .map((c) => c.trim())
              .filter((c) => c)
            let [dueDate, assignment] = columns
            if (!Date.parse(dueDate) || assignment?.match(/✅/)) {
              continue
            }
            assignment = assignment?.match(/[A-Z]{3}-[0-9]{3}/)
              ? assignment
              : `#${page.course_id} - ${assignment}`
            if (
              moment(dueDate).isBetween(startDate, endDate) ||
              cutOff.length == 0
            ) {
              const uniqueRow = !allEntries.some(
                (e) =>
                  e[0].match(moment(dueDate)?.format("YYYY-MM-DD")) &&
                  e[1] == assignment
              )
              if (assignment && uniqueRow) {
                if (moment(dueDate)?.isBefore(startDate)) {
                  continue
                } else if (moment(dueDate).isAfter(moment().subtract(1, "w"))) {
                  formattedDueDate = `<span class="due one_week">${moment(
                    dueDate
                  )?.format("YYYY-MM-DD ddd")}</span>`
                } else if (moment(dueDate).isAfter(moment().subtract(2, "w"))) {
                  formattedDueDate = `<span class="due two_weeks">${moment(
                    dueDate
                  )?.format("YYYY-MM-DD ddd")}</span>`
                } else {
                  formattedDueDate = moment(dueDate)?.format("YYYY-MM-DD ddd")
                }
                allEntries.push([
                  dueDate,
                  formattedDueDate,
                  assignment,
                  `[[${path}]]`,
                ])
              }
            }
          }
        }
        
      })
  }
  const table = dv.markdownTable(
          ["Due Date", "Task Description", "File"],
          allEntries
            .sort((a, b) => moment(a[-1]) - moment(b[0]))
            .map((a) => [a[0], a[2], a[3]])
        )
      dv.el("table", table)
}

module.exports = { processDueDates }
