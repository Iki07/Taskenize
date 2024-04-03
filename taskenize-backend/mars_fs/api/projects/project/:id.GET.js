module.exports = (MARSModules) => {
with (MARSModules) {
/********* provera sesije *************/
let userData = session('userData');;
const auth = include("api/.util-auth");
auth.checkSession(userData);
let userId = userData.userId;
let userName = userData.userName;
let userInfo = auth.fetchUserInfo(userId, userName);
let userAuthData = userInfo.userAuthData;
write("userAuthData",userAuthData)

let id = param("id");
const util = include("api/.util");
let usersWsps = util.getAllWsps(userAuthData);
write("usersWsps", usersWsps);

let selectedProjectWsps = db.query("SELECT wsp_id FROM projects_workspaces WHERE prj_id = ? AND status = 1", id);
write("selectedProjectWsps", selectedProjectWsps);

function canViewProject (usersWsps, selectedProjectWsps) {
  for(let i=0; i < usersWsps.length; i++) {
    for(let j=0; j < selectedProjectWsps.length; j++) {
      if(usersWsps[i] == selectedProjectWsps[j].wsp_id) {
        return true;
      }
    }
  }
  return false;
}

if(!canViewProject(usersWsps, selectedProjectWsps)) {
  write('msg', 'You are not authorized to see this project.');
  exit;
}

let selectedProject = db.query("SELECT * FROM projects_overview WHERE prj_id = ?", id);
write("selectedProject", selectedProject);


let projectDetails = db.query(`SELECT p.*, i.img_id AS projectAvatar
                                      FROM projects p
                                      LEFT JOIN images i ON p.prj_img = i.img_id
                                      WHERE p.prj_id = ${id} AND NOT prj_status = 0`);
write("projectDetails",projectDetails);     

let wspsDetails = db.query(`SELECT w.wsp_id, w.wsp_name, i.img_id AS wspAvatar
                                      FROM workspaces w
                                      LEFT JOIN projects_workspaces pw ON w.wsp_id = pw.wsp_id
                                      LEFT JOIN images i ON w.wsp_img = i.img_id
                                      WHERE pw.prj_id=${id} AND pw.status = 1`);
write("wspsDetails",wspsDetails);  

let pmDetails = db.query(`SELECT u.usr_id, u.usr_name, i.img_id AS pmAvatar
                                      FROM users u
                                      LEFT JOIN projects p ON u.usr_id = p.pm_id
                                      LEFT JOIN images i ON u.usr_img = i.img_id
                                      WHERE p.prj_id=${id} AND NOT p.prj_status = 0`)
write("pmDetails",pmDetails); 

let projectTeamDetails = db.query(`SELECT u.usr_id, u.usr_name, i.img_id AS memberAvatar
                                      FROM users u
                                      LEFT JOIN users_projects up ON u.usr_id = up.usr_id
                                      LEFT JOIN images i ON u.usr_img = i.img_id
                                      WHERE up.prj_id=${id} AND up.status = 1 `)
write("projectTeamDetails",projectTeamDetails); 



}
}