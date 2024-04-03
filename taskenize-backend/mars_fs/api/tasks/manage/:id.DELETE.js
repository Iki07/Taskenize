module.exports = (MARSModules) => {
with (MARSModules) {

/********* provera sesije i preuzimanje podataka o korisniku *************/
let userData = session('userData');
if(!userData) {
  response.status(400);
  write('msg', 'Session is not valid');
  exit();
}
let userId = userData.userId;
let taskId = param("id");
let taskInfo = db.query("SELECT tsk_assigned, prj_id, tem_id FROM tasks WHERE tsk_id=? AND NOT tsk_status = 0", taskId);
let assignedTo = taskInfo[0].tsk_assigned;
write("assignedTo", assignedTo);
let projectId = taskInfo[0].prj_id
write("projectId", projectId);
let teamId = taskInfo[0].tem_id;
write("teamId", teamId);

let canDeleteTask = false;

if(userId == assignedTo && (!projectId || projectId == 0) && (!teamId || teamId == 0)) {
  canDeleteTask = true;
} else if (projectId && projectId != 0) {
  //moze da obrise task ako je PM na projektu
  let projectCheck = db.query("SELECT 1 FROM projects WHERE prj_id = ? AND pm_id =? AND NOT prj_status = 0", projectId, userId);
  if (projectCheck.rows > 0) {
    canDeleteTask = true;
  }
  //canDeleteTask = userData.projectsManaged.some(project => project.prj_id === projectId);
} else if (teamId && teamId != 0) {
  //moze da obrise task ako je TM u timu
  let teamCheck = db.query("SELECT 1 FROM teams WHERE tem_id=? AND tm_id=? AND tem_status = 1", teamId, userId);
  if (teamCheck.rows > 0) {
    canDeleteTask = true;
  }
  //canDeleteTask = userData.teamsManaged.some(team => team.tem_id === teamId);
} 

if(canDeleteTask) {
  let findAttachToDelete = db.query("SELECT att_id FROM tasks_attachments WHERE tsk_id=?", taskId);
  if (findAttachToDelete.rows > 0) {
    for(let i=0; i<findAttachToDelete.length; i++) {
      let taskAttConnectionDeleted = db.query("DELETE FROM tasks_attachments WHERE tsk_id=?", findAttachToDelete[i].att_id);
      let attDeleted = db.query("DELETE FROM attachments WHERE att_id=?", findAttachToDelete[i].att_id)
    }
  }
  /*let attDeleted = db.query(`DELETE FROM attachments 
                              WHERE att_id IN (
                              SELECT att_id FROM tasks_attachments
                              WHERE tsk_id=?
                            )`, taskId);
  let taskAttConnectionDeleted = db.query("DELETE FROM tasks_attachments WHERE tsk_id=?", taskId);*/
  let commDeleted = db.query("DELETE FROM comments WHERE tsk_id=?", taskId);
  let catDeleted = db.query("DELETE FROM task_categories WHERE tsk_id=?", taskId);
  let taskDeleted = db.query("DELETE FROM tasks WHERE tsk_id=?", taskId);
  response.status(200);
  write("msg", "Task was succesfully deleted");
} else {
    response.status(400);
    write('msg', 'You are not authorized to delete this task.');
    exit();
}
  

}
}