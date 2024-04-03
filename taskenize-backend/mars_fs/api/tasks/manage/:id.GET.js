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
write('userId', userId);

//pregled pojedinacnog taska
let taskId = param("id");
write("taskId", taskId);
let canSeeTask = false;

if (!taskId) {
  write('msg', "No task found");
  exit();
}

let taskInfo = db.query("SELECT tsk_assigned, prj_id, tem_id FROM tasks WHERE tsk_id=? AND NOT tsk_status = 0", taskId);
let assignedTo = taskInfo[0].tsk_assigned;
write("assignedTo", assignedTo);
let projectId = taskInfo[0].prj_id
write("projectId", projectId);
let teamId = taskInfo[0].tem_id;
write("teamId", teamId);

if(userId == assignedTo) {
  canSeeTask = true;
} else if (projectId && projectId != 0) {
  //moze da vidi task ako je na istom projektu
  let projectCheck = db.query("SELECT 1 FROM users_projects WHERE usr_id = ? AND prj_id =? AND status = 1", userId, projectId);
  if (projectCheck.rows > 0) {
    canSeeTask = true;
  }
} else if (teamId && teamId != 0) {
  //ako je u istom timu
  let teamCheck = db.query("SELECT 1 FROM users_teams WHERE usr_id=? AND tem_id=? AND status = 1", userId, teamId);
  if (teamCheck.rows > 0) {
    canSeeTask = true;
  }
} 
write("canSeeTask", canSeeTask);

if(canSeeTask) {
  let taskSelected = db.query("SELECT * FROM tasks_overview WHERE TaskID=?", taskId);
  //prouci sta sa attachom, posebno kada ih ima vise
  let attachments = db.query( `SELECT a.att_id, a.att_title, a.att_content 
                              FROM attachments a
                              INNER JOIN tasks_attachments ta ON a.att_id = ta.att_id
                              WHERE ta.tsk_id = ${taskId} AND ta.status = 1`);

  let comments = db.query(`SELECT c.com_id, c.com_text, c.com_created, u.usr_id, u.usr_name AS Comment_by
                            FROM comments c
                            INNER JOIN users u ON c.usr_id = u.usr_id
                            WHERE c.tsk_id = ${taskId}`);
  write("taskSelected", taskSelected);
  write("attachments", attachments);
  write("comments", comments)
} else {
    response.status(403);
    write('msg', 'You are not authorized to see this task.');
    exit();
}
  

}
}