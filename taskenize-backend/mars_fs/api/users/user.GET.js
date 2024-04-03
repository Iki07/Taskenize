module.exports = (MARSModules) => {
with (MARSModules) {
let userData = session('userData');;

const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId;
let userName = userData.userName;

let userInfo = auth.fetchUserInfo(userId, userName);
let userAuthData = userInfo.userAuthData;

const util = include("api/.util");
let viewerWsps = util.getAllWsps(userAuthData).join(",");


let usersToShow = db.query(`SELECT u.usr_id, u.usr_name, u.usr_email, u.usr_img,
                                  i.img_title AS avatar,
                                  w.wsp_id, w.wsp_name,
                                  GROUP_CONCAT(DISTINCT r.rol_name) AS role_name
                                  FROM users u
                                  JOIN users_roles_wsps urw ON u.usr_id = urw.usr_id
                                  LEFT JOIN roles r ON urw.rol_id = r.rol_id
                                  LEFT JOIN workspaces w ON urw.wsp_id = w.wsp_id
                                  LEFT JOIN images i ON u.usr_img = i.img_id                                 
                                  WHERE urw.wsp_id IN (${viewerWsps}) AND urw.status = 1
                                  GROUP BY u.usr_id, w.wsp_id`);
write("usersToShow",usersToShow);

if (usersToShow.rows == 0) {
  write('msg', 'There are no users for you to see.');
  exit();
} 

}
}