module.exports = (MARSModules) => {
with (MARSModules) {
/********* provera sesije *************/
let userData = session('userData');

const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId;

const validation = include("api/.util-validation");

let existingWsps = db.query(`SELECT w.wsp_id, w.wsp_name
                              FROM users_roles_wsps urw
                              JOIN workspaces w ON urw.wsp_id = w.wsp_id
                              WHERE urw.usr_id = ${userId} AND status = 1`);
let countOfWsps = existingWsps.rows;
if ( countOfWsps == 0) {
  write('msg', 'There has been an error.')//ovo ne bi smelo ni da se desi
} else {
  let userWsps = [];
  for(let i = 0; i < countOfWsps; i++) {
    userWsps.push(existingWsps[i].wsp_name)
  }
  //write ('msg', `You are already assigned to these workspaces: ${userWsps}. Are you sure you want to create another one?`);
} 
let insertParams ={};

let wspName = param("name");
if(wspName) {
  wspName = validation.prepareString(wspName);
} else {
  wspName = userName.split(" ")[0] + "' Workspace";
  write ("wspName: ", wspName);
}
write("wspName", wspName);
insertParams['wsp_name']= wspName;

let description = param("description");//string
if(description) {
  description = validation.prepareString(description);
  insertParams['wsp_description'] = description;
}
write("description", description);

/************ insert avatar *************/
let avatar = param("avatar");//file, validate
  if(avatar){
    let avatarIsOk = validation.validateFile(avatar, true);
    write("avatar is OK", avatarIsOk);
    if(avatarIsOk) {
      let avatarParams = {
        'img_title': avatar.fileName,
        'img_type': 'workspace',
        'img_image': avatar.data
      }                         
      let newImage = db.insert("images").set(avatarParams).exec();
      let avatarId = newImage[0].img_id;
      insertParams['wsp_img'] = avatarId;
    }
  }
/*******************************************/

let newWsp = db.insert("workspaces").set(insertParams).exec();
let newWspId = newWsp[0].id

db.query("INSERT INTO users_roles_wsps (usr_id, rol_id, wsp_id) VALUES (?,?,?)", userId, 2, newWspId);
db.query("INSERT INTO users_roles_wsps (usr_id, rol_id, wsp_id) VALUES (?,?,?)", userId, 3, newWspId);
write('msg', 'New workspace created.')

}
}