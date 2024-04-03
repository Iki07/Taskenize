module.exports = (MARSModules) => {
with (MARSModules) {
let userData = session('userData');;

const auth = include("api/.util-auth");
auth.checkSession(userData);

let loggedInUserId = userData.userId;
let loggedInUserName = userData.userName;
let loggedInUserInfo = auth.fetchUserInfo(loggedInUserId, loggedInUserName);
let loggedInUserAuthData = loggedInUserInfo.loggedInUserAuthData;

let userId = param("id");
let selectedWsp = param("selectedWsp");

const util = include("api/.util");
let isAdmin = util.checkUserRole(selectedWsp, 2, loggedInUserAuthData);

if(!isAdmin) {
  write('msg', 'You are not authorized to delete this user.');
  exit();
}

let userTasks = db.query("SELECT tsk_id, tsk_type FROM tasks WHERE tsk_assigned = ? AND NOT status = 0", userId);

db.query("UPDATE tasks SET tsk_assigned = NULL WHERE tsk_assigned =? AND tsk_type = 2 OR tsk_type = 3", userId);

for (let task of userTasks) {
  let taskId = task.tsk_id;
  let taskType = task.tsk_type;

  if(taskType = 1) {
    db.query("DELETE FROM tasks_categories WHERE tsk_id=?", taskId);
    db.query("DELETE FROM comments WHERE tsk_id=?", taskId)
    db.query("DELETE FROM tasks_atatchments WHERE tsk_id=?", taskId); 
    let findTaskAttachs = db.query("SELECT att_id FROM tasks_attachments WHERE tsk_id=?", taskId);
    let deleteTaskAttachLinks = db.query("DELETE FROM tasks_attachments WHERE tsk_id=?", taskId);
    for (let attId in findTaskAttachs) {
      let deletedTaskAttachs = db.query("DELETE FROM attachments WHERE att_id=?", att.att_id)
    }
  }
  db.query("DELETE FROM tasks WHERE tsk_id=?", taskId);
}

db.query("DELETE FROM users_projects WHERE usr_id=?", userId);
db.query("UPDATE projects SET pm_id = NULL WHERE pm_id=?", userId);

db.query("DELETE FROM users_teams WHERE usr_id=?", userId);
db.query("UPDATE teams SET tm_id = NULL WHERE tm_id=?", userId);

db.query("DELETE FROM users_roles_wsps WHERE usr_id=?", userId);

db.query("DELETE FROM users WHERE usr_id=?", usrId)


}
}