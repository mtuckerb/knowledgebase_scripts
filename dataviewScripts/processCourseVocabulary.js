async function processCourseVocabulary(dv, courseName){

    
    try {
        
        const pages = dv.pages(courseName)
            .filter(p => p.file.ext === "md")
            .map(p => ({
                name: p.file.name,
                path: p.file.path
            }));

        // Process each page and extract vocabulary
        dv.header(1, "All Course Vocabulary");
        
        for (const page of pages) {
            if (!page.path) continue;
            
            try {   
                const file    = await dv.app.vault.getFileByPath(page.path);
                const content = await dv.app.vault.read(file);
                
                // Extract vocabulary using regex
                const vocabRegex = /^#+ Vocabulary.*\n((?:.*?\n)*?)(?=^\s*#\s|$)/m;
                const vocabMatches = content?.match(vocabRegex);

                if (vocabMatches) {
                    const vocabData   = vocabMatches[1].trim();
                    const cleanedVocab = vocabData
                        .replace(/\[\[.*?\]\]/g, '')  // Remove wikilinks
                        .trim()
                        .split('- ')
                        .filter(Boolean)
//                        .filter(b => (b !== "" && b !== null && b !== undefined)); 

                    if (cleanedVocab.length > 0) {
                        dv.header(3, `[[${page.name}]]`);
                        dv.list(cleanedVocab);
                    }
                }

            } catch (e) {
                console.log(`Error processing ${page.path}:`, e);
                continue;
            }
        }

    } catch (error) {
        console.error("Error in Vocabulary Processing:", error);
    }
}
module.exports = {processCourseVocabulary}
