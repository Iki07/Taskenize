module.exports = (MARSModules) => {
with (MARSModules) {
let userData = session('userData');;

const auth = include("api/.util-auth");
auth.checkSession(userData);
let loggedInUserId = userData.userId;
let loggedInUserName = userData.userName;

let loggedInUserInfo = auth.fetchUserInfo(loggedInUserId, loggedInUserName);
let loggedInUserAuthData = loggedInUserInfo.userAuthData;

let userId = param("id");
write("userId", userId);

const util = include("api/.util");
let loggedInUserWspsIds = util.getAllWsps(loggedInUserAuthData);
write("loggedInUserWspsIds", loggedInUserWspsIds);

let userWsps = db.query("SELECT DISTINCT wsp_id FROM users_roles_wsps WHERE usr_id = ? AND status = 1", userId);
write("userWsps", userWsps);
let countOfWsps = userWsps.rows;
write("countOfWsps", countOfWsps)

let userWspsIds = [];
if ( countOfWsps == 0) {
  write('msg', 'There has been an error.');
  exit();//ovo ne bi smelo ni da se desi
} else {
  for(let i = 0; i < countOfWsps; i++) {
    userWspsIds.push(userWsps[i].wsp_id)
  }
} 

//let commonWsps = loggedInUserWspsIds.filter(wsp => userWspsIds.includes(wsp));
let commonWsps = [];
for (let i=0; i < loggedInUserWspsIds.length; i++) {
  for (let j=0; j< userWspsIds.length; j++) {
    if (loggedInUserWspsIds[i] == userWspsIds[j]) {
      commonWsps.push(loggedInUserWspsIds[i]);
      return;
    }
  }
}
write("commonWsps",commonWsps);

if (!commonWsps) {
  write('msg', "You cannot see this user's profile.");
  exit();
}

let commonWspStr = commonWsps.join(",");

let userInfo = db.query(`SELECT usr_name, usr_display_name, usr_email, usr_bio, 
                            COALESCE (usr_img, 6) AS usr_img
                            FROM users
                            WHERE usr_id = ${userId} AND usr_status = 1`);
if(userInfo.rows == 0) {
  write('msg', "There is no infomation available.");
  exit();
}

let userTeams = db.query(`SELECT t.tem_id, t.tem_name, COALESCE (t.tem_img, 6) AS team_img 
                            FROM teams t
                            LEFT JOIN users_teams ut ON t.tem_id = ut.tem_id
                            WHERE ut.usr_id=${userId} AND ut.status = 1`);
write("userTeams", userTeams);

let teamsUserManages = db.query("SELECT tem_id, tem_name, COALESCE (tem_img, 6) AS team_img FROM teams WHERE tm_id=?", userId);
write("teamsUserManages", teamsUserManages);

let userProjects = db.query(`SELECT p.prj_id, p.prj_name, COALESCE (p.prj_img, 6) AS proj_img 
                            FROM projects p
                            LEFT JOIN users_projects up ON p.prj_id = up.prj_id
                            WHERE up.usr_id=${userId} AND up.status = 1`);
write("userProjects", userProjects);

let projectsUserManages = db.query("SELECT prj_id, prj_name, COALESCE (prj_img, 6) AS proj_img FROM projects WHERE pm_id=?", userId);
write("projectsUserManages", projectsUserManages);

let userWspInfo = db.query(`SELECT w.wsp_id, w.wsp_name, 
                                  COALESCE (w.wsp_img, 6) AS wsp_img,
                                  GROUP_CONCAT(r.rol_name) AS roles
                                  FROM workspaces w
                                  LEFT JOIN users_roles_wsps urw ON w.wsp_id = urw.wsp_id
                                  LEFT JOIN roles r ON urw.rol_id = r.rol_id
                                  WHERE w.wsp_id IN (${commonWspStr}) AND urw.usr_id = ${userId} AND urw.status = 1
                                  GROUP BY w.wsp_id
                                  ORDER BY w.wsp_id`)
write("userWspInfo", userWspInfo);                                  






}
}