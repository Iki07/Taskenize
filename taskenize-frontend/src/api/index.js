import axios from './config';

export default {
    /*appLogout(sid) {
        return axios.get("appauth/applogout?", {params: {sid} })
    },*/

    appSession(sid) {
        return axios.get("appauth/appsession", { sid })
    },
    getMyTasks(sid, userId) {
        return axios.get("tasks/manage?", {params: { sid, userId }})
    },
    goToTask(id, sid) { ///${id}, {params: {sid}}
        console.log(sid)
        return axios.get(`tasks/manage/${id}`, {params: {sid}})
    },
    deleteMyTask(sid, id) {
        return axios.delete(`tasks/manage/${id}`, {params: {sid}})
    },
    updateTask(id, formData) {
        return axios.post(`tasks/manage/${id}`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
    },
    updateComment(id, dto) {
        return axios.post(`comment/${id}`, dto)
    },
    addNewComment(dto) {
        return axios.post(`comment`, dto)
    },
    deleteComment(id, sid, userId) {
        return axios.delete(`comment/${id}`, {params: {sid, userId}})
    },
    deleteAttach(sid, id) {
        return axios.delete(`attach/${id}`, {params: {sid}})
    },
    addNewFile(formData) {
        return axios.post(`attach`, formData)
    },
    changeTaskStatus(status, id) {
        return axios.put(`manage/task/status`,  {status, id})
    },
    getUsersToAssign(dto) {
        return axios.get("tasks/task-components/assign-to?", {params: dto})
    },
    getWspsToAssign(dto) {
        return axios.get("tasks/task-components/wsps?", {params: dto})
    }, //ovde proveri da li se menja selectWsp
    createTask(formData) {
        return axios.post("tasks/create", formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
    },
    createProject(formData) {
        return axios.post("projects/project", formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
    },
    getMyProjects(sid, usrID) {
        return axios.get("projects/project?", {params: { sid, usrID }})
    },
    goToProject(sid, proID) {
        return axios.get(`projects/project/${proID}`, {params: {sid}})
    },
    deleteMyProject(id, sid) {
        return axios.delete(`projects/project/${id}`, {params: {sid}})
    },
    getProWspsForSelect(sid, usrID) {
        return axios.get(`projects/project-components/workspaces?`,
        {params: {sid, usrID}})
    },
    getPMforAssign(dto) {//sid, usrID, wsId
        return axios.get("projects/project-components/assign-to?",
        {params: dto})
    },
    // proTeam() {
    //     return axios.get()
    // },
    editPro(proID, formData) {
        return axios.post(`projects/project/${proID}`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
    },
    getAttach(sid, projectId) {
        return axios.get("attach?", {params: {sid, projectId}})
    },
    getAvatar(sid, id) {
        return axios.get(`avatar/${id}`, {params: {sid}})
    },
    addWsps(formData) {
        return axios.post(`workspaces/workspace`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
    },
    getMyWsps(sid) {
        return axios.get("workspaces/workspace?", { params: { sid } })
    },
    selectOneWs(id, sid) {
        return axios.get(`workspaces/workspace/${id}`, { params: { sid }})
    },
    getWspUsers(sid, wspId) {
        return axios.get(`workspaces/ws-components/assign-to?`, {params: {sid, wspId}})
    },
    wspsUpdate(id, formData) {
        return axios.post(`workspaces/workspace/${id}`, formData)
    },
    deleteWsPs(id, sid) {
        return axios.delete(`workspaces/workspace/${id}`, {params: {sid}})
    },
    getAvailableWsps(sid) {
        return axios.get(`users/user-components/combos`, {params: {sid}})
    },
    createNewUsr(dto) {
        return axios.post(`users/user`, dto)
    },
    getUsers(sid) {
        return axios.get("users/user", {params: {sid}})
    },
    goToProfile(sid, id) {
        return axios.get(`users/user/${id}`, {params: {sid}})
    },
    //odavde na dole Irenini login fajlovi
    registerUser (user) {
        return axios.post("auth/register", user);
    }, 

    loginUser (user) {
        return axios.post("auth/login", user);
    },

    verifyToken (token, reg = null) {
        return axios.post("auth/verify", {token, reg});
    },

    resetPasswordRequest (email) {
        return axios.post("auth/reset-request", {email});
    },

    changePassword (user) {
        return axios.post("auth/change-password", user);
    },
    
    logout (sid) {
        return axios.post("auth/logout", { sid })
    },

    fetchUserInfo(sid) {
        return axios.get("auth/info?", {params: {sid}})
    }
}