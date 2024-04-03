<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/index';
import { useProStore } from '@/stores/projects';
import { useTaskStore } from '@/stores/tasks';
import Header from '@/components/Header.vue';
//const sid = localStorage.getItem('sid')
const fromPros = useProStore()
const store = useTaskStore()
const oneTask = ref('')
const oneTaskFile = ref([])
const sid = localStorage.getItem('sid')
const route = useRouter()
async function goToTask(id) {
  try {
    console.log("sid : " + store.sid) // localStorage.getItem('sid')
    
    const msg = await api.goToTask(id, store.sid)
    console.log(msg)
    store.oneTask.value = msg.data.taskSelected[0]
    oneTask.value = msg.data.taskSelected[0]
    console.log(oneTask.value)
    oneTaskFile.value = msg.data.attachments
    console.log(msg.data.comments)
    store.oneTaskComment.value = msg.data.comments
    if (store.usrID == oneTask.value.AssignedUserID) {
      console.log("gađa samo dodeljenog usr")
      canDoPartialEdit.value = true;
      canEditTask.value = false
    }
    //ako je private task
    if ((!oneTask.value.ProjectID) && (!oneTask.value.TeamID)) {
      canEditTask.value = true;
      canDoPartialEdit.value = true;
    } else if (oneTask.value.ProjectID) {
  //moze da edituje task ako je PM na projektu
    for(let p of proids.value) {
      if(p === oneTask.value.ProjectID) {
        canEditTask.value = true;
        canDoPartialEdit.value = true;
      }
    }
    
  //}
  } else if (oneTask.value.TeamID) {
  //moze da edituje task ako je TM u timu
    for(let t of tmids) {
      if(t === oneTask.value.TeamID) {
        canEditTask.value = true;
        canDoPartialEdit.value = true;
      }
    }
  //}
} 
  } catch (error) {
    console.log(error)
  } finally {
  }
}
const canEditTask = ref(false);
const canDoPartialEdit = ref(false);
const teams = store.usr_teams
const pros = store.usr_pros
const tmids = ref([])
const proids = ref([])
for(let tm of teams) {
  tmids.value.push(tm.tem_id)
}
for (let pr of pros) {
  proids.value.push(pr.prj_id)
}

onMounted(() => {
  //console.log("id :" + store.goTskID)
  console.log(oneTask.value)
   goToTask(store.goTskID)
})
const categor = JSON.parse(localStorage.getItem('taskCategories')) //ref([])
const privCat = []
const temCat = []
const proCat = []
  for(let c of categor) {
    if(c.tsk_type === 1) {
      privCat.push(c)
    } else if(c.tsk_type === 2) {
      proCat.push(c)
    } else if(c.tsk_type === 3) {
      temCat.push(c)
    }
  } 
// ovde je href za attach
const fileApi = 'http://307w123.e2.mars-hosting.com/api/attach/'

const tidEdit = ref('')
const rowEdit = ref(false)
//const newContent = ref('')

const users = ref([])
    async function usersToAssign() {
      const dto = {
        "sid": store.sid,
        "userId": oneTask.value.AssignedUserID,
        "projectId": oneTask.value.ProjectID,
        "teamId": oneTask.value.TeamID
      }
      console.log(dto)
      try {
        const msg = await api.getUsersToAssign(dto)
        console.log(msg)
        console.log(msg.data.assignTo)
        users.value = msg.data.assignTo
      } catch (error) {
        console.log(error)
      }
    }


//onMounted(() => {
  
//})


function editTask(id) {
  console.log("proID : " + oneTask.value.ProjectID)
  console.log("proManag : " + pros.value)
  tidEdit.value = id
  rowEdit.value = true
  usersToAssign()
} 
const newTaskName = ref('')
const taskDescription = ref('')
const taskTypeName = ref('')
const categories = ref('')
const assignedUserName = ref('')
const status = ref('')
const dueDate = ref('')
const timePlanned = ref('')
const timeSpent = ref('')
const wspName = ref('')
const teamName = ref('')
const proName = ref('')

