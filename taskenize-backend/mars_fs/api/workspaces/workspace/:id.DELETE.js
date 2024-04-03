module.exports = (MARSModules) => {
with (MARSModules) {
/********* provera sesije *************/
let userData = session('userData');

const auth = include("api/.util-auth");
auth.checkSession(userData)

let userId = userData.userId;
let userName = userData.userName;
let userInfo = auth.fetchUserInfo(userId, userName);//nova linija, minimiziranje impakta na front
let userAuthData = userInfo.userAuthData;

let wspId = param("id");

const util = include("api/.util");
let isAdmin = util.roleCheck(wspId, 2, userAuthData);
write("isAdmin", isAdmin);

if(!isAdmin) {
  write('msg','You are not authorized to delete this workspace.');
  exit();
}

let exclusiveWspMembers = db.query(`SELECT usr_id
                                        FROM users_roles_wsps
                                        WHERE usr_id IN (SELECT usr_id 
                                                                FROM users_roles_wsps                                               
                                                                WHERE wsp_id = ${wspId} AND status = 1)
                                        GROUP BY usr_id 
                                        HAVING COUNT(DISTINCT wsp_id) = 1`);
write("exclusiveWspMembers",exclusiveWspMembers);
let exclusiveProjects = db.query(`SELECT prj_id 
                                        FROM projects_workspaces 
                                        WHERE prj_id IN (SELECT prj_id
                                                                FROM projects_workspaces
                                                                WHERE wsp_id = ${wspId} AND status = 1)                                      
                                        GROUP BY prj_id 
                                        HAVING COUNT (DISTINCT wsp_id) = 1`);
write("exclusiveProjects",exclusiveProjects);

//TypeError: invokeMember (some) on script.graal.GraalTable@9997db7 failed due to: Unknown identifier: some
/*function isUserExclusive(userId){
  return exclusiveWspMembers.some(member => member.usr_id === userId);
}      
function isProjectExclusive(projectId){
  return exclusiveProjects.some(project => project.prj_id === projectId);
}
alternativa?:
function isExclusive (queryResult, column, id) {
  for (let i=0; i < queryResult.length; i++) {
    if (queryResult[i].[column] == id) {
      return true;
    }
  }
  return false;
}*/

function isUserExclusive(userId) {
  for (let i=0; i < exclusiveWspMembers.length; i++) {
    if (exclusiveWspMembers[i].usr_id == userId) {
      return true;
    }
  }
  return false;
}

function isProjectExclusive(projectId) {
  for (let i=0; i < exclusiveProjects.length; i++) {
    if (exclusiveProjects[i].prj_id == projectId) {
      return true;
    }
  }
  return false;
}

function deleteRelatedTask(taskId) {
  db.query("UPDATE tasks SET tsk_status = 0 WHERE tsk_id = ?", taskId);
  db.query("UPDATE tasks_attachments SET status = 0 WHERE tsk_id=?", taskId)
}

function updateTaskWsp(taskId) {
  db.query("UPDATE tasks SET wsp_id = NULL WHERE tsk_id = ?", taskId)
}

let findWspTasks = db.query("SELECT tsk_id, tsk_type, tsk_assigned, prj_id FROM tasks WHERE wsp_id = ? AND NOT tsk_status = 0", wspId)
for (let task of findWspTasks) {
  let taskId = task.tsk_id;
  let taskType = task.tsk_type;
  let projectId = task.prj_id;
  let userAssigned = task.tsk_assigned;

  switch (taskType) {
    case 1:
      if(isUserExclusive(userAssigned)) {
        deleteRelatedTask(taskId);
      } else {
        updateTaskWsp(taskId)
      }
      break;
      case 2:
      if(isProjectExlcusive(projectId)) {
        deleteRelatedTask(taskId);
      } else {
        updateTaskWsp(taskId)
      }
      break;
      case 3:
        deleteRelatedTask(taskId)
        break;
  }
}

let findWspProjects = db.query("SELECT prj_id FROM projects_workspaces WHERE wsp_id = ? AND NOT status = 0", wspId);
for (let project of findWspProjects) {
  let projectId = project.prj_id;
  db.query("UPDATE projects_workspaces SET status = 0 WHERE prj_id=? AND wsp_id=?", projectId, wspId);
  if(isProjectExclusive(projectId)) {
    db.query("UPDATE projects SET prj_status = 0 WHERE prj_id=?", projectId);
  }
}

let findWspMembers = db.query("SELECT usr_id FROM users_roles_wsps WHERE wsp_id = ? AND NOT status = 0 GROUP BY usr_id", wspId);
for (let member of findWspMembers) {
  let userId = member.usr_id;
  db.query("UPDATE users_roles_wsps SET status = 0 WHERE usr_id=? AND wsp_id=?", userId, wspId);
  if(isUserExclusive(userId)) {
    db.query("UPDATE users SET usr_status = 0 WHERE usr_id=?", userId);
  }
}

let findWspTeams = db.query("SELECT tem_id FROM teams WHERE wsp_id = ? AND NOT tem_status = 0", wspId);
for (let team of findWspTeams){
  let teamId = team.tem_id;
  db.query("UPDATE users_teams SET status = 0 WHERE tem_id=?", teamId);
  db.query("UPDATE teams SET tem_status = 0 WHERE wsp_id=?", wspId);
}

db.query("UPDATE workspaces SET wsp_status=0 WHERE wsp_id =?", wspId);

write('msg', 'You have succesfully deleted the workspace.');

}
}