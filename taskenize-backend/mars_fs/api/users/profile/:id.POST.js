module.exports = (MARSModules) => {
with (MARSModules) {
let userData = session('userData');;

const auth = include("api/.util-auth");
auth.checkSession(userData);
let loggedInUserId = userData.userId;

let userId = param("id");

if(loggedInUserId != userId) {
  write('msg', 'You are not authorized to edit user data.');
  exit();
}

let name = param("name");
let displayName = param("displayName");
let bio = param("bio");
let avatar = param("avatar");

if(!name || name == ""){
  response.status(422);
  write('msg', 'Name is mandatory.');
  exit();
};

let insertParams ={};
name = validation.prepareString(name);
write("name", name);
insertParams['usr_name']= name;

if(displayName) {
  displayName = validation.prepareString(displayName);
  insertParams['usr_display_name'] = displayName;
}
write("displayName", displayName);

if(bio) {
  bio = validation.prepareString(bio);
  insertParams['usr_bio'] = bio;
}
write("bio", bio);

//////////////////////////////////////////
if(avatar){
  let avatarIsOk = validation.validateFile(avatar, true);
  write("avatar is OK", avatarIsOk);
  if(avatarIsOk) {
    let avatarParams = {
      'img_title': avatar.fileName,
      'img_type': "profile",
      'img_image': avatar.data
    }                         
    let newImage = db.insert("images").set(avatarParams).exec();
    let avatarId = newImage[0].id;
    insertParams['usr_img'] = avatarId;
  }
}
////////////

let updatedProfile = db.update("users")
                      .set(insertParams)
                      .where("usr_id", "=", userId)
                      .exec();

}
}