function titleEdit(e) {
  newTaskName.value = e.target.value
}
function descEdit(e) {
  taskDescription.value = e.target.value
}
function typeEdit(e) {
  taskTypeName.value = e.target.value
} /*
function catEdit(e) {
  categories.value = e.target.value
} */
function assignEdit(e) {
  assignedUserName.value = e.target.value
}
function staEdit(e) {
  status.value = e.target.value
}
function dueEdit(e) {
  dueDate.value = e.target.value
}
function ptimeEdit(e) {
  timePlanned.value = e.target.value
}
function stimeEdit(e) {
  timeSpent.value = e.target.value
}
function wspEdit(e) {
  wspName.value = e.target.value
}
function tmEdit(e) {
  teamName.value = e.target.value
}
function proEdit(e) {
  proName.value = e.target.value
}

async function tskEdit() {
  const formData = new FormData()
  if(!newTaskName.value) {
    newTaskName.value = oneTask.value.TaskTitle
  }
  if(!taskDescription.value) {
    taskDescription.value = oneTask.value.TaskDescription
  } 
  if(!taskTypeName.value) {
    taskTypeName.value = oneTask.value.TaskTypeName
  }
  // if(!categories.value) {
  //   categories.value = oneTask.value.CategoryID
  // }
  if(!assignedUserName.value) {
    assignedUserName.value = oneTask.value.AssignedUserID
  }
  if(!status.value) {
    status.value = oneTask.value.Status
  }
  if(!dueDate.value) {
    dueDate.value = oneTask.value.DueDate
  }
  if(!timePlanned.value) {
    timePlanned.value = oneTask.value.TimePlanned
  }
  if(!timeSpent.value) {
    timeSpent.value = oneTask.value.TimeSpent
  }
  formData.set("sid", store.sid)
  formData.set("taskId", oneTask.value.TaskID)
  formData.set("userId", store.usrID)
  if(oneTask.value.ProjectID) {
    formData.set("projectId", oneTask.value.ProjectID)
  }
  if(oneTask.value.TeamID) {
    formData.set("teamId", oneTask.value.TeamID)
  }
  if(oneTask.value.TaskTypeID) {
    formData.set("taskType", oneTask.value.TaskTypeID)
  }
  formData.set("sid", store.sid)
  formData.set("title", newTaskName.value)
  formData.set("description", taskDescription.value)
  formData.set("taskCategory", categories.value)
  if(oneTask.value.AssignedUserID) {
    formData.set("assignedTo", oneTask.value.AssignedUserID)
  }
  if(assignedUserName.value) {
    formData.set("reAsign", assignedUserName.value) // proveri ovde
  }
  if(status.value) {
    formData.set("status", status.value)
  }
  if(dueDate.value) {
    formData.set("dueDate", dueDate.value)
  }
  if(timePlanned.value) {
    formData.set("timePlanned", timePlanned.value)
  }
  if(timeSpent.value) {
    formData.set("timeSpent", timeSpent.value)
  }
  if(oneTask.value.WorkspaceID) {
    formData.set("selectedWsp", oneTask.value.WorkspaceID)
  }
  try {
    const msg = await api.updateTask(oneTask.value.TaskID, formData)
    console.log(msg)
  } catch (error) {
    console.log(error)
  } finally {
    rowEdit.value = false
    store.allMyTasks()
    goToTask(store.goTskID)
  }
}

const comOpen = ref(false)
const comID = ref(0)
const comCol = ref('')
const comContent = ref('') 

function editComText(e) {
  comContent.value = e.target.value
}

function editCom(e) {
  comOpen.value = true
  comID.value = e.target.id
  comCol.value = e.target.value
  console.log(comID.value + "\n" + comCol.value)
}
async function comEdited() {
  if(!comContent.value) {
    return
  }
  console.log(comID.value)
  const dto = {
    "sid": store.sid,
    "userId": store.usrID,
    "commentText": comContent.value
  }
  try {
    const msg = await api.updateComment(comID.value, dto)
    console.log(msg)
  } catch(error) {
    console.log(error)
  }
  finally {
    //comID.value = ''
    comCol.value = ''
    comContent.value = ''
    comOpen.value = false
    store.allMyTasks()
    goToTask(store.goTskID)
  } 
}
const comTxtOpen = ref(false)
const nwComTxt = ref('')

