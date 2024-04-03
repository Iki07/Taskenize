<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/index';
import { useProStore } from '@/stores/projects';
import { useTaskStore } from '@/stores/tasks';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/Header.vue';
const sid = localStorage.getItem('sid')
const user = JSON.parse(localStorage.getItem('userData'))
const usrName = user.userName
const userID = user.userId
const fromPros = useProStore()
const store = useTaskStore()
const auth = useAuthStore()
const route = useRouter()
const pro = ref([])
const mem = ref('')
const wsps = ref([]); // vrati ref ako treba
const wspNames = ref('')
const assignedPM_Id = ref('')    //reactive([])
const fileApi = ref('')
const wspDetails = ref([])
const pmDetails = ref([])
const memDetails = ref([])

async function viewPro(id) {
  try {
    const msg = await api.goToProject(fromPros.sid, id)
    console.log(msg.data)
    let wss = msg.data.selectedProjectWsps
    let arr = []
    for(let w of wss) {
      arr.push(w.wsp_id)
    }
    wsps.value = arr.join(",")
    pro.value = msg.data.selectedProject[0]
    wspDetails.value = msg.data.wspsDetails
    pmDetails.value = msg.data.pmDetails
    memDetails.value = msg.data.projectTeamDetails
    const attach = await api.getAttach(sid, pro.value.prj_id)
    fileApi.value = attach.data.attachmentsWithUrl
    assignedPM_Id.value = msg.data.selectedProject[0].pm_id
    if(msg.data.selectedProject[0].project_members) {
      mem.value = msg.data.selectedProject[0].project_members.split(',')
    }
    console.log("members: ", mem.value)
    if(msg.data.selectedProject[0].workspaces) {
      wspNames.value = msg.data.selectedProject[0].workspaces.split(',')
    }
    fromPros.getPmToAssign(wsps.value)
  } catch (error) {
    console.log(error)
    alert(error.response.data.message)
  }
}
// let proID = localStorage.getItem('pro_id')
onMounted(() => {
    viewPro(fromPros.goProID)
})
function backToList() {
  store.onProDiv()
  route.push({path: '/myAccount'})
}
const openEdit = ref(false)
//const closeEdit = ref(false)
const proTitle = ref('')
const proDesc = ref('')
const pro_plan_start = ref('')
const pro_plan_end = ref('')
const pro_act_start = ref('')
const pro_act_end = ref('')
const pro_avatar = ref('')
const status = ref('')

const assignPM = ref('')
const proTeam = ref([])

function getProTitle(e) {
  proTitle.value = e.target.value
}
function getProDesc(e) {
  proDesc.value = e.target.value
}
function getProPlanStart(e) {
  pro_plan_start.value = e.target.value
}
function getProActStart(e) {
  pro_act_start.value = e.target.value
}
function getProPlanEnd(e) {
  pro_plan_end.value = e.target.value
} 
function getProActEnd(e) {
  pro_act_end.value = e.target.value
}
function getStatus(e) {
  status.value = e.target.value 
}
// Provera članova pro tima:
const selectMember = ref(false)

const removePm = ref(false)
const pmIdForDelete = ref(null)

const removeMember = ref(false)
const memIdForDelete = ref(null)
const membersObj = ref([])

function handleMemRemove(id, usr_name, memberAvatar) {
  console.log("mem pre akcije: ", memDetails.value)
  const obj = {
    "usr_id": id,
    "usr_name": usr_name,
    "memberAvatar": memberAvatar
  }
  membersObj.value = obj
  //memIdForDelete.value = id
  removeMember.value = true
}
/**
 * function confirmMemRemove() {
  for(let m of mem.value) {
    if(m == memIdForDelete.value) {
      mem.value.splice(mem.value.indexOf(m), 1)
    }
  }
  removeMember.value = false
}
let usrs_ids = []
  function pushId(e) {
    let id = e.target.value
    if(e.target.checked) {
      usrs_ids.push(id)
    }
    else {
      usrs_ids.splice(usrs_ids.indexOf(id), 1)
    } 
  }
  function sendUsrIds() {
    let arr = []
    for(let u of usrs_ids) { // value
      arr.push(u) 
    }
    usrs_ids = []
    for(let m of mem.value) {
      for(let u of arr) {
        if(u == m) {
          arr.splice(arr.indexOf(u), 1)
        }
      }
    }
    for(let a of arr) {
      mem.value.push(a)
    }
    mem.value = mem.value.filter((val, ind, arr) => {
      return arr.indexOf(val) === ind
    })
    arr = []
    fromPros.proTmSel = false
  } 
 */
