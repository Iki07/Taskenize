import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index';
import { useRouter } from 'vue-router';
import { useTaskStore } from './tasks'; 
//import { useWsStore } from './workspace';
import { useAuthStore } from '@/stores/authStore';


export const useProStore = defineStore("projects", () => {
  const fromTask = useTaskStore()
  //const wsps = useWsStore()
  //const worID = fromTask.worID
  const route = useRouter()
  const user = JSON.parse(localStorage.getItem('userData'))
  const sid = localStorage.getItem('sid')  // = usr_data.worID
  const usr_data = user.userAuthData //podaci user-a
  const usr_lett = user.userName.split('')[0]
  const usrID = user.userId

  let tmID = 0
  const worID = ref(fromTask.worID)
  const goProID = ref('')

  const myWsps = ref([])

  const createPro = ref(false)
  const proName = ref('')
  const proDesc = ref(null)
  const proPlanBegin = ref(null)
  const proRealBegin = ref(null)
  const proPlanFin = ref(null)
  const proRealFin = ref(null)
  const proPM = ref(null)
  const proWsPs = ref([])
  const proTeam = ref([])
  const proStatus = ref(null)

  function proModalOpen() {
    createPro.value = true//!createPro.value
    fromTask.createTask = false
    fromTask.createClick = false 
    fromTask.createView = false
    getWspsMultiSelect() // SVI WSPS Za Select
    //getPmToAssign() // Svi users koje određujemo za PM
  }
  // if(createPro) {
  //   wsps.allWsps()
  // }
  //IZBOR WSPS I PM IZ PRO
  const PMforAssign = ref([])
  const userToAssign = ref([])
  async function getWspsMultiSelect() {
    try {
      const msg = await api.getProWspsForSelect(sid, usrID)
      console.log(msg)
      myWsps.value = msg.data.availableWsps
    } catch (error) {
      console.log(error)
      alert(error.response.data.message)
    }
  }

  async function getPmToAssign(wsId) {
    const dto = {
      "sid": sid,
      "userId": usrID,
      "selectedWsps": wsId
    } 
    try {
      const msg = await api.getPMforAssign(dto)
      console.log(msg)
      PMforAssign.value = msg.data.assignPM
      userToAssign.value = msg.data.assignTo
      console.log(PMforAssign.value)
      console.log(userToAssign.value)
    } catch (error) {
      console.log(error)
      alert(error.response.data.message)
    }
  }

  // IZBOR PRO-WSP I PROPM-A
  const prowspSel = ref(false)
  const wsps_add = ref([])
  function pushWs(e) {
    let id = e.target.id
    let name = e.target.value
    const wsObj = {
      "id": id,
      "name": name
    }
    if(e.target.checked) {
      wsps_add.value.push(wsObj)
    }
    else {
      wsps_add.value.splice(wsps_add.value.indexOf(wsObj), 1)
    } 
    console.log("wsObj: ", wsps_add.value)
  }
  function removeWsp(id) {
    for(let w of wsps_add.value) {
      if(w.id == id) {
        wsps_add.value.splice(wsps_add.value.indexOf(w), 1)
      }
    }
    console.log(wsps_add.value)
    sendWspIds()
  } 
  async function sendWspIds() {
    let arr = []
    for(let w of wsps_add.value) {
      arr.push(w.id) //Number(w)
    }
    arr = arr.filter((val, ind, array) => {
      return array.indexOf(val) === ind
    })
    console.log("niz wsId: ", arr)
    proWsPs.value = arr.join(",")
    getPmToAssign(proWsPs.value)
    prowspSel.value = false
  }

  const proTmSel = ref(false)
  const usrs_ids = ref([]) //let usrs_ids = [] 
  function pushId(e) {
    let id = e.target.id
    let name = e.target.value
    const usrObj = {
      "id": id,
      "name": name
    }
    if(e.target.checked) {
      usrs_ids.value.push(usrObj)
    }
    else {
      usrs_ids.value.splice(usrs_ids.value.indexOf(usrObj), 1)
    } 
  }

  function removeUsr(id) {
    for(let u of usrs_ids.value) {
      if(u.id == id) {
        usrs_ids.value.splice(usrs_ids.value.indexOf(u), 1)
      }
    }
    console.log(usrs_ids.value)
  } 

  function sendUsrIds() {
    let arr = []
    for(let u of usrs_ids.value) { // value
      arr.push(u.id) 
    }
    arr = arr.filter((val, ind, array) => {
      return array.indexOf(val) === ind
    })
    proTeam.value = arr.join(",")
    console.log(proTeam.value)
    proTmSel.value = false
  } 

  function createProDone() {
    createPro.value = false
    proName.value = null
    proDesc.value = null
    proPlanBegin.value = null
    proPlanFin.value = null
    proRealBegin.value = null
    proRealFin.value = null
    proPM.value = null
    proWsPs.value = ''
    proTeam.value = ''
    wsps_add.value = []
    usrs_ids.value = []
    proStatus.value = null
    fromTask.titleError = false
    nw_pro_name.value = ''
    success.value = ''
  }
  const formData = new FormData()
  function getAvatar(e) {
    const file = e.target.files[0]
    console.log(file)
    formData.set("avatar", file);
  }
  function getFile(e) {
    const file = e.target.files[0]
    console.log(file)
    formData.set("attach", file);
  }

  const selectWsError = ref(false)
  const nw_pro_name = ref('')
  const success = ref('')
  async function addPro() {
    console.log(proWsPs.value)
    if(!proName.value) {
      fromTask.titleError = true
      return
    }
    formData.set("sid", sid)
    if(proName.value) {
      formData.set('title', proName.value)
    }
    if(proDesc.value) {
      formData.set('description', proDesc.value)
    }
    if(proPlanBegin.value) {
      formData.set('startPlanned', proPlanBegin.value)
    }
    if(proPlanFin.value) {
      formData.set('endPlanned', proPlanFin.value)
    }
    if(proRealBegin.value && proRealBegin.value != null) {
      formData.set('startActual', proRealBegin.value)
    }
    if(proRealFin.value && proRealFin.value != null) {
      formData.set('endActual', proRealFin.value)
    }
    if(proStatus.value) {
      formData.set('status', proStatus.value)
    }
    if(proPM.value) {
      formData.set('assignedPM', proPM.value)
    }
    if(proTeam.value.length > 0) { // tmArr.length > 0
      console.log(proTeam.value + " tip ", typeof(proTeam.value))
      formData.set('projectMembers', proTeam.value)
    } 
    if(proWsPs.value.length < 1) {
      selectWsError.value = true
      return
    }
    if(proWsPs.value.length > 0) { 
      formData.set('selectedWsps', proWsPs.value)
    }   
    try {
      const msg = await api.createProject(formData)
      console.log(msg)
      nw_pro_name.value = msg.data.title  
      success.value = `The new project "${nw_pro_name.value}" successfully created`
    } catch (error) {
      console.log(error)
    } finally {
      formData.delete("sid")
      formData.delete('proName')
      formData.delete('proDesc')
      formData.delete('proPstart')
      formData.delete('proRstart')
      formData.delete('proPend')
      formData.delete('proRend')
      formData.delete('status')
      formData.delete('assignedPM')
      formData.delete('projectMembers')
      formData.delete('selectedWsps')
      formData.delete('avatar')
      formData.delete('attach')
      proTeam.value = ''
      proWsPs.value = ''
      if(nw_pro_name.value) {
        setTimeout(createProDone, 3000)
        allPro()
        fromTask.onProDiv()
        createProDone()
      } else {
        allPro()
        fromTask.onProDiv()
        createProDone()
      } 
    }
  }
      
  const proWhereAssigned = ref([])
  const proWherePM = ref([])
  const proRest = ref([])
  async function allPro() {
    console.log("sid : " + sid + "\n" + "userId : " + usrID)
    try {
      const res = await api.getMyProjects(sid, usrID)
      console.log(res)
      proWhereAssigned.value = res.data.projectsWhereAssigned
      proWherePM.value = res.data.projectsWherePM
      proRest.value = res.data.restOfTheProjects
    } catch (error) {
      console.log(error)
      alert(error.response.data.message)
    }
  }
  const openDelete = ref(false)
  const proIdForDelete = ref(null)

  const notAuthEdit = ref(false)
  function prepareDel(id, pmID) {
    if(usrID != pmID) {
      notAuthEdit.value = true
      return
    }
    openDelete.value = true
    proIdForDelete.value = id
  }
  function cancelDel() {
    openDelete.value = false
    proIdForDelete.value = null
  }
  async function deletePro(id, sid) {
    console.log("proID ", id)
    try {
      const msg = await api.deleteMyProject(id, sid)
      console.log(msg.data)
      fromTask.onProDiv()
    } catch (error) {
      console.log(error)
      alert(error.response.data.message)
    }
  }
      
  function goToPro(id) {
    goProID.value = id
    route.push({name: "project"})
  }

  return {  
    proName, proDesc, proPlanBegin, proPlanFin, proRealBegin,
    proRealFin, proPM, createPro, goProID, proWhereAssigned,
    proWherePM, proRest, sid, proWsPs, proStatus,
    worID, usrID, proTeam, myWsps, proStatus, PMforAssign, userToAssign,
    prowspSel, wsps_add, nw_pro_name, success,
    proTmSel, usrs_ids, selectWsError, openDelete, proIdForDelete,
    notAuthEdit,
    // currentWsps, myWor, idFromInter,
    createProDone, addPro, allPro, deletePro, goToPro, 
    getWspsMultiSelect, proModalOpen, getPmToAssign, getFile,
    getAvatar, pushWs, sendWspIds, pushId, sendUsrIds, removeWsp,
    removeUsr, prepareDel, cancelDel,

  }
})