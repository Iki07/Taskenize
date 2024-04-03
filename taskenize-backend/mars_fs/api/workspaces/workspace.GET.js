module.exports = (MARSModules) => {
with (MARSModules) {
let userData = session('userData');

const auth = include("api/.util-auth");
auth.checkSession(userData);
let userId = userData.userId;
let wspsUserAdministrates = db.query(`SELECT w.wsp_id, w.wsp_name, w.wsp_img, i.img_title                                
                                          FROM workspaces w 
                                          JOIN users_roles_wsps urw ON w.wsp_id = urw.wsp_id
                                          LEFT JOIN images i ON w.wsp_img = i.img_id
                                          WHERE urw.usr_id = ${userId} AND urw.rol_id = 2 AND w.wsp_status = 1
                                          ORDER BY wsp_created DESC`);
if (wspsUserAdministrates.rows == 0) {
  write('msg', 'There are no workspaces you administrate.');
}
write("wspsUserAdministrates", wspsUserAdministrates);

let wspsAssigned = db.query(`SELECT w.wsp_id, w.wsp_name, wspimg.img_id AS wsp_img_id, wspimg.img_title AS wspAvatar,
                                u.usr_id, u.usr_name AS admin, usrimg.img_id AS admin_img_id, usrimg.img_title AS adminAvatar,
                                GROUP_CONCAT (DISTINCT r.rol_name SEPARATOR ',') AS roles
                                FROM workspaces w
                                JOIN users_roles_wsps urw ON w.wsp_id = urw.wsp_id
                                JOIN users u ON urw.usr_id = u.usr_id
                                LEFT JOIN images wspimg ON w.wsp_img = wspimg.img_id
                                LEFT JOIN images usrimg ON u.usr_img = usrimg.img_id
                                JOIN roles r ON urw.rol_id = r.rol_id
                                WHERE urw.usr_id = ${userId} AND NOT urw.rol_id = 2
                                GROUP BY w.wsp_id, u.usr_id
                                ORDER BY wsp_created DESC`);
if (wspsAssigned.rows == 0) {
  write('msg', 'There are no other workspaces you belong to.');
}
write("wspsAssigned", wspsAssigned);

//za avatara front salje poseban zahtev na osnovu wsp_img i usr_img

}
}