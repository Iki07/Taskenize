module.exports = (MARSModules) => {
with (MARSModules) {
/********* provera sesije *************/
let userData = session('userData');

const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId;
let userName = userData.userName;
let userInfo = auth.fetchUserInfo(userId, userName);//nova linija
let userAuthData = userInfo.userAuthData;

let wspId = param("id");

const util = include("api/.util");
let userWsps = util.getAllWsps(userAuthData);
write("userWsps", userWsps);

let findWsp = userWsps.find(id => id == wspId);
write("findWsp", findWsp);

if(!findWsp || findWsp == null) {
  write('msg', 'You are not authorized to see this workspace.');
  exit;
}
//nadji sve podatke o wspu (id, naziv, opis, avatar, administratora(id, ime, avatar))
let wspDetails = db.query (`SELECT w.wsp_id, w.wsp_name, wspimg.img_id AS wsp_img_id, wspimg.img_title AS wspAvatar,
                                u.usr_id AS adminId, u.usr_name AS admin, usrimg.img_id AS admin_img_id, usrimg.img_title AS adminAvatar                              
                                FROM workspaces w
                                JOIN users_roles_wsps urw ON w.wsp_id = urw.wsp_id
                                JOIN users u ON urw.usr_id = u.usr_id
                                LEFT JOIN images wspimg ON w.wsp_img = wspimg.img_id
                                LEFT JOIN images usrimg ON u.usr_img = usrimg.img_id
                                WHERE w.wsp_id = ${wspId} AND urw.rol_id =2`);
write("wspDetails", wspDetails);                                

//nadji sve projekte koji pripadaju wspu (ime, avatar, id)
let wspProjects = db.query(`SELECT p.prj_id, p.prj_name, i.img_id AS project_img_id, i.img_title AS projectAvatar
                                FROM projects p
                                JOIN projects_workspaces pw ON p.prj_id = pw.prj_id
                                LEFT JOIN images i ON p.prj_img = i.img_id
                                WHERE pw.wsp_id = ${wspId}`);
write("wspProjects", wspProjects);    

//nadji sve timove koji pripadaju wsps (id, ime , avatar)
let wspTeams = db.query(`SELECT t.tem_id, t.tem_name, i.img_id AS team_img_id, i.img_title AS teamAvatar
                                FROM teams t
                                LEFT JOIN images i ON t.tem_img = i.img_id
                                WHERE t.wsp_id = ${wspId}`);
write("wspTeams", wspTeams);  

/*let id = wspDetails[0].wsp_img_id;
write("img id je:", id);
let image = db.query("SELECT img_title, img_image FROM images WHERE img_id=?", id);
let brojRedova = image.rows;
write("broj redova je:", brojRedova);
if (image.rows == 0 || image[0].img_image == null) {
  //image = db.query("SELECT img_image FROM images WHERE img_type='joker'");
  response.contentType('application/json');
  writeExit('not-found', 404);
  exit();
}
write(image[0].img_image);*/

}
}