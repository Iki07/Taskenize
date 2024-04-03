module.exports = (MARSModules) => {
with (MARSModules) {

/********* provera sesije i preuzimanje podataka o korisniku *************/
let userData = session('userData');
const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId;

let commentId = param("id");
let commentText = param("commentText");

let commentCreatedBy = db.query("SELECT usr_id FROM comments WHERE com_id = ?", commentId);
if (commentCreatedBy[0].usr_id == userId) {
  db.query("UPDATE comments SET com_text=? WHERE com_id=?", commentText, commentId);
} else {
  write('msg', 'You cannot edit this comment.')
}

}
}