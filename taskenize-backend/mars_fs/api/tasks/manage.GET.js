module.exports = (MARSModules) => {
with (MARSModules) {
/********* provera sesije i preuzimanje podataka o korisniku *************/
let userData = session('userData');
if(!userData) {
  response.status(400);
  write('msg', 'Session is not valid');
  exit();
}
let userId = userData.userId;

let allTasks = db.query("SELECT * FROM tasks_overview WHERE AssignedUserID = ? AND NOT status = 0", userId);
write("allTasks", allTasks)
//prikaz svih taskova na projektima kojima upravlja korisnik
let allProjectTasks = db.query("SELECT * FROM tasks_overview WHERE ProjectManagerID = ? AND NOT status = 0", userId);
write("allProjectTasks", allProjectTasks);
//prikaz svih taskova vezanih za timove kojima upravlja korisnik
let allTeamTasks = db.query("SELECT * FROM tasks_overview WHERE TeamManagerID = ? AND NOT status = 0", userId);
write("allTeamTasks", allTeamTasks);
}
}