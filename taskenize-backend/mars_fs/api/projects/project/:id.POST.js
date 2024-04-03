module.exports = (MARSModules) => {
with (MARSModules) {
const util = include("api/.util");
const validation = include("api/.util-validation");

/********* provera sesije *************/
let userData = session('userData');

const auth = include("api/.util-auth");
auth.checkSession(userData);
let userId = userData.userId;

let insertParams = {};
let projectId = param("id");
let pmId, avatarId;
let projInfo = db.query("SELECT pm_id, prj_img FROM projects WHERE prj_id = ?", projectId);
if (!projectId || projInfo.rows == 0) {
  write ('msg', 'No project found.')
} else {
  pmId = projInfo[0].pm_id;
  avatarId = projInfo[0].prj_img;
}
let isUserPM = pmId == userId;
if(!isUserPM) {
  write('msg', 'You are not authorized to perform this task.');
  exit();
} else {
  let name = param("name");
  if(!name || name == ""){
      response.status(422);
      write('msg', 'Project name is mandatory.');
      exit();
  };
  name = validation.prepareString(name);
  write("name", name);
  insertParams['prj_name']= name;

  let description = param("description");//string
  if(description) {
    description = validation.prepareString(description);
    insertParams['prj_description'] = description;
  }
  write("description", description);

  let startPlanned = param("startPlanned");
  write ('startPlanned: ', startPlanned);
  let checkedStartPlanned = null;
  if(startPlanned) {
    checkedStartPlanned = validation.validateDate(startPlanned);
    insertParams['prj_start_planned'] = checkedStartPlanned;
  }
  write("startPlanned", checkedStartPlanned);

  let endPlanned = param("endPlanned");
  write ('endPlanned: ', endPlanned);
  let checkedEndPlanned = null;
  if(endPlanned) {
    checkedEndPlanned = validation.validateDate(endPlanned);
    insertParams['prj_end_planned'] = checkedEndPlanned;
  }
  write("endPlanned", checkedEndPlanned);

  let startActual = param("startActual");
  write ('startActual: ', startActual);
  let checkedStartActual = null;
  if(startActual) {
    checkedStartActual = validation.validateDate(startActual);
    insertParams['prj_start_actual'] = checkedStartActual;
  }
  write("startActual", checkedStartActual);

  let endActual = param("endActual");
  write ('endActual: ', endActual);
  let checkedEndActual = null;
  if(endActual) {
    checkedEndActual = validation.validateDate(endActual);
    insertParams['prj_end_planned'] = checkedEndActual;
  }
  write("endActual", checkedEndActual);

  //////////////////////////////////////////
  /*let avatar = param("avatar", true);//file, validate
  if(avatar){
    let avatarIsOk = validation.validateFile(avatar);
    write("avatar is OK", avatarIsOk);
    if(avatarIsOk) {
      let avatarParams = {
        'img_title': avatar.fileName,
        'img_image': avatar.data
      }                         
      let newImage = db.update("images")
                    .set(avatarParams)
                    .where("img_id", "=", avatarId)
                    .exec();
    }
  }*/
  ////////////

  let status = param("status");
  if(status){
    insertParams['prj_status'] = status;
  }
  write("status ", status);

  let assignedPM = param("assignedPM");
  if(assignedPM) {
    insertParams['pm_id'] = assignedPM;
  }
  
  let updateProject = db.update("projects")
                      .set(insertParams)
                      .where("prj_id", "=", projectId);
  updateProject.exec();


  ///////posebna paznja pri uklanjanju wspa iz projekta 
  let selectedWsps = param("selectedWsps");
  write("selectedWsps",selectedWsps);
  let selectedWspsStringArray = selectedWsps.split(",");
  let selectedWspsArray = [];
  for(let i=0; i<selectedWspsStringArray.length; i++) {
    selectedWspsArray.push(int(selectedWspsStringArray[i]));
  }
  write("selectedWspsArray",selectedWspsArray);

  let existingWsps = db.query("SELECT wsp_id FROM projects_workspaces WHERE prj_id = ? AND status = 1", projectId);
  //pretvaram query u niz id-brojeva
  let existingWspIds = [];
  for (let i=0; i< existingWsps.length; i++) {
    existingWspIds.push(existingWsps[i].wsp_id);
  }
  write("existingWsps", existingWsps);
  write("existingWspIds", existingWspIds);


  function bulkInsert (projectId, fieldValues, field, table) {
    //let valuePairs = fieldValues.map (fieldValue => `(${projectId}, ${fieldValue})`).join(", ");
    let valuePairs = [];
    for (let i=0; i< fieldValues.length; i++) {
      valuePairs.push(`(${projectId},${fieldValues[i]})`);
    }
    let valuesStrig = valuePairs.join(",")
    return `INSERT INTO ${table} (prj_id, ${field}) VALUES ${valuesStrig};`; 
  }

//dodavanje novih wsps
  //let wspsToAdd = selectedWsps.filter(id => !existingWspIds.includes(id));
  let wspsToAdd = [];
  for(let i=0; i < selectedWspsArray.length; i++) {
    let add = true;
    for (let j=0; j < existingWspIds.length; j++) {
      if(selectedWspsArray[i] == existingWspIds[j]) {
        add = false;
        break;
      }
    }
    if (add) {
      wspsToAdd.push(selectedWspsArray[i]);
    }
  }
  write("wspsToAdd",wspsToAdd);

  if (wspsToAdd.length > 0) {
    let addWspsQuery = bulkInsert(projectId, wspsToAdd, 'wsp_id', 'projects_workspaces');
    let addWsps = db.query(addWspsQuery);
  }
//brisanje wspa ("odselektovani" na frontu)
  //let wspsToDelete = existingWspIds.filter(id => !selectedWsps.includes(id));
  let wspsToDelete = [];
  for(let i=0; i < existingWspIds.length; i++) {
    let remove = true;
    for (let j=0; j < selectedWspsArray.length; j++) {
      if(existingWspIds[i] == selectedWspsArray[j]) {
        remove = false;
        break;
      }
    }
    if (remove) {
      wspsToDelete.push(existingWspIds[i]);
    }
  }
  write("wspsToDelete", wspsToDelete);
  if (wspsToDelete.length > 0) {
    let deleteWsps = db.delete("projects_workspaces")
                      .where("prj_id","=", projectId)
                      .where("wsp_id", "IN", wspsToDelete)
                      .exec();
  }

  for (let wspId of wspsToDelete) {
    let users = db.query("SELECT DISTINCT usr_id FROM users_roles_wsps WHERE wsp_id = ?", wspId);

    for (let user of users) {
      let linkedWspQuery = `SELECT COUNT(*) AS count FROM users_roles_wsps urw 
                      INNER JOIN projects_workspaces pw ON pw.wsp_id = urw.wsp_id 
                      WHERE urw.usr_id = ${user.usr_id} AND pw.prj_id = ${projectId} 
                      AND urw.wsp_id NOT IN (`+ wspsToDelete + ")";                              

      let linkedWsps = db.query(linkedWspQuery);

      if(linkedWsps[0].count == 0) {
        let deleteUser = db.query("DELETE FROM users_projects WHERE usr_id = ? AND prj_id = ?", user.usr_id, projectId);
        let updateUserTasks = db.query("UPDATE tasks SET wsp_id = NULL, tsk_assigned = NULL WHERE tsk_assigned = ? AND prj_id = ?", user.usr_id, projectId);
      } 
    }
    let updateWspTasks = db.query("UPDATE tasks SET wsp_id = NULL WHERE wsp_id = ?", wspId);
  }
 ///////////////////////

  let selectedMembers = param("projectMembers"); 
  write("selectedMembers", selectedMembers);
  let selectedMembersStringArray = selectedMembers.split(",");
  let selectedMembersArray = [];
  for (let i=0; i < selectedMembersStringArray.length; i++) {
    selectedMembersArray.push(int(selectedMembersStringArray[i]))
  }
  write("selectedMembersArray", selectedMembersArray);


  let existingProjectMembers = db.query("SELECT usr_id FROM users_projects WHERE prj_id=? AND status = 1", projectId);
  let existingMembersIds = [];
  for(let i = 0; i <  existingProjectMembers.length; i++) {
    existingMembersIds.push(existingProjectMembers[i].usr_id)
  }
  write("existingMembersIds", existingMembersIds);

  //let membersToAdd = selectedProjectMembers.filter(id => !existingMembersIds.includes(id));
  let membersToAdd = [];
  for (let i=0; i< selectedMembersArray.length; i++) {
    let add = true;
    for (let j=0; j < existingMembersIds.length; j++) {
      if (selectedMembersArray[i] == existingMembersIds[j]) {
        add = false;
        break;
      }
    }
    if(add) {
      membersToAdd.push(selectedMembersArray[i]);
    }
  }
  write("membersToAdd", membersToAdd);

  if (membersToAdd.length > 0) {
    let addMembersQuery = bulkInsert(projectId, membersToAdd, 'usr_id', 'users_projects');
    let addMembers = db.query(addMembersQuery)
  }

  //let membersToRemove = existingMembersIds.filter(id => !selectedProjectMembers.includes(id));
  let membersToRemove = [];
  for (let i=0; i< existingMembersIds.length; i++) {
    let remove = true;
    for (let j=0; j < selectedMembersArray.length; j++) {
      if (existingMembersIds[i] == selectedMembersArray[j]) {
        remove = false;
        break;
      }
    }
    if(remove) {
      membersToRemove.push(existingMembersIds[i]);
    }
  }
  write("membersToRemove", membersToRemove);


  if (membersToRemove.length > 0) {
    for (let memberId of membersToRemove) {
      let removeMember = db.query("DELETE FROM users_projects WHERE usr_id = ? AND prj_id =?", memberId, projectId);
      let updateTasks = db.query("UPDATE tasks SET wsp_id = NULL, tsk_assigned = NULL WHERE tsk_assigned = ? AND prj_id = ?", memberId, projectId)
    }
  }

}
}
}