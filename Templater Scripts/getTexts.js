if (!app.isMobile) {
  const getCourseHome = require(app.vault.adapter.basePath +
    "/Supporting/Templater Scripts/getCourseHome.js")
} else {
  const getCourseHome = require("/Supporting/Templater Scripts/getCourseHome.js")
}

const getTexts = (tp, courseId) => {
  let course = tp.user.getCourseHome(courseId)
  const texts = course?.texts || []
  return texts
}
module.exports = getTexts
