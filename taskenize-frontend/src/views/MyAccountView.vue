<script setup>
import api from '@/api';
import { ref, onMounted, computed } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { useTaskStore } from '../stores/tasks';
import { useProStore } from '@/stores/projects';
import Header from '@/components/Header.vue';
import TaskProCreate from '../components/TaskProCreate.vue';
import Aside from '../components/Aside.vue';
import Task from '@/components/Task.vue';
import Projects from '@/components/Projects.vue';
import Teams from '@/components/Teams.vue';
import Users from '@/components/Users.vue';
import Reports from '@/components/Reports.vue';
import Workspace from '@/components/Workspace.vue';
const route = useRouter()
const store = useTaskStore()
const fromPros = useProStore();

// const myTasksDiv = ref(true)
// const myProDiv = ref(false)
// const myTeamDiv = ref(false)

// function onTasksDiv() {
//     myTasksDiv.value = true
//     myProDiv.value = false
//     myTeamDiv.value = false
//     store.allMyTasks()
// }
onMounted(() => {
  store.onTasksDiv()
})
// function onProDiv() {
//     myTasksDiv.value = false
//     myProDiv.value = true
//     myTeamDiv.value = false
//     allPro()
// }
// function onTeamDiv() {
//     myTasksDiv.value = false
//     myProDiv.value = false
//     myTeamDiv.value = true 
// }
// MODALS
// const createClick = ref(false)
// const createView = ref(false)
// const createTask = ref(false)
// const createPro = ref(false)
/*
const taskFormData = new FormData()
const taskName = ref('')
const taskDescription = ref('')
const taskDue = ref('')
const pTime = ref('')
const rTime = ref('')
const taskComm = ref('')
const tPrior = ref('')
const tStatus = ref('')
const tFlag = ref('')
const tType = ref('')
const tCategory = ref('')
const tAssign = ref('')
const tReassign = ref('')
*/
// const proName = ref('')
// const proDesc = ref(null)
// const proPlanBegin = ref(null)
// const proRealBegin = ref(null)
// const proPlanFin = ref(null)
// const proRealFin = ref(null)
// const proPM = ref(null)
// const proTM = ref(null)

// const isCanceled = ref(false)

// EDIT LOGIKA ZA TASK (DEO)
const edited = ref(false)
const idForEdit = ref(null)
const idForDelete = ref(null)
const nameEdited = ref('')
const descEdited = ref('')

// const taskOverview = ref(false)

//const statusNew = ref('')

// AFTER LOGIN 
const user = JSON.parse(localStorage.getItem('userData'))
//const sid = user.sid
const usr_data = user.userAuthData //podaci user-a
const usr_lett = user.userName.split('')[0]
const usrID = user.userId
const worID = usr_data.wsp_id
let tmID = 0
let proID = 0
//
/*
function createTaskDone() {
  createTask.value = !createTask.value 
  taskName.value = ''
  taskDescription.value = ''
  taskDue.value = ''
  pTime.value = ''
  rTime.value = ''
  taskComm.value = ''
  tPrior.value = ''
  tStatus.value = ''
  tFlag.value = ''
  tType.value = ''
  tCategory.value = ''
  tAssign.value = ''
  tReassign.value = ''
}
*/
//MY PRO
// function createProDone() {
//   createPro.value = false
//   proName.value = ''
//   proDesc.value = null
//   proPlanBegin.value = null
//   proPlanFin.value = null
//   proRealBegin.value = null
//   proRealFin.value = null
//   proPM.value = null
//   proTM.value = null
// }

// async function addPro() {
//   const formData = new FormData()
//   formData.append('proName', proName.value)
//   formData.append('proDesc', proDesc.value)
//   formData.append('proPstart', proPlanBegin.value)
//   formData.append('proRstart', proRealBegin.value)
//   formData.append('proPend', proPlanFin.value)
//   formData.append('proRend', proRealFin.value)
//   formData.append('usrID', Number(usrID))
//   formData.append('tmID', tmID)
//   formData.append('worID', Number(worID))

//   try {
//     const msg = await api.createProject(formData)
//     console.log(msg)
//     onProDiv()
//   } catch (error) {
//     console.log(error)
//   } finally {
//     createProDone()
//   }
// }

// const projects = ref([])
// async function allPro() {
//   try {
//     const res = await api.getMyProjects(usrID)
//     console.log(res)
//     projects.value = res.data.projects
//   } catch (error) {
//     console.log(error)
//   }
// }

// async function deletePro(id) {
//   try {
//     const msg = await api.deleteMyProject(Number(id))
//     console.log(msg.data)
//     onProDiv()
//   } catch (error) {
//     console.log(error)
//   }
// }

// function goToPro(id) {
//   localStorage.setItem('pro_id', id)
//   route.push({name: "project"})
// }

