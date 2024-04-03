module.exports = (MARSModules) => {
with (MARSModules) {
let name = param("name");
let email = param("email");
let password = param("password");

if(name==null || email==null || password==null){
    response.status(422);
    write('msg', 'Missing data');
    exit();
}

let sqlParams = {
  "usr_name": name,
  "usr_email": email,
  "usr_password": bcrypt(password)
};

let checkUserExists = db.query("select 1 from users where usr_email = :usr_email", sqlParams);
let userExists = checkUserExists.rows > 0;

if(userExists){
  response.status(409);
  write('msg', 'User already exists. Try logging in.');//na frontu: ponudi login ili password reset...
  exit();
}

let insertNewUser = db.query("insert into users set usr_name = :usr_name, usr_email = :usr_email, usr_password = :usr_password, usr_status = 2", sqlParams);

const util = include("api/.util-auth");
let token = util.generateToken(email);
write("token", token);

let baseUrl = util.baseUrl;
write("baseUrl", baseUrl);
const verificationUrl = `${baseUrl}reg-confirmation?token=${encodeURIComponent(token)}`;
write("verUrl", verificationUrl);


let myMail = util.myMail;
let subject = 'Taskenize - registration verification';
let from = 'noreply@taskenize.com';
let to = email;

let title = "Email verification";
let header = "Welcome to Taskenize";
let messagePart = "Please confirm your registration by clicking on the following link:";
let linkText = "Confirm Email";
let linkUrl = verificationUrl;
write("verification url: ", linkUrl);

let message = util.generateEmailMessage(title, header, messagePart, linkText, linkUrl);

util.sendEmail(myMail, subject, from, to, message);
}
}