function confirmMemRemove() {
  for(let m of memDetails.value) {
    if(m.usr_id == membersObj.value.usr_id) {
      memDetails.value.splice(memDetails.value.indexOf(m), 1)
    }
  }
  removeMember.value = false
}
const usrs_ids = ref([])
  function pushId(e) {
    let id = e.target.id
    let name = e.target.value
    const obj = {
      "usr_id": id,
      "usr_name": name
    }
    if(e.target.checked) {
      usrs_ids.value.push(obj)
    }
    else {
      usrs_ids.value.splice(usrs_ids.value.indexOf(obj), 1)
    } 
  }
  function sendUsrIds() {
    let arr = []
    for(let u of usrs_ids.value) { // value
      arr.push(u) 
    }
    usrs_ids.value = []
    for(let m of memDetails.value) {
      for(let u of arr) {
        if(u.usr_id == m.usr_id) {
          arr.splice(arr.indexOf(u), 1)
        }
      }
    }
    for(let a of arr) {
      // const obj = {
      //   "usr_id": a
      // }
      memDetails.value.push(a)
    }
    console.log("mems nakon petlji: ", memDetails.value)
    // memDetails.value = memDetails.value.filter((val, ind, arr) => {
    //   return arr.indexOf(val) === ind
    // })
    // console.log("mems nakon filter: ", memDetails.value)
    arr = []
    fromPros.proTmSel = false
  } 

function pmRemoved() {

  removePm.value = false
}
const attachModal = ref(false)
const attachData = new FormData()
function getFile(e) {
  const file = e.target.files[0]
  attachData.set("attach", file)
  attachData.set("sid", sid)
  attachData.set("projectId", fromPros.goProID)
}
async function addFile() {
  try {
    const msg = await api.addNewFile(attachData)
    console.log(msg)
  } catch (error) {
    console.log(error)
    alert(error.response.data.message)
  } finally {
    attachData.delete("attach")
    attachData.delete("sid")
    attachData.delete("projectId")
    viewPro(fromPros.goProID)
    attachModal.value = false
  }
}

const fileIdForDelete = ref('')
const fileDel = ref(false)
function delFile(id) {
  fileDel.value = true
  fileIdForDelete.value = id
}
async function fileDeleted(id) {
  try {
    const msg = await api.deleteAttach(sid, id)
    console.log(msg)
    console.log(msg.data.msg)
  } catch (error) {
    console.log(error)
    console.log(msg.data.msg)
  } finally {
    viewPro(fromPros.goProID)
  } 
}
//const notAuthEdit = ref(false)
function checkAuth() {
  if(userID != pro.value.pm_id) {
    fromPros.notAuthEdit = true
    return
  }
  openEdit.value = true
}
async function editPro() {
  const formData = new FormData()
  formData.set("sid", fromPros.sid)
  if(proTitle.value) {
    formData.set("name", proTitle.value)
  } else {
    formData.set("name", pro.value.prj_name)
  }
  if(proDesc.value) {
    formData.set("description", proDesc.value)
  }
  if(pro_plan_start.value) {
    formData.set("startPlanned", pro_plan_start.value)
  }
  if(pro_plan_end.value) {
    formData.set("endPlanned", pro_plan_end.value)
  }
  if(pro_act_start.value) {
    formData.set("startActual", pro_act_start.value)
  }
  if(pro_act_end.value) {
    formData.set("endActual", pro_act_end.value)
  }
  if(status.value) {
    formData.set("status", status.value)
  }
  // 
  if(wsps.value) {
    formData.set("selectedWsps", wsps.value)
  }
  if(memDetails.value.length > 0) {
    let memArr = []
    for(let m of memDetails.value) {
      memArr.push(m.usr_id)
    }
    formData.set("projectMembers", memArr.join(","))
  } else {console.log("nije")}
  
  if(assignedPM_Id.value) {
    formData.set("assignedPM", assignedPM_Id.value)
  } /* else {
    formData.set("assignedPM", pro.value.pm_id)
  } */ 
  try {
    const msg = await api.editPro(fromPros.goProID, formData)
    console.log(msg)
  } catch (error) {
    console.log(error)
    alert(error.response.data.message)
  }
  finally {
    formData.delete("name")
    formData.delete("description")
    formData.delete("startPlanned")
    formData.delete("endPlanned")
    formData.delete("startActual")
    formData.delete("endActual")
    formData.delete("status")
    formData.delete("selectedWsps")
    formData.delete("projectMembers")
    formData.delete("assignedPM")
    fromPros.allPro()
    viewPro(fromPros.goProID)
    openEdit.value = false
  } 
}

