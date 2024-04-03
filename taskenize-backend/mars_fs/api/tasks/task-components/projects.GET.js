module.exports = (MARSModules) => {
with (MARSModules) {
let userData = session('userData');
const auth = include("api/.util-auth");
auth.checkSession(userData);
let userId = userData.userId;
let userName = userData.userName;
let selectedType = param("taskType");

if(selectedType !== 2){
  //response.status(400);//da li slati gresku?
  write('msg', "You cannot assign project to a non-project type task.")
}


let userInfo = auth.fetchUserInfo(userId, userName);
let availableProjects = userInfo.projectsManaged;
write("availableProjects", availableProjects);   
}
}