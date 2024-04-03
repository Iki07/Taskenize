module.exports = (MARSModules) => {
with (MARSModules) {
const util = include("api/.util");
let userData = session('userData');
const auth = include("api/.util-auth");
auth.checkSession(userData);
let userId = userData.userId;
let userName = userData.userName;
let userInfo = auth.fetchUserInfo(userId, userName);
let userAuthData = userInfo.userAuthData;

let assignTo = param("assignTo");
let projectId = param("projectId");
let availableWsps;
if(!projectId){
  availableWsps = util.getAllWsps(userAuthData);                            
} else {
  availableWsps = db.query(`SELECT DISTINCT w.wsp_id, w.wsp_name 
                              FROM workspaces w 
                              JOIN projects_workspaces pw ON w.wsp_id = pw.wsp_id
                              JOIN users_roles_wsps urw ON w.wsp_id = urw.wsp_id
                              WHERE pw.prj_id = ${projectId} AND urw.usr_id = ${assignTo} AND pw.status = 1 AND urw.status = 1`); 
} 
write("availableWsps", availableWsps)


}
}