</script>
<template>
  <Header />
  
  <div class="buttonsDiv1" v-if="openEdit">
      <button @click="editPro">Confirm</button>
      <button @click="openEdit = false">Cancel</button>
  </div>
  <div class="main">
    <div class="buttonsDiv" v-if="!openEdit">
        <div class="leftButtons" >
          <button @click="checkAuth">Edit Project</button>
          <button @click="fromPros.prepareDel(pro.prj_id, pro.pm_id)">Delete Project</button>
        </div>
        <div class="msg" v-if="fromPros.openDelete">
          <h4>Are you really want to delete this project?</h4>
          <button class="ok" @click="fromPros.deletePro(fromPros.proIdForDelete, sid)">YES</button>
          <button class="ok" @click="fromPros.cancelDel">NO</button>
        </div>
        <div class="msg" v-if="fromPros.notAuthEdit">
          <h4>You are not authorized to perform this action!</h4>
          <button class="ok" @click="fromPros.notAuthEdit = false">OK</button>
        </div>
        <div class="rightButtons">
          <button>Add Task</button>
          <button @click="backToList">Go Back</button>
        </div>
    </div>
    <div class="fields">
      <div class="left_fields">
  
        <div class="field">
          <h3>Project title: </h3>
          <input type="text" :value="pro.prj_name"
          v-if="openEdit" @input="getProTitle">
          <p class="textarea">{{ pro.prj_name }}</p>
        </div>
        
        <div class="field">
          <h3>Project description:</h3>
          <textarea :value="pro.prj_description"
          v-if="openEdit" @input="getProDesc"></textarea>
          <p class="textarea">{{ pro.prj_description }}</p>
        </div>
        <div class="field fieldup f-title">
          <h3>Planned</h3>
          <h3>Actual</h3>
        </div>
        <div class="field fieldup" id="deadline">
          <h3>Start date:</h3>
          <input type="date" :value="pro.prj_start_planned"
          v-if="openEdit" @input="getProPlanStart">
          <p>{{ pro.prj_start_planned }}</p>
        
          <h3>Start date:</h3>
          <input type="date" :value="pro.prj_start_actual"
          v-if="openEdit" @input="getProActStart">
          <p>{{ pro.prj_start_actual }}</p>
        </div>
        <div class="field fieldup">
          <h3>End date:</h3>
          <input type="date" :value="pro.prj_end_planned"
          v-if="openEdit" @input="getProPlanEnd">
          <p >{{ pro.prj_end_planned }}</p>
        
          <h3>End date:</h3>
          <input type="date" :value="pro.prj_end_actual"
          v-if="openEdit" @input="getProActEnd">
          <p>{{ pro.prj_end_actual }}</p>
        </div>
        <!-- <a target="_blank ></a> :href="fileApi + "-->
        <h3>List of attached documents: </h3>
        <div class="field attach" v-for="a in fileApi">
          
          <p><a target="_blank" :href="`http://307w123.e2.mars-hosting.com/api/attach/${a.id + '?sid=' + sid} `">{{ a.title }}</a>
          
          <button @click="delFile(a.id)">Remove attachment</button></p>
          
        </div>
        <button @click="attachModal = true">Add new attachment</button>
        <!--Add file-->
        <div v-if="attachModal" class="removeMember">
          <p>Chose file:</p>
          <input type="file" @input="getFile">
          <button @click="addFile">Add file</button>
          <button @click="attachModal = false">Cancel</button>
        </div>
        <!--Delete file Modal-->
        <!--Za delete File-->
        <div class="deleteTaskDiv" v-if="fileDel">
          <h2>Are you sure you want to delete this file?</h2>
          <div class="delButtons">
          <button @click="fileDel = false">Cancel</button>
          <button @click="fileDeleted(fileIdForDelete)">Delete</button>
        </div>
      </div>
      </div>
      <div class="right_fields">
        <div class="field p-avatar">
          <img class="c_img" :src="`data:image/*;base64,${pro.img_image}`" v-if="pro.img_image"/>
          <p v-if="!pro.img_image">{{ pro.PM }}</p>
        </div>
        <div class="field lab">
          <h3>Current status: </h3>
          <select type="date" :value="pro.prj_end_actual"
          v-if="openEdit" @input="getStatus">
            <option value="1" selected>Created</option>
            <option value="2">In progress</option>
            <option value="3">Completed</option>
          </select>
          <p v-if="!openEdit && pro.prj_status == 1">
          Created</p>
          <p v-if="!openEdit && pro.prj_status == 2">
          In progress</p>
          <p v-if="!openEdit && pro.prj_status == 3">
          Completed</p>
        </div>
        <div class="field lab" v-if="!openEdit">
          <h3>Workspaces: </h3>
          <!--videti da li treba-->
          <div class="wsp" v-for="ws in wspDetails">
            <p >{{ ws.wsp_name }}</p>
            <div class="p-avatar">
              <img class="c_img" :src="`data:image/*;base64,${ws.wspAvatar}`" v-if="ws.wspAvatar"/>
            </div>
          </div>
        </div>
        <div class="field lab" v-for="pm in pmDetails">
          <h3>Assigned PM: </h3>
            <p v-if="!openEdit && pro.PM">{{ pm.usr_name }}</p>
            <button v-if="!pro.PM">Assign To</button>
          <div class="container">
            <!--<div class="close">X</div>-->
            <div class="p-avatar">
              <img class="c_img" :src="`data:image/*;base64,${pm.pmAvatar}`" v-if="pm.pmAvatar"/>
              <p v-if="!pm.pmAvatar">{{ pm.usr_name }}</p>
            </div>
          </div>
          <div v-if="openEdit">
            <p>Reassign to:</p>
            <select v-model="assignedPM_Id">
              <option v-for="pm in fromPros.PMforAssign" :value="pm.usr_id">
                {{ pm.usr_name }}
              </option>
            </select>
          </div>
          <div class="removeMember" v-if="removePm">
            <h3>Are you really want to remove this PM?</h3>
            <div class="buttonsDiv">
              <button @click="removePm = false">Cancel</button>
              <button @click="pmRemoved">Remove</button>
            </div>
          </div>
        </div>
        <div class="msg" v-if="removeMember">
            <h3>Are you really want to remove this member?</h3>
            <div class="removeBtns">
              <button class="ok" @click="removeMember = false">Cancel</button>
              <button class="ok" @click="confirmMemRemove">Remove</button>
            </div>
        </div>
        <h3>Project Team members: </h3>
        <div class="p-tm">
          <!--v-for="p in mem"-->
          <div v-for="m in memDetails" >
            <p v-if="!pro.project_members">N/A</p>
            <div class="a-container">
              <div class="close" @click="handleMemRemove(m.usr_id, m.usr_name, m.memberAvatar)"
              v-if="openEdit">X</div>
              <div class="p-avatar" >
                <img :src="`http://307w123.e2.mars-hosting.com/api/avatar/${m.memberAvatar}`" v-if="m.memberAvatar">
                <p v-if="!m.memberAvatar">{{m.usr_name}}</p>
              </div>
            </div>  
          </div>
        </div>
        <button @click="selectMember = true" v-if="!openEdit">Add new member</button>
        <button @click="fromPros.proTmSel = true" v-if="openEdit">Add new member</button>
        
        <div class="multi" v-if="fromPros.proTmSel">
            <div v-for="user in fromPros.userToAssign"
            :key="user.usr_id" >
              <div class="check">
                <input type="checkbox" :id="user.usr_id" :value="user.usr_name"
                @click="pushId">
                <p > {{ user.usr_name }}</p>
              </div>
            </div>
            <button @click="sendUsrIds">Done</button>
          </div>
          <div class="msg" v-if="selectMember">
            <h3>Please press 'Edit project' to use this feature</h3>
            <button class="ok" @click="selectMember = false">OK</button>
          </div>
        <div class="field"></div> 
      </div>
    </div>
    <div class="buttonsDiv" v-if="!openEdit">
        <div class="leftButtons" >
          <button @click="checkAuth">Edit Project</button>
          <button @click="fromPros.prepareDel(pro.prj_id, pro.pm_id)">Delete Project</button>
        </div>
        <div class="msg" v-if="fromPros.openDelete">
          <h4>Are you really want to delete this project?</h4>
          <button class="ok" @click="fromPros.deletePro(fromPros.proIdForDelete, sid)">YES</button>
          <button class="ok" @click="fromPros.cancelDel">NO</button>
        </div>
        <div class="msg" v-if="fromPros.notAuthEdit">
          <h4>You are not authorized to perform this action!</h4>
          <button class="ok" @click="fromPros.notAuthEdit = false">OK</button>
        </div>
        <div class="rightButtons">
          <button>Add Task</button>
          <button @click="backToList">Go Back</button>
        </div>
    </div>
  </div>
