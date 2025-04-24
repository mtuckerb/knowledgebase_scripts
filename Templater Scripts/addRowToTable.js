module.exports =  async function(company, title, cover_letter) {

    const filePath = 'Ephemera/Job Hunting/Job Hunting.md'; 
    const tableName = 'Company'; 

    const fileContent = await app.vault.read(app.vault.getAbstractFileByPath(filePath));

    const newRow = `|${company}|${title}|${(new Date()).toISOString().split('T')[0]}|${cover_letter}|||||\n`;

    const updatedContent = fileContent.replace(
        new RegExp(`(\\|.*${tableName}.*\\|\\n)(.*\\n)*?(\\|.*\\|\\n)`),
        `$1$2$3${newRow}`
    );

    await app.vault.modify(app.vault.getAbstractFileByPath(filePath), updatedContent);
}
