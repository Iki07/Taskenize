module.exports = (MARSModules) => {
with (MARSModules) {
let userData = session('userData');

const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId;

let attach = param("attach");
let taskId = param("taskId");
let projectId = param("projectId");
let teamId = param("teamId");
let canAddAttach, attId, assignedTo;
if (taskId) {
  let taskAssigned = db.query("SELECT tsk_assigned FROM tasks WHERE tsk_id = ?", taskId);
  assignedTo = taskAssigned[0].tsk_assigned;
}

//provera da li user moze da doda attach
if(userId == assignedTo) {
  canAddAttach = true;
} else if (projectId && projectId != 0) {
  //moze ako je PM na projektu
  let projectCheck = db.query("SELECT 1 FROM projects WHERE prj_id = ? AND pm_id =?", projectId, userId);
  if (projectCheck.rows > 0) {
    canAddAttach = true;
  }
} else if (teamId && teamId != 0) {
  //moze ako je TM u timu
  let teamCheck = db.query("SELECT 1 FROM teams WHERE tem_id=? AND tm_id=?", teamId, userId);
  if (teamCheck.rows > 0) {
    canAddAttach = true;
  }
} 
const validation = include("api/.util-validation");

if(canAddAttach) {
  if(attach){
    let attachIsOk = validation.validateFile(attach);
    write("attach is OK", attachIsOk);
    if(attachIsOk) {
      let attachParams = {
        'att_title': attach.fileName,
        'att_content': attach.data
      }                         
      let newAttach = db.insert("attachments").set(attachParams).exec();
      attId = newAttach[0].id; 
      write("attId", attId);
    }
  }
} else {
  write('msg', 'You are not authorized to perform this action.');
  exit();
}


if (taskId && taskId != 0) {
  db.query("INSERT INTO tasks_attachments set tsk_id=?, att_id=?", taskId, attId);
} else if (projectId && projectId !=0) {
  db.query("INSERT INTO projects_attachments set prj_id=?, att_id=?", projectId, attId);
} else {
  write("msg", "Attachment must be task or project related.")
}

}
}