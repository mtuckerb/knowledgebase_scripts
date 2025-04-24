const getFrontmatterMatchingKey = async (app, key) => {
  const mdCache = app.metadataCache.metadataCache
  let result = []
  for (const hash in mdCache) { 
    const frontmatter = (await mdCache[hash])?.frontmatter
    if (key && frontmatter && Object.keys(frontmatter)?.includes(key)) {
      result.push(frontmatter)
    }
  }
  return result
}

module.exports = getFrontmatterMatchingKey
