module.exports = (MARSModules) => {
with (MARSModules) {
let userData = session('userData');;

const auth = include("api/.util-auth");
auth.checkSession(userData);

let loggedInUserId = userData.userId;
let loggedInUserName = userData.userName;
let loggedInUserInfo = auth.fetchUserInfo(userId, userName);
let loggedInUserAuthData = loggedInUserInfo.userAuthData;

let userId = param("id");//korisnik kome zelimo da izmenimo podatke

const util = include("api/.util");
let loggedInUserWsps = util.getWsps(loggedInUserAuthData, 2); 
let isAdmin = loggedInUserWsps.length > 0; 
let wspsAvailableIdsStr = loggedInUserWsps.join(", ");
write("wspsAvailableIdsStr", wspsAvailableIdsStr); 
/*prebacujem na combo
let selectedWsps = param("selectedWsps");
let selectedRoles = param("selectedRoles");
const util = include("api/.util");
let isAdmin = util.checkUserRole(selectedWsp, 2, userAuthData);*/

if(!isAdmin) {
  write('msg', 'You are not authorized to edit user data.');
  exit();
}

let newCombos = param("newCombos");

let existingCombos = db.query(`SELECT w.wsp_id, r.rol_id                          
                                  FROM workspaces w 
                                  JOIN users_roles_wsps urw ON w.wsp_id = urw.wsp_id
                                  LEFT JOIN roles r ON urw.rol_id = r.rol_id
                                  WHERE urw.wsp_id IN (${wspsAvailableIdsStr}) AND urw.usr_id = ${userId} AND urw.status = 1
                                  ORDER BY w.wsp_id ASC`);
write("existingCombos", existingCombos);  

let isExComboArray = Array.isArray(existingCombos);
write("isExComboArray", isExComboArray);

function updateCombos(newCombos, existingCombos) {
  let toAdd =[];
  let toRemove = [];

  // Mapiranje existingCombos za lakše pretraživanje
  let existingMap = {};
  /*existingCombos.forEach(combo => {
    let key = `${combo.wsp_id}_${combo.rol_id}`;
    existingMap.set(key, true);
  });*/
  for (let i = 0; i < existingCombos.length; i++) {
    let combo = existingCombos[i];
    let key = `${combo.wsp_id}_${combo.rol_id}`;
    existingMap[key] = true;
  }

  // Pronalazak novih kombinacija za dodavanje
  /*newCombos.forEach(combo => {
    let key = `${combo.wsp_id}_${combo.rol_id}`;
    if (!existingMap.has(key)) {
      toAdd.push(`Add Role ${combo.rol_id} to Workspace ${combo.wsp_id}.`);
    } else {
      existingMap.delete(key); 
    }
  });*/
  for (let i=0; i < newCombos.length; i++) {
    let combo = newCombos[i];
    let key = `${combo.wsp_id}_${combo.rol_id}`;
    if (!existingMap[key]){
      toAdd.push(combo);
    } else {
      delete existingMap[key]; //uklanjam ako vec postoji
    }
  }

  // Preostale kombinacije u existingMap su one koje treba ukloniti
  /*existingMap.forEach((_, key) => {
    let [wsp_id, rol_id] = key.split('_').map(Number);
    toRemove.push(`Remove Role ${rol_id} from Workspace ${wsp_id}.`);
  });*/
  for (let key in existingMap) {
    let keys = key.split('_'); 
    let wsp_id = int(keys[0]);
    let rol_id = int(keys[1]);
    toRemove.push({wsp_id, rol_id});
  }

  return { toAdd, toRemove };
}

let result = updateCombos(newCombos, existingCombos);
write ("toAdd", result.toAdd);
write ("toRemove", result.toRemove);
////dovde sam stigla

for (let i = 0; i < result.toAdd.length; i++) {
  let combo = result.toAdd[i];
  db.query("INSERT INTO users_roles_wsps SET usr_id=?, rol_id=?, wsp_id=?, status = 1", userId, combo.rol_id, combo.wsp_Id);
}

for (let i = 0; i < result.toRemove.length; i++) {
  let combo = result.toRemove[i];
  switch (combo.rol_id){
      case 2:
      //admin - provera ima li makar jos jedan na wspu- - > urw = NULL*/
        let admin = db.query("SELECT usr_id FROM users_roles_wsps WHERE rol_id = 2 AND wsp_id =? AND NOT usr_id=?", combo.wsp_id, userId);
        if(admin.rows == 0) {
          write('msg', 'There must be at least one admin assigned to workspace.');
          exit();
        } 
        break;
      case 4:
      //pm -- svi projekti -> pm_id = NULL ,svi users_projects - > status = 0, urw - status NULL
        db.query("UPDATE projects SET pm_id = NULL WHERE pm_id=?", userId);
        db.query("UPDATE users_projects SET status = 0 WHERE usr_id=?", userId);
        break;
      case 5:
        /* brisanje TMa:svi timovi - tm_id = NULL, urw -> status NULL*/
        db.query("UPDATE teams SET tm_id = NULL WHERE tm_id=?", userId);      
        break;
    }
    db.query("UPDATE users_roles_wsps SET status = 0 WHERE usr_id=? AND rol_id=? AND wsp_id=?", userId, combo.rol_id, combo.wsp_id);
}
}
}