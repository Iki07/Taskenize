module.exports = (MARSModules) => {
with (MARSModules) {
/********* provera sesije i preuzimanje podataka o korisniku *************/
let userData = session('userData');
const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId;

let attachId = param("id");
let canSeeAttach = false;
let projectId, teamId, assignedTo;

if (attachId) {
  let attachInfo = db.query(`SELECT p.prj_id, t.tsk_id, t.tsk_assigned, t.tem_id
                              FROM attachments a
                              LEFT JOIN projects_attachments pa ON a.att_id = pa.att_id
                              LEFT JOIN tasks_attachments ta ON a.att_id = ta.att_id
                              LEFT JOIN tasks t ON ta.tsk_id = t.tsk_id
                              LEFT JOIN teams tm ON t.tem_id = tm.tem_id
                              LEFT JOIN projects p ON pa.prj_id = p.prj_id OR t.prj_id = p.prj_id
                              WHERE a.att_id =${attachId}`);
  if (attachInfo.rows >0) {
    projectId = attachInfo[0].prj_id;
    assignedTo = attachInfo[0].tsk_assigned;
    teamId = attachInfo[0].tem_id;

    if(userId == assignedTo) {
      canSeeAttach = true;
    } else if (projectId) {
      let projectCheck = db.query("SELECT 1 FROM users_projects WHERE usr_id = ? AND prj_id =?", userId, projectId);
      if (projectCheck.rows > 0) {
        canSeeAttach = true;
      }
    } else if (teamId) {
      let teamCheck = db.query("SELECT 1 FROM users_teams WHERE usr_id=? AND tem_id=?", userId, teamId);
      if (teamCheck.rows > 0) {
        canSeeAttach = true;
      }
    }
  } else {
    write('msg', 'Attachment not found.')
  }
}

if(canSeeAttach) {
  let doc = db.query("SELECT att_title, att_content FROM attachments WHERE att_id=?", attachId);
  if (doc.rows == 0 || doc[0].att_content == null) {
    response.status('application/json');
    writeExit('not-found', 404);
    exit();
  }
  header("Content-Disposition", 'inline; filename="'+doc[0].att_title+'"');
  write(doc[0].att_content);

} else {
  write('msg', 'You are not authorized.');
  exit();
}

}
}