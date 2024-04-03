module.exports = (MARSModules) => {
with (MARSModules) {
/********* provera sesije i preuzimanje podataka o korisniku *************/
let userData = session('userData');

const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId;
let userName = userData.userName;
let userInfo = auth.fetchUserInfo(userId, userName);
let userAuthData = userInfo.userAuthData;

/********* ukljucivanje biblioteka *************/
const util = include("api/.util");
const validation = include("api/.util-validation");

/********* provera autorizacije *************/
let isUserPM = util.countWsps (4, userAuthData) > 0;
let isUserAdmin = util.countWsps (2, userAuthData) > 0;

if(! (isUserPM || isUserAdmin) ) {
  write('msg', 'You are not authorized to perform this task.');
  exit();
} 

/********* preuzimanje i provera parametara sa fronta *************/
let insertParams ={};

let title = param("title");
let description = param("description");
let startPlanned = param("startPlanned");
let endPlanned = param("endPlanned");
let startAcutal = param("startAcutal");
let endActual = param("endActual");
let avatar = param("avatar");
let status = param("status");
let assignedPM = param("assignedPM");
let selectedWsps = param("selectedWsps");
let projectMembers = param("projectMembers"); 
let attach = param("attach");


if(!title || title == ""){
  response.status(422);
  write('msg', 'Title is mandatory.');
  exit();
};
title = validation.prepareString(title);
write("title", title);
insertParams['prj_name']= title;

/*********************/
if(description) {
  description = validation.prepareString(description);
  insertParams['prj_description'] = description;
}
write("description", description);

/*********************/
write ('startPlanned: ', startPlanned);
let checkedStartPlanned = null;
if(startPlanned) {
  checkedStartPlanned = validation.validateDate(startPlanned);
  insertParams['prj_start_planned'] = checkedStartPlanned;
}
write("startPlanned", checkedStartPlanned);

/*********************/
write ('endPlanned: ', endPlanned);
let checkedEndPlanned = null;
if(endPlanned) {
  checkedEndPlanned = validation.validateDate(endPlanned);
  insertParams['prj_end_planned'] = checkedEndPlanned;
}
write("endPlanned", checkedEndPlanned);

/*********************/
write ('startAcutal: ', startAcutal);
let checkedStartActual = null;
if(startAcutal) {
  checkedStartActual = validation.validateDate(startAcutal);
  insertParams['prj_start_actual'] = checkedStartActual;
}
write("startAcutal", checkedStartActual);

/*********************/
write ('endActual: ', endActual);
let checkedEndActual = null;
if(endActual) {
  checkedEndActual = validation.validateDate(endActual);
  insertParams['prj_end_planned'] = checkedEndActual;
}
write("endActual", checkedEndActual);

/********************* upis avatara **********************/
if(avatar){
  let avatarIsOk = validation.validateFile(avatar, true);
  write("avatar is OK", avatarIsOk);
  if(avatarIsOk) {
    let avatarParams = {
      'img_title': avatar.fileName,
      'img_type': 'project',
      'img_image': avatar.data
    }                         
    let newImage = db.insert("images").set(avatarParams).exec();
    let avatarId = newImage[0].img_id;
    insertParams['prj_img'] = avatarId;
  }
}

/*********************/
if(status){
    insertParams['prj_status'] = int(status);
  }
  write("status ", status);

/*********************/
if(!assignedPM) {
  assignedPM = userId;
}
insertParams['pm_id'] = assignedPM;

write("insertParams", insertParams);

/********* prihvat multi-selecta (ocekujem niz) *************/
////let selectedWsps = [1, 2, 3, 4];//za testiranje samo
//write("selectedWsps", selectedWsps)
/*if(!selectedWsps || selectedWsps == [] || selectedWsps == 0) {
  response.status(422);
  write('msg', 'Please select workspace(s) your project belongs to.');
  exit();
}*/
/*if(!Array.isArray(selectedWsps)) {
  write('msg', 'selected Wsps is not an Array!');
  if (typeof selectedWsps === 'string' && selectedWsps.trim() !== "") {
    try {
      selectedWsps = JSON.parse(selectedWsps);
      if(!Array.isArray(selectedWsps)) {
        throw new Error("Parsing attempt failure - not an array")
      }
    } catch (error) {
      response.status(400);
      write('msg', 'Invalid format for selectedWsps. An array is expected.');
      exit();
    }
  } 
}

if(selectedWsps.length == 0) {
  response.status(422);
  write('msg', 'Please select at least one workspace');
  exit();
}
//Bojan 7x saljes isti wsps!!!

function removeDuplicates (array) {
  let uniqueWsps = [];
  for (let i=0; i<array.length; i++){
    let exists = false;
    for (let j=0; j<uniqueWsps.length; j++){
      if(array[i] == uniqueWsps[j]) {
        exists =true;
        break;
      }
    }
    if(!exists){
      uniqueWsps.push(array[i]);
    }
  }
  return uniqueWsps;
}
let selectedUniqueWsps = removeDuplicates(selectedWsps);/*
//Bojan ce ipak da salje stringove za wsps i projectmemebers...ovo gore vise ne treba...



/********************* kreiranje novog projekta *************/
let newProject = db.insert("projects").set(insertParams).exec();
write("newProject", newProject);
let newProjectId = newProject[0].id;
write("newProjectId ", newProjectId);
if(assignedPM) {
  let assignedPMcheck = db.query("INSERT into users_projects SET usr_id=?, prj_id=?", assignedPM, newProjectId);
  write("assignedPMcheck",assignedPMcheck);
}
/********************* vracam se na wsps i project members *************/
/*function bulkInsert (projectId, fieldValues, field, table) {
  //let valuePairs = fieldValues.map (fieldValue => `(${projectId}, ${fieldValue})`).join(", ");
  let valuePairs = "";
  for(let i=0; i < fieldValues.length; i++){
    valuePairs += `(${projectId}, ${fieldValues[i]})`;
    if (i < fieldValues.length - 1) {
      valuePairs += ",";
    }
  }
  return `INSERT INTO ${table} (prj_id, ${field}) VALUES ${valuePairs};`;
}*/
//nova fja za rad sa stringovima:
function bulkInsert(projectId, fieldValues, field, table, projectIdFirst = true) {
  let valuePairs = "";
  let items = typeof fieldValues === 'string' ? fieldValues.split(",") : fieldValues;
  for (let i=0; i< items.length; i++) {
    let item = items[i].trim();
    if (item) {
      if(projectIdFirst) {
        valuePairs += `(${projectId}, ${item})`;
      } else {
        valuePairs += `(${item}, ${projectId})`;
      }
      if (i < items.length - 1) {
        valuePairs += ",";
      }
    }
  }
  valuePairs = valuePairs.replace(/,\s*$/, ""); //za svaki slucaj...
  let fieldsOrder = projectIdFirst ? `(prj_id, ${field})` : `(${field}, prj_id)`;

  return `INSERT INTO ${table} ${fieldsOrder} VALUES ${valuePairs};`;
}

//let queryWsps = bulkInsert(newProjectId, selectedWsps, "wsp_id", "projects_workspaces");
let queryWsps = bulkInsert(newProjectId, selectedWsps, "wsp_id", "projects_workspaces");
write("queryWsps", queryWsps);
let wspsLink = db.query(queryWsps);
write("wspsLink", wspsLink);
  
/*********************/
if(projectMembers) {
  let queryProjectMembers = bulkInsert(newProjectId, projectMembers, "usr_id", "users_projects", false);
  write("queryProjectMembers", queryProjectMembers);
  let usersLink = db.query(queryProjectMembers);
  write("usersLink", usersLink);
}

/********************* upis attach-a **********************/
if(attach){
  let attachIsOk = validation.validateFile(attach);
  write("attach is OK", attachIsOk);
  if(attachIsOk) {
    let attachParams = {
      'att_title': attach.fileName,
      'att_content': attach.data
    }                         
    let newAttach = db.insert("attachments").set(attachParams).exec();
    let attId = newAttach[0].id;

    db.query("INSERT INTO projects_attachments set prj_id=?, att_id=?", newProjectId, attId);
  }
}


}
}