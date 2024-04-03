module.exports = (MARSModules) => {
with (MARSModules) {
let userData = session('userData');;

const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId
let userName = userData.userName;

let userInfo = auth.fetchUserInfo(userId, userName);
let userAuthData = userInfo.userAuthData;

const util = include("api/.util");
let isUserAdmin = util.countWsps (2, userAuthData) > 0;
if(!isUserAdmin) {
  response.code(400);
  write('msg', 'You are not authorized to perform this action.');
  exit();
}

const validation = include("api/.util-validation");

let name = param("name");
let email = param("email");
let roleIds = param("roleIds");//niz izabranih rola
let wspId = param ("wspId");
let teamId = param ("teamId");//nije obavezan
let title, header, messagePart, linkText, linkUrl, message, subject;
let insertParams = {};

if(name == null || email == null || wspId == null){
    response.status(422);
    write('msg', 'Missing data');
    exit();
}

if (!roleIds || roleIds.length == 0) {
  roleIds = [3];
} else {
  for (let i=0; i< roleIds.length; i++) {
      roleIds[i] = int(roleIds[i]);
  }
}

let roles = roleIds.join(", ");

name = validation.prepareString(name);
write("name", name);

function generatePassword(length) {
  let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  let n = charset.length;
  for (let i=0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random()*n));
  }
  return password;
}
let password = generatePassword(8);
write("password", password);

let baseUrl = auth.baseUrl;
write("baseUrl", baseUrl);

function bulkInsertURW (userId, roleIds, wspId, status, table) {
  //let valueCombos = roleIds.map(roleId => `${userId}, ${roleId}, ${wspId}, ${status})`).join(", ");
  let valueCombos = "";
  for (let i=0; i<roleIds.length; i++) {
    valueCombos += `(${userId}, ${roleIds[i]}, ${wspId}, ${status})`;
    if (i < roleIds.length -1) {
      valueCombos += ","
    }
  }
  return `INSERT INTO ${table} (usr_id, rol_id, wsp_id, status) VALUES ${valueCombos};`;
}

let checkUserExists = db.query("select usr_id from users where usr_email = ?", email);
let userExists = checkUserExists.rows > 0;
if(userExists){
  let userId = checkUserExists[0].usr_id;

  let checkRoleWspCombo = db.query(`SELECT rol_id, wsp_id 
                                        FROM user_roles_wsps 
                                        WHERE usr_id=${user_id} AND rol_id IN ${roles} AND wsp_id=${wspId}?`);
  if(checkRoleWspCombo.rows > 0) {
    write('msg', 'User already has role assigned.');
    exit();
  } else {
    let createRoleWspLink = bulkInsertURW(userId, roleIds, wspId, 1, 'users_roles_wsps');
    db.query(createRoleWspLink);
  }
  
  let checkTeam = db.query("SELECT tem_id FROM users_teams WHERE usr_id =? AND tem_id=?", userId, teamId);
  if(checkTeam.rows > 0) {
    write('msg', 'User is already assigned to that team.');
    exit();
  } else {
    db.query("INSERT INTO users_teams SET usr_id=?, tem_id=?", userId, teamId);
  }

  subject = "Taskenize - New Workspace Assigned"
  title = "Your account has been modified by admin";
  header = "Hello from Taskenize";
  messagePart = "Your admin has modified your account.";
  linkText = "Login";
  linkUrl = baseUrl +"/login";
  write("link: ", linkUrl);
  message = auth.generateEmailMessage(title, header, messagePart, linkText, linkUrl);

} else {

  let createNewUser = db.query("INSERT INTO users SET usr_name = ?, usr_email = ?, usr_password = ?, usr_status = 2", name, email, password);
  let userId = createNewUser[0].id;
  
  let createRoleWspLink = bulkInsertURW(userId, roleIds, wspId, 2, 'users_roles_wsps');
  db.query(createRoleWspLink);
  
  if(teamId) {
    db.query("INSERT INTO users_teams SET usr_id=?, tem_id=?, status = 2", userId, teamId);
  }
  
  let token = auth.generateToken(email);
  write("token", token);
  
  subject = 'Taskenize - New User Verification';
  title = "New user verification";
  header = "Welcome to Taskenize";
  messagePart = "You have just been added to Taskenize. Please update your password by clicking on the following link:";
  linkText = "Update Password";
  linkUrl = `${baseUrl}reset-confirmation?token=${encodeURIComponent(token)}`;
  write("verificationUrl", linkUrl);
  message = auth.generateEmailMessage(title, header, messagePart, linkText, linkUrl);
  
}

let myMail = auth.myMail;

let from = 'noreply@taskenize.com';
let to = email;

//auth.sendEmail(myMail, subject, from, to, message);
}
}