const subName = (subdirectories) => (subdirectories.map(name=> name?.split(' - ')?.shift()))

module.exports = async function(app, tp, directoryPath) {
    const vault = app.vault; 
    const dir = vault.getAbstractFileByPath(directoryPath);
    if (!dir || !(Object.keys(dir).includes('children'))) {
      console.error(`The path '${directoryPath}' is not a valid directory.`);
      return [];
    }
    const cC = {}
    const courses = await tp.user.getCourses(app); 
    const subdirectories = ["SWO-201 - Intro to Social Work","PHI-275 - Nature of Compassion", "PSY-101 - Intro to Psychology", "ENG-102 - Introduction to Writing"]
    const course = await tp.system.suggester(subName(courses), courses) //subName(subdirectories), subdirectories);
    if (!course) return 
    cC.course = course
    cC.discipline =  course.split('-')[0]  

    cC.moduleNumber = await tp.system.prompt("Module Number")
    cC.weekNumber = await tp.system.prompt("Week Number (or blank for none)")
    cC.courseId = `${cC.course?.split(" - ").shift()}`
    cC.dayOfWeek =  await tp.system.suggester(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
    if (cC.moduleNumber.length < 1 && cC.weekNumber.length < 1) {return "Must provide either module number or week number."}
    if (cC.moduleNumber && cC.weekNumber) {
      cC.fullPath = `${directoryPath}/${cC.course}/${cC.courseId} - Module ${cC.moduleNumber}/Week ${cC.weekNumber}/`
    } else if (cC.moduleNumber) {
        cC.fullPath = `${directoryPath}/${cC.course}/${cC.courseId} - Module ${cC.moduleNumber}/`
    } else if (weekNumber) {
        cC.fullPath = `${directoryPath}/${cC.course}/${cC.courseId} - Week ${cC.weekNumber}/`
    }
    await tp.file.move(`${cC.fullPath}${cC.courseId}${cC.moduleNumber ? "."+cC.moduleNumber : ''}${cC.weekNumber ? "."+cC.weekNumber : '' } ${cC.dayOfWeek}`)

    try {await app.vault.createFolder(`${cC.fullPath}/Attachments`)} catch (e) {}


    return cC
}
