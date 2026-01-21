const getCourseHome = (courseId) => {
  const files = app.vault.getMarkdownFiles()
  const results = []
  for (const f of files) {
    const frontmatter = app.metadataCache.getFileCache(f)?.frontmatter
    if (
      frontmatter?.course_id == courseId &&
      frontmatter?.tags?.includes("course_home")
    ) {
      return frontmatter
    }
  }
}

module.exports = getCourseHome