function addCom() {
  comTxtOpen.value = true 
}
function cancelAddCom() {
  nwComTxt.value = ''
  comTxtOpen.value = false
}
async function comAdded() {
  if(!nwComTxt.value) {
    return
  }
  const dto = {
    "sid": store.sid,
    "comment": nwComTxt.value,
    "userId": store.usrID,
    "taskId": oneTask.value.TaskID,
    "projectId": oneTask.value.ProjectID,
    "teamId": oneTask.value.TeamID,
    "assignedTo": oneTask.value.AssignedUserID
  }
  try {
    const msg = await api.addNewComment(dto)
    console.log(msg)
  } catch(error) {
    console.log(error)
  } finally {
    cancelAddCom()
    store.allMyTasks()
    goToTask(store.goTskID)
  }
}
async function delComm(e) {
  const id = e.target.id
  console.log(id)
  try {
    const msg = await api.deleteComment(id, store.sid, store.usrID)
    console.log(msg)
  } catch (error) {
    console.log(error)
  } finally {
    store.allMyTasks()
    goToTask(store.goTskID)
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
    goToTask(store.goTskID)
  } 
}

const addFileModal = ref('') 

function addFile() {
  addFileModal.value = true
}
function closeFileModal() {
  addFileModal.value = false
}
const fileFormData = new FormData()
function uploadFile(e) {
  const file = e.target.files[0]
  fileFormData.set("attach", file);
  console.log(file)
}
async function fileAdded() {
  fileFormData.set("sid", store.sid)
  fileFormData.set("userId", store.usrID)
  fileFormData.set("taskId", oneTask.value.TaskID)
  try {
    const msg = await api.addNewFile(fileFormData)
    console.log(msg)
    console.log(msg.data.msg)

  } catch (error) {
    console.log(error)
  } finally {
    store.allMyTasks()
    goToTask(store.goTskID)
    addFileModal.value = false
  }
}

