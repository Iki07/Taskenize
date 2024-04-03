module.exports = (MARSModules) => {
with (MARSModules) {
let email = param("email");

write("email", email);

//provera da li korisnika sa emailom postoji u bazi i odg poruke
let checkUserExists = db.query("select 1 from users where usr_email = ?", email);
let userExists = checkUserExists.rows > 0;

if(!userExists){
  response.status(401);
  write('msg', "There has been an error. Please try again.");
  exit();
}

//ako korisnik postoji generisanje tokena i slanje mail-a
const util = include("api/.util-auth");
let token = util.generateToken(email);
write("token", token);

let baseUrl = util.baseUrl;
write("baseUrl", baseUrl);
const verificationUrl = `${baseUrl}reset-confirmation?token=${encodeURIComponent(token)}`;
write("verUrl", verificationUrl);

let myMail = util.myMail;

let subject = 'Taskenize - password verification';
let from = 'noreply@taskenize.com';
let to = email;

let message = `
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">
        <HTML>
        <HEAD>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <TITLE>Email verification</TITLE>
         </HEAD>
        <BODY>
            <H1>Password Request Verification</H1>
            <P>Please confirm that you have placed the request to update your Taskenize password by clicking on the following link:<BR>
            <A href="${verificationUrl}">Confirm</A></P>

        </BODY>
        </HTML>`; 
}
}