  module.exports = async function(tp) {
    let qcFileName = await tp.system.prompt("Note Title")
    let topic = await tp.system.prompt("Topic")
    let meetingDate =   await tp.system.prompt("Date of meeting (blank for today)")
    meetingDate = moment(meetingDate).isValid() ? moment(meetingDate) : moment()
    titleName = `${meetingDate.format("YYYY-MM-DD")} - ${qcFileName}`
    await tp.file.rename(titleName)
    let titleTopic =  topic ? ` - [[${topic}]]` : ''
    let title = `[[${qcFileName}]] ${titleTopic}`

    const path = `/${meetingDate.year()}/${meetingDate.format("MM")}/${meetingDate.format("DD")}/Meetings`
    try {await app.vault.
      createFolder(`${path}/`)} catch (e) {}

    await tp.file.move(`${path}/${titleName}`)
    try {await app.vault.createFolder(`${cC.fullPath}/Attachments`)} catch (e) {}
    return {title, qcFileName, topic, titleTopic, meetingDate}
  }
