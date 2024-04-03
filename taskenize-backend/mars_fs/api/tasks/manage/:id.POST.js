module.exports = (MARSModules) => {
with (MARSModules) {
//edit pojedinacnog taska
/********* provera sesije i preuzimanje podataka o korisniku *************/
let userData = session('userData');
if(!userData) {
  response.status(400);
  write('msg', 'Session is not valid');
  exit();
}
const validation = include("api/.util-validation");

let userId = userData.userId;
let taskId = param("id");

let title = param("title"); 
let description = param("description");
let dueDate = param("dueDate")
let assignedTo = param("assignedTo");
let projectId = param("projectId");
let teamId = param("teamId");
let taskType = param("taskType");
let newTaskCategory = param("taskCategory");
let timePlanned = param("timePlanned");
let timeSpent = param("timeSpent");
let status = param("status");
let importance = param("importance");
let reAssign = param("reAsign");
let selectedWsp = param("selectedWsp");

let canEditTask = false;
let canDoPartialEdit = false;

let partialParams = {};
let editParams = {};
let catParams = {};

if (userId == assignedTo) {
  canDoPartialEdit = true;
}
//ako je private task
if ((!projectId || projectId == 0) && (!teamId || teamId == 0)) {
  canEditTask = true;
} else if (projectId && projectId != 0) {
  //moze da edituje task ako je PM na projektu
  let projectCheck = db.query("SELECT 1 FROM projects WHERE prj_id = ? AND pm_id =? AND NOT prj_status = 0", projectId, userId);
  if (projectCheck.rows > 0) {
    canEditTask = true;
    canDoPartialEdit = true;
  }
  //canEditTask = userData.projectsManaged.some(project => project.prj_id === projectId);
  //canDoPartialEdit = true;
} else if (teamId && teamId != 0) {
  //moze da edituje task ako je TM u timu
  /*let teamCheck = db.query("SELECT 1 FROM teams WHERE tem_id=? AND tm_id=?", teamId, userId);
  if (teamCheck.rows > 0) {
    canEditTask = true;
    canDoPartialEdit = true;
  }*/
  canEditTask = userData.teamsManaged.some(team => team.tem_id === teamId);
  canDoPartialEdit = true;
}

if(!canDoPartialEdit) {
  write('msg', 'You cannot edit this task.');
  exit(); 
} else {
  //let timeSpent = param("timeSpent");
  if(validation.isValidNumber(timeSpent)){
    partialParams['tsk_time_spent'] = timeSpent;
  }
  write("time spent", timeSpent);

  //let status = param("status");
  if(status){
    partialParams['tsk_status'] = status;
  }
  write("status ", status);

  let partialUpdateQuery = db.update('tasks')
                      .set(partialParams)
                      .where('tsk_id', '=', taskId);
  let partialTaskUpdate = partialUpdateQuery.exec();

  if(!canEditTask) {
    write('msg', 'You can only update status, time spent, add attachment or update/add new comment.');
  } else {
    //let title = param("title");
    if(!title){
        response.status(422);
        write('msg', 'Title is mandatory.');
        exit();
    };
    title = validation.prepareString(title); 
    write("title", title);
    editParams['tsk_title']= title;

    //let description = param("description");//string
    if(description) {
      description = validation.prepareString(description);
      editParams['tsk_description'] = description;
    }

    //let dueDate = param("dueDate");//date
    let checkedDueDate = null;
    if(dueDate) {
      checkedDueDate = validation.validateDate(dueDate);
      editParams['tsk_duedate'] = checkedDueDate;
    }

    //let timePlanned = param("timePlanned");//number
    if(validation.isValidNumber(timePlanned)){
      editParams['tsk_time_planned'] = timePlanned;
    }
    write("time planned", timePlanned);

    //let importance = param("importance");//integer
    if(importance) {
      editParams['tsk_important'] = importance;
    } 
    write("importance ", importance);

    //let reAssign = param("reAsign");
    if (reAssign) {
      editParams["tsk_assigned"] = reAssign;
    }

    //let selectedWsp = param("selectedWsp");
    if (selectedWsp) {
      if (taskType != 1) {
        let currentWsp = db.query("SELECT wsp_id FROM tasks WHERE tsk_id=? AND NOT tsk_status = 0", taskId);
        if(currentWsp.rows > 0) {
          let currentWspId = currentWsp[0].wsp_id;
          if(selectedWsp != currentWspId) {
            write('msg', 'You cannot change workspace for this task type.');
            exit(); 
          }
        } else {
          editParams["wsp_id"] = selectedWsp;
        } 
      } 
    }

    let editQuery = db.update('tasks')
                      .set(editParams)
                      .where('tsk_id', '=', taskId);
    let taskUpdate = editQuery.exec();

    if (newTaskCategory) {
      catParams["cat_id"] = newTaskCategory;
      let catQuery = db.update('task_categories')
                      .set(catParams)
                      .where('tsk_id', '=', taskId);
      let categoryUpdate = catQuery.exec()
    }//kategoriju moze ako ima canedit

  }
}




}
}