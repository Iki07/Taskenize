module.exports = (MARSModules) => {
with (MARSModules) {
const auth = include("api/.util-auth");
let userData = session('userData');
let userId = userData.userId;
let userName = userData.userName;
let userInfo = auth.fetchUserInfo(userId, userName);
write ('userData', userInfo);
}
}