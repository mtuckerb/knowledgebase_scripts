const getFrontmatterMatchingTag = require("Supporting/Templater Scripts/getFrontmatterMatchingTag.js")
const getCourses = async (app, year, season) => {
  const courses = await getFrontmatterMatchingTag(app, "course_home")
  let courseMatches = []
  if (year) {
    courseMatches = courses.filter(course => (
        course?.tags?.some(tag => tag.match(year) && season ? tag.match(season) : true)
      )
    )
  } else {courseMatches = courses}
  return courseMatches.map(course => course?.title)?.filter(Boolean)
}
module.exports = getCourses
