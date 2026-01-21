const subName = (subdirectories) =>
  subdirectories.map((name) => name?.split(" - ")?.shift());

module.exports = async function (tp, year = tp.date.now("YYYY")) {
  const app = tp.app;
  const vault = app.vault;
  const courses = await tp.user.getCourses(tp, year);
  const course = await tp.system.suggester(subName(courses), courses);
  if (!course) return;
  const path = app.metadataCache.getFirstLinkpathDest(course, `"${year}"`).path;
  console.log(`path: ${path}, course: ${course}`);
  const season = path.match(/Winter|Spring|Summer|Autumn|Fall/)?.[0];
  const courseId = course.split(" - ")[0];
  console.log(courseId);
  let texts = tp.user.getTexts(tp, courseId);
  const re = /\[\[([^\[]+?\.[\w]+)\]\]$/; // Adjusted regex pattern
  texts = texts.flat().map((text) => text.match(re)?.[1] || text);
  let text = await tp.system.suggester(texts, texts);
  if (!text) {
    return;
  }

  const discipline = course.split("-")[0];
  const chapterNumber = await tp.system.prompt("Chapter Number(s)");
  //const courseId = `${course?.split(" - ").shift()}`
  const textShort = text.split(".")?.[0];
  await tp.file.move(
    `${year}/Academics/${season}/${course}/${textShort}/Chapter ${chapterNumber}/${textShort} - Chapter ${chapterNumber} - Notes.md`
  );
  try {
    await app.vault.createFolder(
      `${year}/Academics/${season}/${course}/${textShort}/Chapter ${chapterNumber}/Attachments`
    );
  } catch (e) {}

  return { chapterNumber, course, courseId, discipline, text };
};
