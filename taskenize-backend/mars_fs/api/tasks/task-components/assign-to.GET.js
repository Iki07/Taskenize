module.exports = (MARSModules) => {
with (MARSModules) {
let userData = session('userData');
const auth = include("api/.util-auth");
auth.checkSession(userData);
let userId = userData.userId;
let projectId = param("projectId");
let teamId = param("teamId");
let assignTo;

if(projectId) {
  assignTo = db.query(`SELECT u.usr_id, u.usr_name 
                        FROM users u 
                        JOIN users_projects up ON u.usr_id = up.usr_id
                        WHERE up.prj_id = ${projectId} AND up.status = 1`);
} 

if(teamId) {
  assignTo = db.query(`SELECT u.usr_id, u.usr_name
                        FROM users u
                        JOIN users_teams ut ON u.usr_id = ut.usr_id
                        WHERE ut.tem_id = ${teamId} AND ut.status = 1`); 
}

write("assignTo", assignTo);


 
}
}