module.exports = (MARSModules) => {
with (MARSModules) {

let userData = session('userData');;

const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId;
let selectedWsps = param("selectedWsps");
write("selectedWsps", selectedWsps);
if (!selectedWsps) {
  write('msg','Please select workspace(s).');
  exit();
}

let projectId = param("projectId");
//potencijalni clanovi projektnog tima
let assignTo = db.query(`SELECT DISTINCT u.usr_id, u.usr_name
                          FROM users u
                          INNER JOIN users_roles_wsps urw ON u.usr_id = urw.usr_id
                          WHERE urw.wsp_id IN (${selectedWsps}) AND urw.status = 1`);
write("assignTo", assignTo);
//potencijalni projekt menadzeri
let assignPM = db.query(`SELECT DISTINCT u.usr_id, u.usr_name
                          FROM users u
                          INNER JOIN users_roles_wsps urw ON u.usr_id = urw.usr_id
                          WHERE urw.rol_id = 4 
                          AND urw.wsp_id IN (${selectedWsps}) AND urw.status = 1`);
write("assignPM", assignPM)

if(projectId){
  let existingMembers = db.query("SELECT usr_id FROM users_projects WHERE prj_id=? AND status = 1", projectId);
  write("existingMembers", existingMembers);
  let existingPM= db.query("SELECT pm_id FROM projects WHERE prj_id=? AND prj_status = 1", projectId);
  write("existingPM", existingPM)
}
}
}