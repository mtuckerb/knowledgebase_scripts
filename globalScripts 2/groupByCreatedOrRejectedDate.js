Array.prototype.groupByCreatedOrRejectedDate = function () {
  const grouped = {}

  this.forEach((item) => {
    // Group by the created date
    const createdDate = item.created
    if (createdDate) {
      if (!grouped[createdDate]) {
        grouped[createdDate] = []
      }
      grouped[createdDate].push({ ...item, dateType: "created" })
    }

    // Group by the rejected date, if it exists
    if (item.rejected) {
      const rejectedDate = item.rejected
      if (!grouped[rejectedDate]) {
        grouped[rejectedDate] = []
      }
      grouped[rejectedDate].push({ ...item, dateType: "rejected" })
    }
  })

  // Convert the grouped object into an array of groups with { key, rows }
  return Object.keys(grouped).map((key) => ({
    key,
    rows: grouped[key],
  }))
}
module.exports = Array.prototype.groupByCreatedOrRejectedDate