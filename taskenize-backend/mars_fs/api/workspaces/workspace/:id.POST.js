module.exports = (MARSModules) => {
with (MARSModules) {
/********* provera sesije *************/
let userData = session('userData');

const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId;
let userName = userData.userName;

let userInfo = auth.fetchUserInfo(userId, userName);
let userAuthData = userInfo.userAuthData;

let wspId = param("id");
let insertParams = {};

const util = include("api/.util");
let isAdmin = util.roleCheck(wspId, 2, userAuthData);
write("isAdmin", isAdmin);

if(!isAdmin) {
  write('msg','You are not authorized to edit this workspace.');
  exit();
}

const validation = include("api/.util-validation");

let name = param("name");
if(!name || name == ""){
  response.status(422);
  write('msg', 'Workspace name is mandatory.');
  exit();
};
name = validation.prepareString(name);
write("name", name);
insertParams['wsp_name']= name;

let description = param("description");//string
if(description) {
  description = validation.prepareString(description);
  insertParams['wsp_description'] = description;
}
write("description", description);

let updateWsp = db.update("workspaces")
                      .set(insertParams)
                      .where("wsp_id", "=", wspId)
                      .exec();

let existingAdmins = db.query("SELECT usr_id FROM users_roles_wsps WHERE rol_id = 2 AND wsp_id = ? AND status = 1", wspId);
write('existingAdmins',existingAdmins);
//let existingAminsIds = exisitngAdmins.map(admin => admin.usr_id); graal
let existingAdminsIds = [];
for (let i=0; i < existingAdmins.length; i++) {
  write('existingAdmins'+i, existingAdmins[i]);
  existingAdminsIds.push(existingAdmins[i].usr_id);
}
write('existingAdminsIds',existingAdminsIds);


let selectedAdmins = param("selectedAdmins");
let selectedAdminsStringArray = selectedAdmins.split(","); //za slucaj da mi Bojan salje string
let selectedAdminsArray = [];
for (let i=0; i<selectedAdminsStringArray.length; i++) {
  selectedAdminsArray.push(int(selectedAdminsStringArray[i]));
}
write('selectedAdminsArray',selectedAdminsArray);

function bulkInsertURW (userIds, roleId, wspId, table) {
  //let valueCombos = userIds.map(userId => `${userId}, ${roleId}, ${wspId})`).join(", ");graal
  let valueCombos =[];
  for (let i=0; i < userIds.length; i++) {
    valueCombos.push(`(${userIds[i]}, ${roleId}, ${wspId})`)
  }
  let valuesString = valueCombos.join(",");
  //return `INSERT INTO ${table} (usr_id, rol_id, wsp_id) VALUES ${valueCombos};`;
  return `INSERT INTO ${table} (usr_id, rol_id, wsp_id) VALUES ${valuesString};`
}

//let adminsToAdd = selectedAdmins.filter(id => !existingAdminsIds.includes(id)); graal
let adminsToAdd =[];
for (let i = 0; i < selectedAdminsArray.length; i++) {
  let add = true;
  for(let j=0; j < existingAdminsIds.length; j++) {
    if (selectedAdminsArray[i] == existingAdminsIds[j]) {
      add = false;
      break;
    }
  }
  if (add) {
    adminsToAdd.push(selectedAdminsArray[i])
  }
}
write('adminsToAdd',adminsToAdd);

if(adminsToAdd.length >0) {
  let addAdminsQuery = bulkInsertURW(adminsToAdd, 2, wspId, 'users_roles_wsps');
  db.query(addAdminsQuery);
}

//let adminsToRemove = existingAdminsIds.filter(id => !selectedAdmins.includes(id));graal
let adminsToRemove =[];
for (let i = 0; i < existingAdminsIds.length; i++) {
  let remove = true;
  for (let j=0; j<selectedAdminsArray.length; j++) {
    if (existingAdminsIds[i] == selectedAdminsArray[j]) {
      remove = false;
      break;
    }
  }
  if(remove){
    adminsToRemove.push(existingAdminsIds[i])
  }
}
write('adminsToRemove',adminsToRemove);

if(adminsToRemove.length > 0) {
  if ((existingAdminsIds.length - adminsToRemove.length) > 0) {
    for (let adminId of adminsToRemove)
    db.query("UPDATE users_roles_wsps SET status = 0 WHERE usr_id = ? AND rol_id = 2 AND wsp_id =?", adminId, wspId)
  } else {
    response.status(400);
    write('msg', 'There must be at least one admin assigned.');
    exit();
  }
}


}
}