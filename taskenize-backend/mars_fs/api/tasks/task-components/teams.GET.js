module.exports = (MARSModules) => {
with (MARSModules) {
let userData = session('userData');

const auth = include("api/.util-auth");
auth.checkSession(userData);
let userId = userData.userId;
let selectedType = param("taskType");
if(selectedType !== 3){
  write('msg', "You cannot assign team to a non-team type task.")
}
let availableTeams = userInfo.teamsManaged;
write("availableTeams", availableTeams);   
}
}