</script>
<template>
  <Header />
  <div class="tView" >
    <div class="btn_div">
      <button @click="editTask(store.goTskID)">Edit Task</button>
      <button @click="tskEdit" v-if="rowEdit">Confirm</button>
      <button @click="rowEdit = false" v-if="rowEdit">Cancel</button>
      <button @click="route.push({name: 'myAccount'})">&lt; &lt; Back</button>
    </div>
    <div class="tdata">
      <div class="edit-row" v-if="rowEdit">
        <h4>Edit task title </h4>
        <input type="text" :value="oneTask.TaskTitle"
        @input="titleEdit" :disabled="!canEditTask">
      </div>
      <div class="edit-row" v-if="!rowEdit">
        <h4>Task title:</h4>
        <p>{{ oneTask.TaskTitle }}</p>
      </div>
      <div class="edit-row" v-if="rowEdit">
        <h4>Edit task Description </h4>
        <input type="text" :value="oneTask.TaskDescription"
        @input="descEdit" :disabled="!canEditTask">
      </div>
      <div class="edit-row" v-if="!rowEdit">
        <h4>Description:</h4>
        <p v-if="!oneTask.TaskDescription || oneTask.TaskDescription == null">N/A</p>
        <p v-if="oneTask.TaskDescription">{{ oneTask.TaskDescription }}</p>
      </div>
      <div class="edit-row" >
        <h4>Task type:</h4>
        <p v-if="!oneTask.TaskTypeName">N/A</p>
        <p v-if="oneTask.TaskTypeName">{{ oneTask.TaskTypeName }}</p>
      </div>
      <div class="edit-row" v-if="rowEdit">
        <h4>Edit category: </h4>
        <select v-model="categories" :disabled="!canEditTask">
          <option v-if="oneTask.TaskTypeID == 1" v-for="cat in privCat" 
            :key="cat.cat_id" :value="cat.cat_id" >{{ cat.cat_name }}</option>
            <option v-if="oneTask.TaskTypeID == 2" v-for="cat in proCat" 
            :key="cat.cat_id" :value="cat.cat_id" >{{ cat.cat_name }}</option>
            <option v-if="oneTask.TaskTypeID == 3" v-for="cat in temCat" 
            :key="cat.cat_id" :value="cat.cat_id" >{{ cat.cat_name }}</option>
        </select>
      </div>
      <div class="edit-row" v-if="!rowEdit">
        <h4>Task category:</h4>
        <p v-if="!oneTask.Categories">N/A</p>
        <p>{{ oneTask.Categories }}</p>
      </div>
      <div class="edit-row" v-if="rowEdit && oneTask.TaskTypeID != 1">
        <h4>Reassign to: </h4>
        <select v-model="assignedUserName" :disabled="!canEditTask" @input="console.log(assignedUserName)">
          <option value="" >Choose new</option>
          <option v-for="u in users" :key="u.usr_id"
          :value="u.usr_id" :disabled="!canEditTask">{{ u.usr_name }}</option>
        </select>
        <input type="text" :value="oneTask.AssignedUserName"
        disabled>
      </div>
      <div class="edit-row" v-if="!rowEdit">
        <h4>Assigned to: </h4>
        <p v-if="!oneTask.AssignedUserName">Not assigned</p>
        <p v-if="oneTask.AssignedUserName">{{ oneTask.AssignedUserName }}</p>
      </div>

      <div class="edit-row" v-if="rowEdit">
        <h4>Edit Status: </h4>
        <select v-model="status">
          <option value="1">Created</option>
          <option value="2">In progress</option>
          <option value="3">Completed</option>
        </select>
      </div>
      <div class="edit-row" v-if="!rowEdit">
        <h4>Task status: </h4>
        <p v-if="oneTask.Status == 1">Created</p>
        <p v-if="oneTask.Status == 2">In progress</p>
        <p v-if="oneTask.Status == 3">Completed</p>
      </div>
      <div class="edit-row" v-if="rowEdit">
        <h4>Edit due: </h4>
        <input type="date" :value="oneTask.DueDate"
        @input="dueEdit" :disabled="!canEditTask">
      </div>
      <div class="edit-row" v-if="!rowEdit">
        <h4>Task due:</h4>
        <p v-if="!oneTask.DueDate">N/A</p>
        <p v-if="oneTask.DueDate">{{ oneTask.DueDate }}</p>
      </div>
      <!--Odavde Novi redovi-->
      <div class="edit-row" v-if="rowEdit">
        <h4>Edit Time Planned: </h4>
        <input type="number" :value="oneTask.TimePlanned"
        @input="ptimeEdit" :disabled="!canEditTask">
      </div>
      <div class="edit-row" v-if="!rowEdit">
        <h4>Time Planned:</h4>
        <p v-if="!oneTask.TimePlanned">N/A</p>
        <p v-if="oneTask.TimePlanned">{{ oneTask.TimePlanned }}</p>
      </div>
      <div class="edit-row" v-if="rowEdit">
        <h4>Edit Time Spent: </h4>
        <input type="number" :value="oneTask.TimeSpent"
        @input="stimeEdit" :disabled="!canDoPartialEdit">
      </div>
      <div class="edit-row" v-if="!rowEdit">
        <h4>Time Spent:</h4>
        <p v-if="!oneTask.TimeSpent">N/A</p>
        <p v-if="oneTask.TimeSpent">{{ oneTask.TimeSpent }}</p>
      </div><!--
      <div class="edit-row" v-if="rowEdit">
        <h4>Edit Workspace: </h4>
        <input type="text" :value="oneTask.WorkspaceName"
        @input="wspEdit" :disabled="!canEditTask">
      </div>v-if="!rowEdit" -->
      <div class="edit-row" >
        <h4>Workspace:</h4>
        <p v-if="!oneTask.WorkspaceName">N/A</p>
        <p v-if="oneTask.WorkspaceName">{{ oneTask.WorkspaceName }}</p>
      </div>
      
      <div class="edit-row">
        <h4>Team:</h4>
        <p v-if="!oneTask.TeamName">N/A</p>
        <p v-if="oneTask.TeamName">{{ oneTask.TeamName }}</p>
      </div>
      
      <div class="edit-row">
        <h4>Project:</h4>
        <p v-if="!oneTask.ProjectName">N/A</p>
        <p v-if="oneTask.ProjectName">{{ oneTask.ProjectName }}</p>
      </div>
    </div>
    <button @click="store.deleteTask(oneTask.TaskID)">Delete Task</button>
    <div class="tfiles">
      <h5>Files :</h5>
      <div class="files_div" v-for="file in oneTaskFile">
        <a target="_blank" :href="fileApi + file.att_id + '?sid=' + store.sid">{{ file.att_title }}</a>
        <button @click="delFile(file.att_id)">Remove</button>
      </div>
      <button @click="addFile">Add new file</button>
      <!--Za delete File-->
      <div class="deleteTaskDiv" v-if="fileDel">
        <h2>Are you sure you want to delete this file?</h2>
        <div class="delButtons">
        <button @click="fileDel = false">Cancel</button>
        <button @click="fileDeleted(fileIdForDelete)">Delete</button>
        </div>
      </div>
      <!--Za add new File-->
      <div class="deleteTaskDiv" v-if="addFileModal">
        <input type="file" @input="uploadFile">
        <div class="delButtons">
        <button @click="closeFileModal">Cancel</button>
        <button @click="fileAdded">Add</button>
        </div>
      </div>
      <h4>Comments:</h4>
      <div class="comm_div" v-for="com in store.oneTaskComment.value" :key="com.com_id">
        <div class="onecom_div" v-if="!comOpen">
          <div class="com_title">
            <h4>{{ com.Comment_by }}</h4>
            <h4>Posted: {{ com.com_created }}</h4>
          </div>
          <p>{{ com.com_text }}</p>
          <div class="com_buttons">
            <button :id="com.com_id"
            :value="'com_text'" 
            @click="editCom">Edit</button>
            <button :id="com.com_id" 
            @click="delComm">Delete</button>
          </div>
        </div>
        <div class="onecom_div" v-if="comOpen">
          <h4>{{ com.username }}</h4>
          <textarea cols="30" rows="10"
          :value="com.com_text"
          @input="editComText"></textarea>
          <div class="com_buttons">
            <button 
            @click="comEdited">Confirm</button>
            <button @click="comOpen = false">Cancel</button>
          </div>
        </div>
        <h6 v-if="store.oneTaskComment.value.length < 1">No comments added</h6>
      </div>
      <div class="onecom_div" v-if="comTxtOpen">
        <h4>{{ store.usrName }}</h4>
        <textarea cols="30" rows="10"
          placeholder="Write a comment"
          v-model="nwComTxt"></textarea>
        <div class="com_buttons">
          <button 
          @click="comAdded">Confirm</button>
          <button @click="cancelAddCom">Cancel</button>
        </div>
      </div>
      <button @click="addCom">New Comment</button>
    </div>
    <button @click="route.push({name: 'myAccount'})">&lt; &lt; Back</button>
  </div>

  <div class="deleteTaskDiv" v-if="store.isCanceled">
      <h2>Are you sure you want to delete this task?</h2>
      <div class="delButtons">
      <button @click="store.cancelDelete">Cancel</button>
      <button @click="store.confirmDelete(store.idForDelete)">Delete</button>
  </div>
