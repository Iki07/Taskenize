module.exports = (MARSModules) => {
with (MARSModules) {
/********* provera sesije i preuzimanje podataka o korisniku *************/
let userData = session('userData');

const auth = include("api/.util-auth");
auth.checkSession(userData);
let userId = userData.userId;
let userName = userData.userName;
let userInfo = auth.fetchUserInfo(userId, userName);

/********* ukljucivanje biblioteka *************/
const validation = include("api/.util-validation");
const util = include("api/.util");

/********* preuzimanje i provera parametara sa fronta *************/

let currentWsp = param("currentWsp"); 
let title = param("title");
let description = param("description");
let dueDate = param("dueDate");
let timePlanned = param("timePlanned");
let timeSpent = param("timeSpent");
let attach = param("attach");
let comment = param("comment");
let status = param("status");
let importance = param("importance");
let taskType = param("taskType");
let categoryId = param ("categoryId");
let projectId = param("projectId");
let teamId = param("teamId");
let assignTo = param ("assignTo");
let selectedWsp = param("selectedWsp");

/*********************/
let insertParams = {
  'usr_id': userId
}
write("userId", userId);
/*********************/
if(!title || title == ""){
    response.status(422);
    write('msg', 'Title is mandatory.');
    exit();
};
title = validation.prepareString(title);
write("title", title);
insertParams['tsk_title']= title;

/*********************/
if(description) {
  description = validation.prepareString(description);
  insertParams['tsk_description'] = description;
}
write("description", description);

/*********************/
write ('dueDate: ', dueDate);
let checkedDueDate = null;
if(dueDate) {
  checkedDueDate = validation.validateDate(dueDate);
  insertParams['tsk_duedate'] = checkedDueDate;
}
write("due date", checkedDueDate);

/*********************/
if(validation.isValidNumber(timePlanned)){
  insertParams['tsk_time_planned'] = timePlanned;
}
write("time planned", timePlanned);

/*********************/
if(validation.isValidNumber(timeSpent)){
  insertParams['tsk_time_spent'] = timeSpent;
}
write("time spent", timeSpent);

/*********************/
if(status){
  insertParams['tsk_status'] = status;
}
write("status ", status);

/*********************/
if(importance) {
  insertParams['tsk_important'] = importance;
} 
write("importance ", importance);

/*********************/
if(!taskType || taskType == 0) {
  taskType =1;
}
switch (taskType) {
  case 2:
    let isPM = util.checkUserRole(currentWsp, 4, userInfo.userAuthData);
    if(!isPM){
        write('msg', 'You are not a PM.');
        exit();
    };
    break;
  case 3:
    let isTM = util.checkUserRole(currentWsp, 5, userInfo.userAuthData);
    if(!isTM){
        write('msg', 'You are not a TM.');
        exit();
    };
    break;
}
insertParams['tsk_type'] = taskType;
write("task type ", taskType);

/*********************/
write("projectId", projectId);
if(!projectId || projectId == 0) {
  if(taskType == 2) {
    write('msg', 'Please select project this task belongs to.');
    exit();
  }
} else {
  if(taskType == 2) {
    insertParams['prj_id'] = projectId;
  } else {
    write("msg", "You can't select project for this task type.");//ovo ne bi trebalo da moze da se desi
    exit();
  }
}
/*********************/

write("teamId", teamId);
if(!teamId || teamId == 0) {
  if(taskType == 3) {
    write('msg', 'Please select team this task belongs to.');
    exit();
  }
} else {
  if(taskType == 3) {
    insertParams['tem_id'] = teamId;
  } else {
    write("msg", "You can't select team for this task type.");//ovo ne bi trebalo da moze da se desi
    exit();
  }
}
//gornje provere za project i team treba da se odrade na frontu, ovo je safeguard

/*********************/
//dozvoljavam da assignTo bude null u bazi(not assigned)
if((!assignTo || assignTo == 0) && taskType == 1) {
  assignTo = userId;
}
insertParams['tsk_assigned'] = assignTo;
write("assignTo", assignTo);
/*********************/
write("selectedWsp", selectedWsp);
let availableWsps;
let countOfWsp;
if(!selectedWsp || selectedWsp == 0) {
  /*if(projectId && projectId != 0) {
    availableWsps = db.query(`SELECT DISTINCT w.wsp_id, w.wsp_name 
                              FROM workspaces w
                              JOIN projects_workspaces pw ON w.wsp_id = pw.wsp_id
                              JOIN users_roles_wsps urw ON w.wsp_id = urw.wsp_id
                              WHERE pw.prj_id = ${projectId} AND urw.usr_id = ${assignTo}`);
    write("availableWsps ako je projekat" ,availableWsps)
    countOfWsp = availableWsps.rows;
    write("count of wsps ako je projekat:", countOfWsp);
    if (countOfWsp == 1) {
      selectedWsp = availableWsps[0].wsp_id;
      write("selected wsp ako je projekat", selectedWsp);
     } else {
      write('msg', 'Please select workspace'); //na frontu vec treba da bude ponudjena selekcija
     }
  } else */if (teamId && teamId != 0) {
    availableWsps = db.query("SELECT wsp_id FROM teams WHERE tem_id = ?", teamId);
    selectedWsp = availableWsps[0].wsp_id;
    write("selected wsp ako je tim", selectedWsp);
  } else if (!projectId) {
    /*availableWsps = db.query(`SELECT DISTINCT wsp_id 
                              FROM users_roles_wsps 
                              WHERE usr_id = ${assignTo} AND (rol_id = 2 OR rol_id = 3) AND status = 1
                              ORDER BY wsp_id ASC`);
    countOfWsp = availableWsps.rows;
    if (countOfWsp == 1) {
      selectedWsp = availableWsps[0].wsp_id;
      write("selected wsp ako je privatni", selectedWsp);
     } else {
      write('msg', 'Please select workspace'); //na frontu vec treba da bude ponudjena selekcija
     }*/

     selectedWsp = currentWsp;
  }
}
insertParams['wsp_id']= selectedWsp;

/********* upis taska u bazu ************/
let newTask = db.insert("tasks").set(insertParams).exec();
let newTaskId = newTask[0].id;

/*********************/
/********** upis attach-a u bazu ***********/
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

    let taskAttachLink = db.query("INSERT INTO tasks_attachments set tsk_id=?, att_id=?", newTaskId, attId);
  }
}

/*********************/
/********** upis kategorije u bazu ***********/
//kategorija ne mora da se dodeli
if(categoryId) {
  let insertParamsCategory = {
  'tsk_id': newTaskId,
  'cat_id': categoryId
}
  let resCategory = db.insert("task_categories").set(insertParamsCategory).exec();
}

/*********************/
/*********** upis komentara u bazu **********/
if(comment) {
  comment = validation.prepareString(comment);
  let insertParamsComment = {
    "com_text": comment,
    "usr_id": userId,
    "tsk_id": newTaskId
  };
  let resComment = db.insert("comments").set(insertParamsComment).exec();
}



}
}