const getFrontmatterMatchingTag = async (app, tag) => {
  const mdCache = app.metadataCache.metadataCache
  let result = []
  for (const hash in mdCache) {
    const frontmatter = (await mdCache[hash])?.frontmatter
    const tags = typeof tag === "string" && frontmatter ? [tag] : tag
    for (const tag of tags) {
      if (frontmatter?.tags?.includes(tag)) {
        result.push(frontmatter)
      }
    }
  }
  return result
}

const getCourses = async (tp, year, season) => {
  const app = tp.app
  const courses = await getFrontmatterMatchingTag(app, "course_home")
  let courseMatches = []
  if (year) {
    courseMatches = courses.filter((course) =>
      course?.tags?.some((tag) =>
        tag.match(year) && season ? tag.match(season) : true
      )
    )
  } else {
    courseMatches = courses
  }
  return courseMatches.map((course) => course?.title)?.filter(Boolean)
}
module.exports = getCourses
