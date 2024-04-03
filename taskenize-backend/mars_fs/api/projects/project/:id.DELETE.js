module.exports = (MARSModules) => {
with (MARSModules) {

let userData = session('userData');;

const auth = include("api/.util-auth");
auth.checkSession(userData);
let userId = userData.userId;
let userName = userData.userName;
let userInfo = auth.fetchUserInfo(userId, userName);
let userAuthData = userInfo.userAuthData;

let projectId = param("id");
let pmId, avatarId, projectWsps, allProjectWsps;
if(!projectId) {
  write('msg', 'No project id provided')
} else {
  let projInfo = db.query(`SELECT p.pm_id, p.prj_img, GROUP_CONCAT(pw.wsp_id) AS wsps
                          FROM projects p
                          JOIN projects_workspaces pw ON p.prj_id = pw.prj_id  
                          WHERE p.prj_id = ${projectId} AND pw.status = 1
                          GROUP BY p.prj_id`);
  if (!projectId || projInfo.rows == 0) {
    write ('msg', 'No project found.')
  } else {
    pmId = projInfo[0].pm_id;
    avatarId = projInfo[0].prj_img;
    allProjectWsps = projInfo[0].wsps
  }
}

projectWsps = allProjectWsps.split(',');


const util = include("api/.util");
let isAdmin = util.checkUserRole (projectWsps, 2, userAuthData);
let isUserPM = pmId == userId;

if(!isUserPM || !isAdmin) {
  write('msg', 'You are not authorized to perform this task.');
  exit();
}
  //brisanje projektnih taskova
  let findProjectTasks = db.query("SELECT tsk_id FROM tasks WHERE prj_id=?", projectId);
  for (let task of findProjectTasks) {
    let taskId = task.tsk_id;
    let deletedTaskCatLinks = db.query("DELETE FROM task_categories WHERE tsk_id=?", taskId);
    let deletedComments = db.query("DELETE FROM comments WHERE tsk_id=?", taskId);//ovo mi vise ne treba
    let findTaskAttachs = db.query("SELECT att_id FROM tasks_attachments WHERE tsk_id=?", taskId);
    let deleteTaskAttachLinks = db.query("DELETE FROM tasks_attachments WHERE tsk_id=?", taskId);
    for (let attId in findTaskAttachs) {
      let deletedTaskAttachs = db.query("DELETE FROM attachments WHERE att_id=?", att.att_id)
    }
  } 
  let deletedTasks = db.query("DELETE FROM tasks WHERE prj_id=?", projectId);       
  //brisanje avatara
  let projectAvatar = db.query ("SELECT prj_img FROM projects WHERE prj_id = ?", projectId);
  if (projectAvatar.rows > 0) {
    let deleteProjectAvatar = ("DELETE FROM images WHERE img_id = ?", projectAvatar[0].prj_img)
  }
  //brisanje projektnih attacha
  let findProjectAttachs = db.query("SELECT att_id FROM projects_attachments WHERE prj_id=?", projectId);
    let deleteProjectAttachLinks = db.query("DELETE FROM projects_attachments WHERE prj_id=?", projectId);
    for (let attach in findProjectAttachs) {
      let deletedProjectAttachs = db.query("DELETE FROM attachments WHERE att_id=?", attach.att_id)
    }
  //brisanje veza users_projects
  let deletedProjectMembers = db.query("DELETE FROM users_projects WHERE prj_id=?", projectId);
  //brisanje veze sa wspom
  let deletedWspLink =db.query("DELETE FROM projects_workspaces WHERE prj_id=?", projectId);
  //konacno, brisanje projekta
  let deletedProject = db.query("DELETE FROM projects WHERE prj_id=?", projectId)
  write('msg', 'Project deleted successfully');  


//da probam da sve transakcije stavim u try blok???

/*soft delete
//brisanje projektnih taskova
  let findProjectTasks = db.query("SELECT tsk_id FROM tasks WHERE prj_id=?", projectId);
  for (let task of findProjectTasks) {
    let taskId = task.tsk_id;
    let deletedTaskCatLinks = db.query("UPDATE task_categories SET status = 0 WHERE tsk_id=?", taskId);
    let deleteTaskAttachLinks = db.query("UPDATE tasks_attachments SET status 0 WHERE tsk_id=?", taskId);
  }    
  let deletedTasks = db.query("UPDATE tasks SET tsk_status = 0 WHERE prj_id=?", projectId);   
  //brisanje projektnih attacha
  let deleteProjectAttachLinks = db.query("UPDATE projects_attachments SET status = 0 WHERE prj_id=?", projectId);
  //brisanje veza users_projects
  let deletedProjectMembers = db.query("UPDATE users_projects SET status = 0 WHERE prj_id=?", projectId);
  //brisanje veze sa wspom
  let deletedWspLink =db.query("UPDATE projects_workspaces SET status = 0 WHERE prj_id=?", projectId);
  //konacno, brisanje projekta
  let deletedProject = db.query("UPDATE projects SET prj_status = 0 WHERE prj_id=?", projectId)*/

}
}