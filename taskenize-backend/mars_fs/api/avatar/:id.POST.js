module.exports = (MARSModules) => {
with (MARSModules) {
/********* provera sesije i preuzimanje podataka o korisniku *************/
let userData = session('userData');
const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId;
let imgId = param("id");

let avatarToBeDeleted = db.query("SELECT img_type FROM images WHERE img_id=?", imgId);
let avatarType = avatarToBeDeleted[0].img_type;
let removeImage;

switch (avatarType) {
  case "profile":
    let profile = db.query("SELECT usr_id FROM users WHERE usr_img=?", imgId);
    if (profile.rows > 0) {
      if (userId == profile[0].usr_id) {
        removeImage = db.query("UPDATE users SET usr_img = NULL WHERE usr_img=?", imgId);
      } else {
        write('msg', 'You are not authorized');
        exit();
      }
    } else {
      write('msg','No profile linked to this avatar.');
      exit();
    }
    break;
  case "project":
    let project = db.query("SELECT pm_id FROM projects WHERE prj_img=?", imgId);
    if (project.rows > 0) {
      if (userId == project[0].pm_id) {
        removeImage = db.query("UPDATE projects SET prj_img = NULL WHERE prj_img=?", imgId);
      } else {
        write('msg', 'You are not authorized');
        exit();
      }
    } else {
      write('msg','No project linked to this avatar.');
      exit();
    }
    break;
  case "team":
    let team = db.query("SELECT tm_id FROM teams WHERE tem_img=?", imgId);
    if (team.rows > 0) {
      if (userId == team[0].tm_id) {
        removeImage = db.query("UPDATE teams SET tem_img = NULL WHERE tem_img=?", imgId);
      } else {
        write('msg', 'You are not authorized');
        exit();
      }
    } else {
      write('msg','No team linked to this avatar.');
      exit();
    }
    break;
  case "workspace":
    let workspace = db.query("SELECT wsp_id FROM workspaces WHERE wsp_img=?", imgId);
    if (workspace.rows > 0) {
      let wspId = workspace[0].wsp_id;
      let admin = db.query("SELECT usr_id FROM users_roles_workspaces WHERE wsp_id = ? AND rol_id = 2 AND status = 1", wspId);
      if (admin.rows > 0) {
        if (userId == admin[0].usr_id) {
          removeImage = db.query("UPDATE workspaces SET wsp_img = NULL WHERE wsp_img=?", imgId);
          } else {
            write('msg', 'You are not authorized');
            exit();
          } 
        } else {
          write('msg', 'No admin defined.');
          exit();
        }
    } else {
      write('msg','No workspace linked to this avatar.');
      exit();
    }
    break;
  }
    
db.query("DELETE FROM images WHERE img_id=?", imgId);

//obrada gresaka u rukovanju bazom

}
}