// MY TASKS
// const tabTyp = ref(false)
// const tabTM = ref(false)
// const tabPro = ref(false)
// const tabWor = ref(false)
// const tasks = ref([])
/*
async function allMyTasks() {
  try {
    const msg = await api.getMyTasks(usrID)
    console.log(msg)
    tasks.value = msg.data.mytasks 
    let typ = 0
    let tm = 0
    let pro = 0
    let wor = 0
    for(let t of tasks.value) {
      if(t.app_pro_id) {
        pro++
      }
      if(t.app_team_id) {
        tm++
      }
      if(t.app_task_type_id) {
        typ++
      }
      if(t.app_wor_id) {
        wor++
      }
    }
    if(typ > 0) {
      tabTyp.value = true
    }
    if(tm > 0) {
      tabTM.value = true
    }
    if(pro > 0) {
      tabPro.value = true
    }
    if(wor > 0) {
      tabWor.value = true
    }
  } catch (error) {
    console.log(error)
  }
}
//
async function getFile(e) {
  const file = e.target.files[0]
  console.log(file)
	taskFormData.set("file", file);
}
async function addTask() {
  try {
    taskFormData.set("taskName", taskName.value)
    taskFormData.set("usrID", usrID)
    if(proID) {
      taskFormData.set("proID", proID)
    }
    if(tmID) {
      taskFormData.set("tmID", tmID)
    }
    taskFormData.set("taskDesc", taskDescription.value)
    taskFormData.set("taskTypeID", tType.value)
    taskFormData.set("taskDline", taskDue.value)
    taskFormData.set("taskStatus", tStatus.value)
    taskFormData.set("taskPtime", pTime.value)
    taskFormData.set("taskRtime", rTime.value)
    taskFormData.set("taskPrior", tPrior.value)
    taskFormData.set("taskComm", taskComm.value)
    taskFormData.set("taskCat", tCategory.value)
    taskFormData.set("taskAssign", tAssign.value)
    taskFormData.set("taskReassign", tReassign.value)
    if(tFlag.value && tFlag.value != "") {
      taskFormData.set("important", tFlag.value)
    }

    const msg = await api.createTask(taskFormData)
    console.log(msg)
    
  } catch (error) {
    console.log(error)
  } finally {
    createTaskDone()
    onTasksDiv()
    taskFormData.delete("file")
    taskFormData.delete("important")
    taskFormData.delete("proID")
    taskFormData.delete("timID")
  } 
}
*/
// const oneTask = ref([])
// const oneTaskComment = ref([])
/*
async function goToTask(id) {
  //localStorage.setItem('app_task_id', id)
  //<h6>Comment: {{ oneTaskComment.task_id }}</h6>
  try {
    const msg = await api.goToTask(id)
    console.log(msg)
    oneTask.value = msg.data.task[0]
    console.log(msg.data.comment)
    oneTaskComment.value = msg.data.comment
    taskOverview.value = true
  } catch (error) {
    console.log(error)
  }
}
//const newValue = ref('')
const changeStID = ref('')

async function statusChanged(val, id) {
  try {
    const msg = await api.changeTaskStatus(val, id)
    console.log(msg)
  } catch (error) {
    console.log(error)
  } finally {
    onTasksDiv()
  }
}

function changeStatus(e) {
  let newValue = e.target.value
  console.log(newValue + "\n" + changeStID.value)
  statusChanged(newValue, changeStID.value)
}
function changeStatusWithID(id) {
  //statusChanged(newValue.value, id)
  changeStID.value = id
  //console.log(newValue.value + "\n" + id)
}

function deleteTask(id) {
    isCanceled.value = true
    idForDelete.value = id
}

async function confirmDelete(id) {
  console.log(id)
  try {
    const msg = await api.deleteMyTask(Number(id))
    console.log(msg)
    onTasksDiv()
  } catch (error) {
    console.log(error)
  } finally {
    isCanceled.value = false
  } 
}
*/
// EDIT LOGIKA TASKA (2 DEO)
function editAction(id) {
    edited.value = true
    idForEdit.value = id 
}
function editActionCancel() {
    nameEdited.value = ""
    descEdited.value = ""
    edited.value = false
}

function toEdit() {
    if(!nameEdited.value.trim() || !descEdited.value.trim()) {return}
    for(let t of tasks.value) {
        if(t.id == Number(idForEdit.value)) {
            t.name = nameEdited.value
            t.description = descEdited.value
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
    editActionCancel()
};
// LOGOUT
// async function toLogOut() {
//   let userData = JSON.parse(localStorage.getItem('userData'))
//   let sid = userData.sid
//   console.log(sid)
//   try {
//     const msg = await api.appLogout(sid)
//     console.log(msg)
//     localStorage.setItem('userData', null)
//     route.push({path: "/"})
//   } catch (error) {
//     console.log(error)
//   }
// }

</script>
<template>
  <Header />
  <TaskProCreate />
  <main @click="store.createClick = false, store.createView = false">
  <Aside />
  <Task v-if="store.myTasksDiv"/>
  <Projects v-if="store.myProDiv"/>
  <Teams v-if="store.myTeamDiv"/>
  <Users v-if="store.usersDiv"/>
  <Reports v-if="store.reportsDiv"/>
  <Workspace v-if="store.myWorkspaces"/>
  </main>
</template>
<style scoped>
    @keyframes fade-down {
    from {
      top: -30vh;
      opacity: 0;
    } to {
      top: 9vh;
      opacity: 1;
    }
  }
  
  main {
    display: flex;
  }
  
 
</style>