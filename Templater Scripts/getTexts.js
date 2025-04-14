
const getFrontmatterMatchingKey = require(app.vault.adapter.basePath + '/Supporting/Templater Scripts/getFrontmatterMatchingKey.js')



const getTexts= async (app, course) => {
  const texts = await getFrontmatterMatchingKey(app, "texts")
  let textMatches = []
  if (course?.length > 0) {
    textMatches = texts.filter(text => (
        text?.tags?.some(tag => tag.match(course))
    )).split(',')
  } else {textMatches = texts}
  return textMatches.map(text => text?.texts)
    ?.filter(Boolean)
    ?.filter((value, index, array) => array.indexOf(value) === index)
}
module.exports = getTexts
