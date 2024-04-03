<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/index';
import { useWsStore } from '@/stores/workspace';
import { useProStore } from '@/stores/projects';
import { useTaskStore } from '@/stores/tasks';
import { useAuthStore } from '@/stores/authStore.js';
import Header from '@/components/Header.vue';
const user = JSON.parse(localStorage.getItem('userData'))
const usr_data = user.userAuthData //podaci user-a
const usrName = user.userName
const userID = user.userId
const sid = localStorage.getItem('sid')
const route = useRouter()
const fromPros = useProStore()
const store = useTaskStore()
const wsps = useWsStore()
const auth = useAuthStore()
const oneWsp = ref([])
const wspProjects = ref([])
const wspTeams = ref([])
//const wspAvatar = ref('')

async function goToWsp(id) {
    try {
      const msg = await api.selectOneWs(id, sid)
      console.log(msg)
      oneWsp.value = msg.data.wspDetails[0]  
      console.log("id: ", oneWsp.value.wsp_img_id)
      //const avatar = await api.getAvatar(sid, oneWsp.value.wsp_img_id)
      //console.log("avatar: ", avatar)
      //wspAvatar.value = avatar
      console.log(oneWsp.value)
      wspProjects.value = msg.data.wspProjects
      wspTeams.value = msg.data.wspTeams
    } catch (error) {
        console.log(error)
    }
}
onMounted(() => {
    goToWsp(wsps.goWsID)
})
function goBack() {
    route.push({name: "myAccount"})
}

// Provera za update (ako je admin)
const canEdit = ref(false)
const notAdmin = ref('')

function adminEdit() {
  console.log("adminId: ", oneWsp.value.adminId + "usr: ", userID)
  if(userID === oneWsp.value.adminId) {
    canEdit.value = true
    getToReassign(wsps.goWsID)
    // func za dohvatanje usera- potencijalnih admina
  } else {
    canEdit.value = false
    notAdmin.value = "You are not authorized to edit this Workspace!"
  }
}
// UPDATE:
const title = ref('')
const description = ref('')
const reassign = ref('')

function getTitle(e) {
  title.value = e.target.value 
}
function getDesc(e) {
  description.value = e.target.value
}

const formData = new FormData()
function getFile(e) {
  let file = e.target.files[0]
  formData.set("avatar", file)
  console.log(file)
}
const wsUsers = ref([])
async function getToReassign(id) {
  console.log("reass: ", id)
  try {
    const msg = await api.getWspUsers(sid, id)
    console.log("users: ", msg)
    wsUsers.value = msg.data.assignTo
  } catch (error) {
    console.log(error)
  }
}
const titleError = ref('')
const assignError = ref('')
const updateMsg = ref('')
const admClr = ref(false)
function clearErr() {
  titleError.value = ''
  assignError.value = ''
}
async function updateWs() {
  if(!title.value && !oneWsp.value.wsp_name) {
    titleError.value = 'WS Name is mandatory!'
    return
  }
  if(!wsps.selectedIds && admClr.value) {
    console.log("iz update: ", wsps.selectedIds + "\n", admClr.value)
    assignError.value = 'At least one Admin must be assigned!'
    return
  }
  formData.set('sid', sid)
  if(title.value) {
    formData.set('name', title.value)
  } else {
    formData.set('name', oneWsp.value.wsp_name)
  }
  if(description.value) {
    formData.set('description', description.value)
  }
  if(wsps.selectedIds) {
    formData.set('selectedAdmins', wsps.selectedIds)
  } else {
    formData.set('selectedAdmins', oneWsp.value.adminId)
  }
  wsps.selectedIds = ''
  try {
    const msg = await api.wspsUpdate(wsps.goWsID, formData)
    console.log("updateWS: ", msg)
    updateMsg.value = msg.data.msg
  } catch (error) {
    console.log(error)
  } finally {
    formData.delete('name')
    formData.delete('description')
    formData.delete('selectedAdmins')
    canEdit.value = false 
    goToWsp(wsps.goWsID)
  }
}

const canDelete = ref(false)
const notAdminDel = ref('')

function adminDel() {
  if(userID === oneWsp.value.adminId) {
    canDelete.value = true
  } else {
    canDelete.value = false
    notAdminDel.value = "You are not authorized to delete this Workspace!"
    console.log(notAdminDel.value)
  }
}
function deleteDone() {
  message.value = ''
  route.push({
    name: 'myAccount'
  })
  store.onWsDiv()
}
const message = ref('')
async function wsDeleted() {
  try {
    const msg = await api.deleteWsPs(oneWsp.value.wsp_id, sid)
    console.log(msg)
    message.value = msg.data.msg
    auth.updateLS(sid)
  } catch(error) {
    console.log(error)
  } finally {
    canDelete.value = false
    setTimeout(deleteDone, 3000)
  }  
}

