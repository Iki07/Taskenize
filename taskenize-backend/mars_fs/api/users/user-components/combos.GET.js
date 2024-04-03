module.exports = (MARSModules) => {
with (MARSModules) {
let userData = session('userData');;
const auth = include("api/.util-auth");
auth.checkSession(userData);
let userId = userData.userId;
let wspsAvailable = db.query(`SELECT w.wsp_id, w.wsp_name                              
                                    FROM workspaces w 
                                    JOIN users_roles_wsps urw ON w.wsp_id = urw.wsp_id
                                    WHERE urw.usr_id = ${userId} AND urw.rol_id = 2 AND urw.status = 1
                                    ORDER BY w.wsp_created DESC`);
if (wspsAvailable.rows == 0) {
  write('msg', 'There are no workspaces you administrate.');
  exit();
}
write("wspsAvailable", wspsAvailable);

let rolesAvaialble = db.query("SELECT rol_id, rol_name FROM roles WHERE rol_status = 1 AND rol_id NOT IN (1, 3, 6)");
write("rolesAvaialble", rolesAvaialble);

let wspsAvailableIds=[];
for (let i=0; i < wspsAvailable.rows; i++) {
  wspsAvailableIds.push(wspsAvailable[i].wsp_id);
}
let wspsAvailableIdsStr = wspsAvailableIds.join(", ");

let availableCombos = db.query(`SELECT w.wsp_id, r.rol_id                           
                                    FROM workspaces w 
                                    JOIN users_roles_wsps urw ON w.wsp_id = urw.wsp_id
                                    JOIN roles r ON urw.rol_id = r.rol_id
                                    WHERE urw.wsp_id IN (${wspsAvailableIdsStr}) AND r.rol_id IN (2, 4, 5) AND urw.status = 1
                                    GROUP BY w.wsp_id, r.rol_id
                                    ORDER BY w.wsp_id ASC, r.rol_id ASC`);
write("availableCombos", availableCombos);  

let existingCombos = db.query(`SELECT w.wsp_id, r.rol_id                          
                                    FROM workspaces w 
                                    JOIN users_roles_wsps urw ON w.wsp_id = urw.wsp_id
                                    LEFT JOIN roles r ON urw.rol_id = r.rol_id
                                    WHERE urw.wsp_id IN (${wspsAvailableIdsStr}) AND urw.usr_id = ${userId} AND urw.status = 1
                                    ORDER BY w.wsp_id ASC`);
write("existingCombos", existingCombos);  
}
}