</div>
</template>
<style scoped>
    .tView {
    width: 100%;
    min-height: 80vh;
    background-color: white;
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    justify-items: center;
    align-items: center;
    align-content: center;
    z-index: 20;
  }
  .edit-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    align-content: space-between;
    justify-content: space-between;
    width: 100%;
    margin: 0.05rem;
    border-bottom: 1px solid black;
  }
  h4, h6, p, button, input, select {
    justify-self: center;
  }
  select, input {
    min-width: 12rem;
  }
  button {
    margin-bottom: 0.2rem;
  }
  .btn_div {
    display: flex;
    justify-content: center;
  }
  .editing {
    display: none;
  }
  .tdata {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    align-content: stretch;
    width: 100%;
    padding: 0.3rem;
  }
  .tfiles {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    align-content: space-around;
    width: 98%;
  }
  .comm_div, .files_div {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    align-content: space-between;
    width: 100%;
  }
  .com_title {
    display: flex;
    justify-content: space-between;
  }
  .onecom_div {
    border: 0.1325rem solid lightgrey;
    min-height: 28vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .onecom_div h4, .com_buttons, .com_title {
    background-color: lightgrey;
    padding: 0.4rem;
  }
  .onecom_div p {
    padding: 0.4rem;
  }
  .com_buttons {
    display: flex;
    justify-content: space-between;
  }
  h6 {
    text-align: center;
    width: 9rem;
  }
  button {
    background-color: #02ad8b;
    color: white;
    border: none;
    padding: 0.3rem;
    width: 5rem;
    margin-left: 1rem;
   }
   .deleteTaskDiv {
    display: grid;
    grid-template-columns: 1fr;
    width: 30vw;
    height: 25vh;
    position: fixed;
    top: 25vh;
    left: 40vw;
    background-color: black;
    color: white;
    border-radius: 0.6rem;
  }
  .delButtons {
    display: flex;
    justify-content: space-between;
  }
</style>