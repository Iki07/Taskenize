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

let attachId = param("id");
write("attachId", attachId);

let projectId, teamId, assignedTo, taskId, pmId, tmId;

//obrada gresaka?
let canDeleteAttach = false;

let taskAttach = db.query(`SELECT a.att_id, a.att_title
                                  FROM attachments a
                                  LEFT JOIN tasks_attachments ta ON a.att_id = ta.att_id
                                  WHERE a.att_id = ${attachId}`);
let isTaskAttach = taskAttach.rows > 0;

if(!isTaskAttach) {
  let projectInfo = db.query(`SELECT a.att_id, a.att_title,
                                  p.pm_id,
                                  FROM attachments a
                                  LEFT JOIN projects_attachments pa ON a.att_id = pa.att_id
                                  LEFT JOIN projects p ON pa.prj_id = p.prj_id
                                  WHERE a.att_id = ${attachId}`);
  pmId = projectInfo[0].pm_id;
} else {
  let taskInfo = db.query(`SELECT a.att_id, a.att_title,
                                  tsk.tsk_assigned,
                                  p.pm_id,
                                  t.tem_id
                                  FROM attachments a
                                  LEFT JOIN tasks_attachments ta ON a.att_id = ta.att_id
                                  LEFT JOIN tasks tsk ON ta.tsk_id = tsk.tsk_id
                                  LEFT JOIN projects p ON tsk.prj_id = p.prj_id
                                  LEFT JOIN teams t ON tsk.tem_id = t.tem_id
                                  WHERE a.att_id =${attachId}`);
  pmId = taskInfo[0].pm_id;
  tmId = taskInfo[0].tm_id;
  assignedTo = taskInfo[0].tsk_assigned
}

if(userId == assignedTo || userId == pmID || userId == tmId) {
      canDeleteAttach = true;
} 


if(canDeleteAttach){
  if(taskId) {
    db.query("DELETE FROM tasks_attachments WHERE att_id=?", attachId);
  } else {
    db.query("DELETE FROM projects_attachments WHERE att_id=?", attachId);
  }
  db.query("DELETE FROM attachments WHERE att_id=?", attachId);
  write('msg', "Attachment has been deleted.")
} else {
  write('msg', 'You are not authorized');
  exit();
}


}
}