</template>
<style scoped>
main {
  width: 100vw;
  display: flex;
}
h1 {
  text-align: center;
}
.main {
  display: grid;
  grid-template-columns: 1fr;
}
.fieldup {
  justify-content: space-evenly;
    width: 70%;
}
.f-title {
  justify-content: space-around;
}
  .textarea {
    border-radius: 0.6rem;
    text-align: center;
    font-size: 1rem;
    min-height: 3.3rem;
  } 
  .fields {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
  }
  .left_fields, .right_fields {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    gap: 1rem;
    padding: 0.9rem;
    height: 100%;
  }
  
  .field {
    display: flex;
    justify-content: space-between;
    max-width: 93%;
    gap: 1rem;
    min-width: 9rem;
    min-height: 0.6rem;
  }
  .attach {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .lab {
    flex-direction: column;
  }
  .buttonsDiv1 {
    display: flex;
    justify-content: center;
    padding: 0.3rem;
    min-width: 80vw;
    height: 3rem;
    gap: 6rem;
  }
  .buttonsDiv {
    display: flex;
    justify-content: space-between;
    padding: 0.3rem;
    min-width: 80vw;
    min-height: 9rem;
    gap: 6rem;
  }
  .close {
    text-align: end;
    max-width: 2.1rem;
    cursor: pointer;
  }
  
  .leftButtons, .rightButtons {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;
  }
  .leftButtons {
    align-items: flex-start;
    padding: 1rem;
  }
  .rightButtons {
    align-items: center;
    padding: 1rem;
  }
  button {
    min-width: 7rem;
    background-color: #02ad8b;
    border: solid 0.0625rem #02ad8b;
    color: white;
  }
  .p-avatar {
    border: solid 0.0625rem #02ad8b;
    width: 3rem;
    height: 3rem;
    border-radius: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .p-avatar p {
    text-align: center;
  }
  .pm-avatar {
    border: solid 0.0625rem #02ad8b;
    width: 1rem;
    height: 1rem;
    border-radius: 1rem;
  }
  .p-tm {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  .removeMember {
    /**
    position: absolute;
    top: 92vh;
    left: 24vw;
    */
    width: 40vw;
    height: 20vh;
    background-color: black;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
  .removeBtns {
    display: flex;
    justify-content: space-between;
    width: 30vw;
  }
  .wsp {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .multi {
    width: 12rem;
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    justify-content: center;
    background-color: white;
    color: black;
    z-index: 30;
    padding: 1rem;
  }
  .multi p {
    cursor: pointer;
  }
  div.multi input {
    width: 1rem;
    font-size: 0.7rem;
  } 
  div.multi .check {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    gap: 0.3rem;
  } 
  .deleteTaskDiv {
    display: grid;
    grid-template-columns: 1fr;
    width: 30vw;
    height: 25vh;
    /*
    position: fixed;
    top: 25vh;
    left: 40vw; */
    background-color: black;
    color: white;
    border-radius: 0.6rem;
  }
  .delButtons {
    display: flex;
    justify-content: space-between;
  }
  .c_img {
    width: 100%;
  }
  .msg {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #02ad8b;
    color: white;
    min-height: 6rem;
    padding: 0.5rem;
  }
  .ok {
    width: 6rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    color: black;
    cursor: pointer;
  }
</style>