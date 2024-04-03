module.exports = (MARSModules) => {
with (MARSModules) {
const validation = include("api/.util-validation");

let email = param("email");
let password = param("password");

write("email", email);
write("password", password);

if(email==null || password==null){
    response.status(422);
    write('msg', 'Missing data');
    exit();
}

let validPassword = validation.validatePassword(password);
write ("valid pass:", validPassword);
if(!validPassword){
  response.status(400);
  write('msg', "Password must have min 8 charachters, min 1 capital letter, 1 digit and 1 special character.");
  exit();
}

password = bcrypt(password);
let updatedUser = db.query("UPDATE users SET usr_password = ?, usr_status = CASE WHEN usr_status = 2 THEN 1 ELSE usr_status END WHERE usr_email = ?", password, email);
write ("updatedUser: ", updatedUser);
if (updatedUser[0].count>0) {
  response.status(200);
  write('msg', "Password was succesfully changed. You will soon be redirected to login page.")
} else {
  response.status(400);
  write('msg', "There has been an error. Please try again.")
};

}
}