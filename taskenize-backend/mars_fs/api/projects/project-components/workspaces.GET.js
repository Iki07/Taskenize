module.exports = (MARSModules) => {
with (MARSModules) {
let userData = session('userData');;

const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId;
let userName = userData.userName;

let userInfo = auth.fetchUserInfo(userId, userName);
let userAuthData = userInfo.userAuthData;
write("userAuthData",userAuthData);

let projectId = param("projectId");

let availableWsps = db.query(`SELECT DISTINCT w.wsp_id, w.wsp_name 
                              FROM workspaces w
                              JOIN users_roles_wsps urw ON w.wsp_id = urw.wsp_id
                              WHERE urw.usr_id = ${userId} AND urw.rol_id = 4 AND urw.status =1`);                           
write("availableWsps", availableWsps)

if(projectId) {
  let existingWsps = db.query('SELECT wsp_id FROM projects_workspaces WHERE prj_id=?', projectId);
  write("existingWsps", existingWsps)
}
}
}