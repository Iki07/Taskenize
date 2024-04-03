module.exports = (MARSModules) => {
with (MARSModules) {
/********* provera sesije i preuzimanje podataka o korisniku *************/
let userData = session('userData');

const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId;
let comment = param("comment");
//let userId = param("userId");//samo za testiranje
let taskId = param("taskId");
let projectId = param("projectId");
let teamId = param("teamId");
let assignedTo = param("assignedTo");
let canAddComment;

const validation = include("api/.util-validation");

//provera da li user moze da ostavi komentar
if(userId == assignedTo) {
  canAddComment = true;
} else if (projectId && projectId != 0) {
  //moze ako je PM na projektu
  let projectCheck = db.query("SELECT 1 FROM projects WHERE prj_id = ? AND pm_id =? AND NOT prj_status = 0", projectId, userId);
  if (projectCheck.rows > 0) {
    canAddComment = true;
  }
} else if (teamId && teamId != 0) {
  //moze ako je TM u timu
  let teamCheck = db.query("SELECT 1 FROM teams WHERE tem_id=? AND tm_id=? AND tem_status = 1", teamId, userId);
  if (teamCheck.rows > 0) {
    canAddComment = true;
  }
} 

if(canAddComment) {
  if(comment) {
    comment = validation.prepareString(comment);
    let insertParamsComment = {
      "com_text": comment,
      "usr_id": userId,
      "tsk_id": taskId
    };
    db.insert("comments").set(insertParamsComment).exec();
  } else {
    write('msg', 'There is no comment to add.');
  }
} else {
  write('msg', 'You are not authorized to perform this action.');
  exit();
}

}
}