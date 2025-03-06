module.exports = async function(tp){
  
  let companyName = await tp.system.prompt("Company's Name");
  let role = await tp.system.prompt("Role");
  let jobPosting = await tp.system.prompt("Job Post URL");
  let vaultDir = app.vault.adapter.basePath;
  let fileBaseName = `${companyName} - ${role}`;
  let titleBaseName = `Tucker Bradford - ${role} at ${companyName}`;
  let filePath = `Ephemera/Job Hunting/Applications/${fileBaseName}/`;
  let coverLetterTitle= `${titleBaseName} - Cover Letter`;
  let coverLetterPath = `${filePath}${coverLetterTitle}`;
  let indexFileName = `${fileBaseName}.md`;
  const cvFileName = `${titleBaseName} - CV.pdf`
  const indexContent = `---
title: ${titleBaseName}
role: ${role}
company: ${companyName}
created: ${tp.file.creation_date("YYYY-MM-DD HH:mm:ss")}
rejected:
cover_letter: "[[${coverLetterTitle}]]"
job_posting: ${jobPosting}
cv: "[[${cvFileName}]]"
final_interview:
---
\`\`\`folder-index-content
\`\`\`
`
  try { await app.vault.createFolder(filePath); } catch (e) { console.error(`Could not create filePath ${e}`)}
  try{
    tp.vault.renameSync(tp.vault.getAbstractFileByath(`~/Downloads/${role} at ${companyName}.pdf`), `${vaultDir}${filePath}${cvFileName}`)
  } catch (_) {console.log(`CV does not exist ${role} at ${companyName}`)}
  try{await tp.file.move(`${coverLetterPath}`)} catch {}
  
  try {
  	 await app.vault.create(`${filePath}${indexFileName}`, indexContent)
  } catch (e) {
  	console.log(`couldn't create index file ${e}\n\n We will try to update instead.`)
  	try{
  		let indexFile = await app.vault.getFileByPath(`${filePath}${indexFileName}`)
  		await app.vault.modify(indexFile, indexContent)
  	} catch (e) { console.error(`Could not update ${filePath+indexFileName} : ${e}`)}
  }
  return {role, companyName}
};

