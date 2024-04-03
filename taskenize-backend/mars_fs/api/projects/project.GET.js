module.exports = (MARSModules) => {
with (MARSModules) {

let userData = session('userData');

const auth = include("api/.util-auth");
auth.checkSession(userData);

let userId = userData.userId;

let projectsWherePM = db.query(`SELECT prj_id, prj_name, prj_status, prj_end_planned, prj_img 
                                  FROM projects 
                                  WHERE pm_id = ${userId} AND NOT prj_status = 0
                                  ORDER BY prj_created DESC`);
if (projectsWherePM.rows == 0) {
  write('msg1', 'There are no projects you manage.')
}                                  
write("projectsWherePM", projectsWherePM);

let projectsWhereAssigned = db.query(`SELECT p.prj_id, p.prj_name, p.prj_status, p.prj_end_planned, p.pm_id, p.prj_img
                                        FROM projects p
                                        JOIN users_projects up ON p.prj_id = up.prj_id
                                        WHERE up.usr_id = ${userId} AND NOT p.pm_id = ${userId} AND NOT p.prj_status = 0
                                        ORDER BY prj_created DESC`);
if (projectsWhereAssigned.rows == 0) {
  write('msg2', 'There are no projects you are assigned to.')
}   
write("projectsWhereAssigned", projectsWhereAssigned);

let restOfTheProjects = db.query(`SELECT p.prj_id, p.prj_name, p.prj_status, p.prj_end_planned, 
                              p.prj_img,
                              p.pm_id, 
                              u.usr_name AS ProjectManager,
                              w.wsp_id, w.wsp_name
                              FROM projects p
                              JOIN projects_workspaces pw ON p.prj_id = pw.prj_id
                              JOIN workspaces w ON pw.wsp_id = w.wsp_id
                              JOIN users_roles_wsps urw ON w.wsp_id = urw.wsp_id
                              LEFT JOIN users u ON p.pm_id = u.usr_id
                              WHERE urw.usr_id = ${userId} AND NOT p.pm_id = ${userId} AND NOT p.prj_status = 0
                              AND p.prj_id NOT IN (
                                SELECT prj_id FROM users_projects WHERE usr_id = ${userId}
                                )
                              GROUP BY p.prj_id
                              ORDER BY prj_created DESC`);
if (restOfTheProjects.rows == 0) {
  write('msg3', 'There are no projects in workspaces you are assigned to.')
}                         
write("restOfTheProjects", restOfTheProjects);
}
}