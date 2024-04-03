module.exports = (MARSModules) => {
with (MARSModules) {
//prikaz svih komentara za jedan task
/********* provera sesije i preuzimanje podataka o korisniku *************/
let userData = session('userData');

const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId;
let taskId = param("taskId");
//provera da li korisnik moze da vidi komentar (ako korisnik moze da vidi task moze da vidi i komentar)
let allComments = db.query("SELECT * FROM comments WHERE tsk_id=? AND NOT tsk_status = 0 ORDER BY com_created DESC", taskId);
write("allComments", allComments)
}
}