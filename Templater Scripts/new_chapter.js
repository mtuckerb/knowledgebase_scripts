const subName = (subdirectories) => (subdirectories.map(name=> name?.split(' - ')?.shift()))

module.exports = async function(app, tp, directoryPath) {
  const vault = app.vault; 
  const dir = vault.getAbstractFileByPath(directoryPath);
  if (!dir || !(Object.keys(dir).includes('children'))) {
    console.error(`The path '${directoryPath}' is not a valid directory.`);
    return [];
  }

  const courses = await tp.user.getCourses(app); 
  const course = await tp.system.suggester(subName(courses), courses) 
  if (!course) return
  const path = app.metadataCache.getFirstLinkpathDest(
    course,
    directoryPath
  ).path
  const season = path.split("/")[1]
  let texts = tp.user.getTexts(tp, course.split(' - ')[0])
  const re = /\[\[([^\[]+?\.[\w]+)\]\]$/;  // Adjusted regex pattern
  texts = texts.flat().map(text => (text.match(re)?.[1] || text));

  let text = await tp.system.suggester(texts, texts)
  const discipline = course.split('-')[0]  
  const chapterNumber = await tp.system.prompt("Chapter Number(s)")
  const courseId = `${course?.split(" - ").shift()}`
  const textShort = text.split('.')?.[0]
  await tp.file.move(`${directoryPath}/${season}/${course}/${textShort}/Chapter ${chapterNumber}/${textShort} - Chapter ${chapterNumber} - Notes.md`)
  try {await app.vault.createFolder(`${directoryPath}/${season}/${course}/${textShort}/Chapter ${chapterNumber}/Attachments`)} catch (e) {}

  return {chapterNumber, course, courseId, discipline, text}
}
