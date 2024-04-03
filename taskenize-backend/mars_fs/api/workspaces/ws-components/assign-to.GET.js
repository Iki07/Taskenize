module.exports = (MARSModules) => {
with (MARSModules) {
//za pronalazenje admina
let userData = session('userData');
const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId;
//let userId = 16;
let wspId = param("wspId");
if(!wspId) {
  write('msg', 'No workspace selected');
  exit();
}
let assignTo = db.query(`SELECT DISTINCT u.usr_id, u.usr_name
                          FROM users u
                          INNER JOIN users_roles_wsps urw ON u.usr_id = urw.usr_id
                          WHERE urw.wsp_id = ${wspId} AND status = 1`);
write("assignTo", assignTo);


let existingAdmins = db.query("SELECT usr_id FROM users_roles_wsps WHERE wsp_id=? AND rol_id = 2 and status = 1", wspId);
write("existingAdmins", existingAdmins);

}
}