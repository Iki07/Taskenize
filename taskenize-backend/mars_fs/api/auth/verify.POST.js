module.exports = (MARSModules) => {
with (MARSModules) {
let token = param("token");
write("token", token);
let path = param("reg");
write("path", path);
if(!token){
    response.status(400);
    write('msg', 'Invalid or missing token');
    exit();
}

let originalToken = base64.decode(token,'UTF-8');
write("orginalToken", originalToken);
const [email, expirationTime] = originalToken.split(':');
write("email", email);
write("expirationTime", expirationTime);
write("trenutnoVreme", Date.now());
if(Date.now() > parseInt(expirationTime)) {
  response.status(400);
  write("error", "Token validity expired.");
  exit();
} else {
  response.status(200);
  write("msg", "Valid token.");
  
  let newUserToUpdate = db.query("UPDATE users SET usr_status = 1 WHERE usr_email=? AND usr_status = 2", email);
  if (newUserToUpdate[0].count > 0) {
    let createdUser = db.query("SELECT usr_id FROM users WHERE usr_email=?", email);
    let userId = createdUser[0].usr_id;
    db.query("UPDATE users_roles_wsps SET status = 1 WHERE usr_id = ?", userId);
    db.query("UPDATE users_teams SET status =1 WHERE usr_id =?", userId);
  }
  
}

if(path == "register") {
  let updateUser = db.query ("UPDATE users SET usr_status = 1 WHERE usr_email=?", email);
  //write ("updateUser: ", updateUser);

  let currentUser = db.query ("SELECT usr_id, usr_name FROM users WHERE usr_email = ?", email);
   write ("currentUser: ", currentUser);
  let userId = currentUser[0].usr_id;
   write ("userId: ", userId);
  let userName = currentUser[0].usr_name;
   write ("userName: ", userName);
  let wspName = userName.split(" ")[0] + "' Workspace";
   write ("wspName: ", wspName);
  let wspParams = {
    "wsp_name": wspName
  };
  let newWS = db.query("INSERT INTO workspaces SET wsp_name = :wsp_name", wspParams);
   write ("insertNewWS: ", newWS);
  let wspId = newWS[0].id;
  write ("wspId: ", wspId);
  
  db.query("INSERT INTO users_roles_wsps SET usr_id = ?, rol_id = ? , wsp_id = ?", userId, 2, wspId);
  db.query("INSERT INTO users_roles_wsps SET usr_id = ?, rol_id = ? , wsp_id = ?", userId, 3, wspId);
} 

}
}