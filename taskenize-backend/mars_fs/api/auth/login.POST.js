module.exports = (MARSModules) => {
with (MARSModules) {
let email = param("email");
let password = param("password");

write ("email", email);

if(email==null || password==null){
  response.status(422);
  write('msg', 'Missing data');
  exit();
}

let userExists = db.query('SELECT * FROM users WHERE usr_email = ? AND usr_status = 1', email);

if(userExists.length == 0){
  response.status(401);
  write('msg', 'Unauthorized: Incorrect username or password.');
  exit();
}

let user = userExists[0];
write('user', user);
let userId = user.usr_id;
let userName = user.usr_name;
write('userId', userId);
let passwordOK = bcrypt(password, user.usr_password);
if(passwordOK){
  response.status(200);
  //dodati obradu gresaka prilikom izvrsavanja upita nad bazom
  let categories = db.query('SELECT cat_id, cat_name, tsk_type FROM categories WHERE cat_status = 1');
  let userData = {
    "userId": userId,
    "userName": userName
  };
  const auth = include("api/.util-auth");
  let userInfo = auth.fetchUserInfo(userId, userName);
  let sid = session();
  session('userData', userData);
  session('taskCategories', categories);
  write('msg', 'User logged in');
  write('sid', sid);
  write('userData', userInfo);
  write('taskCategories',categories)
}
else{
  response.status(401);
  write('msg', 'Unauthorized: Incorrect username or password.');
}
}
}