const getCourseHome = (courseId) => {
  const files = app.vault.getMarkdownFiles();
  const matchingFiles = [];

  for (const file of files) {
      const cache = app.metadataCache.getFileCache(file);
      const frontmatter = cache?.frontmatter;
      if (frontmatter && frontmatter?.course_id == courseId && frontmatter?.tags?.includes("course_home")) {
        if (frontmatter?.tags?.includes("course_home")) {
          matchingFiles.push(cache);
        }
      }
  }
  return matchingFiles;
}

module.exports = getCourseHome;