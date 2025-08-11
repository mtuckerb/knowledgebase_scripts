module.exports =  async (app, tag) => {
  const mdCache = app.metadataCache.metadataCache
  let result = []
  for (const hash in mdCache) { 
    const frontmatter = (await mdCache[hash])?.frontmatter
    const tags = typeof tag === 'string' && frontmatter ? [tag] : tag;
    for (const tag of tags) {
      if (frontmatter?.tags?.includes(tag)) {
        result.push(frontmatter)
      }
    }
  }
  return result
}