</script>
<template>
  <Header />
    <div class="fields">
        <div class="left_fields">
            <div class="title" v-if="!canEdit">
                <h2>{{ oneWsp.wsp_name }}</h2>
            </div>
            <div class="title" v-if="canEdit">
              <p>Edit workspace name: </p>
              <input type="text" :value="oneWsp.wsp_name" @input="getTitle">
            </div>
            <div class="desc" v-if="!canEdit">
                <p>{{ oneWsp.wsp_description }}</p>
            </div>
            <div class="desc" v-if="canEdit">
              <p>Edit workspace description: </p>
              <textarea :value="oneWsp.wsp_description" @input="getDesc"></textarea>
            </div>
        </div>
        <div class="right_fields">
          <button v-if="canEdit" @click="updateWs">Confirm</button>
          <div class="msg" v-if="titleError || assignError">
            <h4 v-if="titleError">{{titleError}}</h4>
            <h4 v-if="assignError">{{assignError}}</h4>
            <button class="ok" @click="clearErr">OK</button>
          </div>
          <button v-if="canEdit" @click="canEdit = false, admClr = false">Cancel</button>
            <div class="ws-avatar" v-if="!canEdit">
              <!--<img class="c_img" width="250" :src="`data:image/*;base64,${wspAvatar}`" v-if="oneWsp.wspAvatar"/>-->
              <img alt="Avatar"  :src="`http://307w123.e2.mars-hosting.com/api/avatar/${oneWsp.wsp_img_id}`" v-if="oneWsp.wsp_img_id" />
              <p v-if="!oneWsp.wsp_img_id">Avatar</p>
            </div>
            <div class="ws-avatar" v-if="canEdit">
              <h4>Add new Avatar image</h4>
              <input type="file" @input="getFile">
            </div>
            <div class="admin" v-if="!admClr">
                <h3 >{{ oneWsp.admin }} <span @click="admClr = true" v-if="canEdit">X</span></h3>
            </div>
            <div class="admin" v-if="admClr && canEdit"><!--Multiselect-->
              <div class="field lab" >
              <label>Select New Admin</label>
              <button class="multiBtn" @click="wsps.adminSel = true">Select Admins</button>
              
              <div class="multi" v-if="wsps.adminSel">
                <p v-if="wsps.errorMsg">{{ wsps.errorMsg }}</p>
                <div v-for="u in wsUsers"
                :key="u.usr_id" >
                  <div class="check">
                    <input type="checkbox" :value="u.usr_id"
                    @click="wsps.pushId">
                    <p > {{ u.usr_name }}</p>
                  </div>
                </div>
                <button class="multiBtn" @click="wsps.sendUsrIds">Done</button>
                
              </div>
              
            </div>
            <span v-if="admClr" @click="admClr = false">X</span>
            </div>
            <button @click="adminEdit">Update WS</button>
            <button @click="adminDel">Delete WS</button>
            <button @click="goBack">Go back</button>
            <div class="msg" v-if="notAdmin">
              <h3 >{{ notAdmin }}</h3>
              <div class="ok" @click="notAdmin = ''">OK</div>
            </div>
            <div class="msg" v-if="notAdminDel">
              <h3 >{{ notAdminDel }}</h3>
              <div class="ok" @click="notAdminDel = ''">OK</div>
            </div>
            <div class="msg" v-if="canDelete">
              <h3 >Are you sure you want to delete this Workspace</h3>
              <div class="ok" @click="wsDeleted">Yes</div>
              <div class="ok" @click="canDelete = false">No</div>
            </div>
            <div class="msg" v-if="message">
              <h3 >{{ message }}</h3>
              <div class="ok" @click="message = ''">OK</div>
            </div>
        </div>
    </div>
    <div class="pro-teams" v-if="!canEdit">
        <div class="projects">
            <div class="title">
                <h2>Projects</h2>
            </div>
            <div class="text">
                <ul v-for="pro in wspProjects" :key="pro.prj_id">
                  <li>{{ pro.prj_name }}</li>
                </ul>

                <button>Add project</button>
            </div>
        </div>
        <div class="teams">
            <div class="title">
                <h2>Teams</h2>
            </div>
            <div class="text">
                <ul v-for="tm in wspTeams" :key="tm.tem_id">
                  <li>{{ tm.tem_name }}</li>
                </ul>
                <button>Add Team</button>
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
  .desc {
    border-radius: 0.6rem;
    text-align: center;
    font-size: 1rem;
    min-height: 18rem;
    width: 95%;
    display: flex;
    justify-content: center;
    align-items: center;
  } 
  .fields {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
    min-height: 50vh;
  }
  .left_fields, .right_fields {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;
    padding: 0.9rem;
    height: 100%;
  }
  .left_fields div {
    border: 0.1325rem solid #02ad8b;
  }
  .right_fields div {
    border: 0.1325rem solid #02ad8b;
  }
  .field {
    display: flex;
    justify-content: space-between;
    max-width: 93%;
    gap: 1rem;
    min-width: 9rem;
    min-height: 0.6rem;
  }

  .close {
    text-align: end;
    max-width: 2.1rem;
    cursor: pointer;
  }
  button {
    min-width: 7rem;
    background-color: #02ad8b;
    border: solid 0.0625rem #02ad8b;
    color: white;
  }
  .ws-avatar {
    border: solid 0.0625rem #02ad8b;
    width: 100%;
    height: 4rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .ws-avatar img {
    width: 100%;
    height: auto;
  }
  .admin {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pro-teams {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .projects, .teams {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .title, .text {
    border: 0.0625rem solid #02ad8b;
    width: 95%;
    padding: 1rem;
    display: flex;
  }
  .title {
    height: 10vh;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
  .text {
    height: 40vh;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: flex-start;
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
  textarea {
    height: 18rem;
    width: 27rem;
  }
  span {
    cursor: pointer;
    font-weight: bold;
    margin-left: 0.3rem;
  }
  select {
    width: 12rem;
    font-size: 0.9rem;
  }
  .multi {
    position: absolute;
    top: 40vh;
    right: 6vw;
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
    gap: 0.3rem;
  } 
  .multiBtn {
    background-color: lightgray;
    border: none;
  }
</style>