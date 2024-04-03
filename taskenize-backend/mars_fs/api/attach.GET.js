module.exports = (MARSModules) => {
with (MARSModules) {
//prikaz svih attach-a za task/projekat
/********* provera sesije i preuzimanje podataka o korisniku *************/
let userData = session('userData');
const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId;
let taskId = param("taskId");
let projectId = param("projectId");
write("projectId",projectId);
//let userId = param("userId"); //za testiranje samo
let allAttachments;
let isProjectMember = false;
let isAssignedTo = false;
const util = include("api/.util-auth");

//provera da li korisnik moze da vidi attachments (tj projekat ili task, dodaj parametre koji fale za proveru)

if (projectId) {
    let projectMember = db.query("SELECT 1 FROM users_projects WHERE usr_id = ? AND prj_id =? AND status = 1", userId, projectId);
    if (projectMember.rows > 0) {
      isProjectMember = true;
    }
}

if (taskId) {
  let assignedTo = db.query("SELECT tsk_assigned FROM tasks WHERE tsk_id = ? AND tsk_status = 1", taskId);
  if (assignedTo.rows > 0 && assignedTo[0].tsk_assigned == userId) {
    isAssignedTo = true;
    }
}

if (taskId && (isAssignedTo || isProjectMember)) {
    allAttachments = db.query(`SELECT a.att_id, a.att_title 
                                FROM attachments a
                                LEFT JOIN tasks_attachments ta ON a.att_id = ta.att_id
                                WHERE ta.tsk_id = ${taskId} AND ta.status = 1
                                ORDER BY a.att_created DESC`);
  } else if (projectId && isProjectMember) {
    allAttachments = db.query(`SELECT a.att_id, a.att_title 
                                  FROM attachments a
                                  LEFT JOIN projects_attachments pa ON a.att_id = pa.att_id
                                  WHERE pa.prj_id = ${projectId} AND pa.status = 1
                                  ORDER BY a.att_created DESC`);
  } else {
  write('msg', "You are not authorized.")
  exit();
}


//let baseUrl = util.baseUrl;
let baseUrl = "http://307w123.e2.mars-hosting.com";//za testiranje
write("baseURL", baseUrl);
let attachmentsWithUrl =[];
if (allAttachments.rows > 0) {
  for (let i=0; i < allAttachments.length; i++) {
    let attach = allAttachments[i];
    attachmentsWithUrl.push({
      id: attach.att_id,
      title: attach.att_title,
      url: `${baseUrl}/api/attach/${attach.att_id}`
    })
  }
}

write('allAttachments', allAttachments)
write('attachmentsWithUrl', attachmentsWithUrl)

}
}