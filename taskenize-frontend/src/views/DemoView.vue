<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';

const createClick = ref(false)
const pClick = ref(false)
const createTask = ref(false)

const taskName = ref('')
const taskDescription = ref('')

const isCanceled = ref(false)
const edited = ref(false)
const idForEdit = ref(null)
const idForDelete = ref(null)
const nameEdited = ref('')
const descEdited = ref('')

let count = 0
const tasks = ref([])
const fromStore = computed(() => {
  return JSON.parse(localStorage.getItem('tasks'))
})

if(fromStore.value) {
  tasks.value = fromStore.value
}

let task_id = Number(localStorage.getItem('task_id')) 
if(!task_id) {
  count = 0
} else {count = task_id + 1}

function addTask() {
  if(fromStore.value) {
    if(fromStore.value.length > 9) {
      alert("You have reached limit of 10 tasks. Please create account for more options!")
      return
    }
  }
  
  if(!taskName.value.trim() || !taskDescription.value.trim()) {return}
  
  const taskObj = {
    id: count,
    name : taskName.value,
    description : taskDescription.value,
    completed : false
  }
  tasks.value.push(taskObj)

  localStorage.setItem('tasks', JSON.stringify(tasks.value))

  taskName.value = ""
  taskDescription.value = ""

  createTask.value = false
  count++
  localStorage.setItem('task_id', count)
}

function isCompleted(id) {
  for(let t of tasks.value) {
        if(t.id == id) {
          t.completed = !t.completed
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
}

function deleteTask(id) {
    isCanceled.value = true
    idForDelete.value = id
}

function confirmDelete() {
    for(let t of tasks.value) {
        if(t.id == idForDelete.value) {
            tasks.value.splice(tasks.value.indexOf(t), 1)
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
    isCanceled.value = false
}


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
}

</script>

<template>
  <nav>
    <div class="create-new" @click="createClick = !createClick">Create New  +</div>
    <input type="text" placeholder="Search">
    <div class="links">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/login">Log in</RouterLink>
      <RouterLink to="/register">Register</RouterLink>
    </div>
  </nav>
  <div class="tocreate" :class="{tocreate2 : createClick}">
    <p @click="createTask = !createTask, taskName = '', taskDescription = ''">TASK</p>
    <p class="disabled" @click="pClick = !pClick" @mouseleave="pClick = false">PROJECT</p>
    <p class="disabled" @click="pClick = !pClick" @mouseleave="pClick = false">TEAM</p>
  </div>
  <div class="cloud" v-if="pClick">
    <h4>This field is only for registred users. Please create your taskenize account</h4>
  </div>
  <div class="cloud-tr" v-if="pClick"></div>
  <div class="creteTask" v-if="createTask">
    <div class="status">
      <input type="checkbox" class="check" v-model="taskCompl">
      <h4>Completed</h4>
    </div>
    <input type="text" placeholder="Task Name" v-model="taskName">
    <input type="text" placeholder="Description" v-model="taskDescription">
    <input type="text" placeholder="Deadline" disabled>
    <select name="" id="" disabled>
      <option value="">Priority</option>
      <option value="">Top</option>
      <option value="">High</option>
      <option value="">Medium</option>
      <option value="">Low</option>
    </select>
    <input type="text" placeholder="Time Planned" disabled>
    <div class="button-group">
      <button @click="addTask">Add</button>
      <button @click="createTask = false, taskName = '', taskDescription = ''">Dismiss</button>
    </div>
  </div>
  <main @click="createClick = false">
    <aside>
      <div class="a-inbox">
        <h4>Inbox</h4>
        <h3>My Tasks</h3>
      </div>
      
      <div class="a-projects">
        <h3>My Projects</h3>
      </div>
      <div class="a-team">
        <h3>Team</h3>
      </div>
    </aside>
    <section>
        <div v-if="edited" class="editTask">
            <input type="text" placeholder="Edit Task Name" v-model="nameEdited">
            <input type="text" placeholder="Edit task description" 
            v-model="descEdited">
            <button @click="toEdit">Edit</button>
            <button @click="editActionCancel">Cancel</button>
        </div>
        <div v-if="isCanceled" class="deleteTask">
            <h4>Do you really want to delete this task?</h4>
            <button @click="confirmDelete">Yes</button>
            <button @click="isCanceled = false">No</button>
        </div>
        <h1>My Tasks</h1>
        <div class="task_view" v-for="task in tasks" :key="task.id"
        :class="{completed: task.completed}">
        <input type="checkbox" class="checkbox" :checked="task.completed"
        @click="isCompleted(task.id)">
        <h6 >{{ task.name }}</h6>
        <h6>{{ task.description }}</h6>
        <div class="button-group">
          <button @click="deleteTask(task.id)">Delete</button>
          <button @click="editAction(task.id)">Edit</button>
        </div>
        </div> 
    </section>
    
  </main>

  
</template>

<style scoped>

  @keyframes fade-down {
    from {
      left: -20vw;
    } to {
      left: 0;
    }
  }
  @keyframes cloud-in {
    from {
      opacity: 0;
    } to {
      opacity: 1;
    }
  }
  @keyframes cloud-out {
    from {
      opacity: 1;
    } to {
      opacity: 2;
    }
  }

  a {
    text-decoration: none;
    color: white;
  }
  aside {
    background-color: rgb(27, 22, 22);
    min-height: 100vh;
    width: 15vw;
    color: white;
    padding: 1rem;
  }
  aside > div {
    margin-bottom: 1.5rem;
  }
  aside h3:hover,h4:hover {
    cursor: pointer;
  }
  .a-inbox {
    padding-top: 30px;
  }
  .a-inbox h4 {
    text-transform: uppercase;
    margin-bottom: 20px;
    color: rgba(255,255,255,0.5);
  }
  h4 {
    margin-bottom: 0.5rem;
  }
  nav input {
    width: 40vw;
    height: 40px;
    border-radius: 4px;
    text-align: left;
    background-color: black;
    color: white;
    font-size: 1rem;
    border: 0;
    padding: 0 1rem;
  }
  main {
    display: flex;
    background-color: #f3f3f3;
  }
  nav {
    z-index: 10;
    background-color: rgb(27, 22, 22);
    width: 100%;
    height: 9vh;
    border-bottom: 0.0625rem solid gray;
    padding: 20px 20px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .cloud {
    padding: 1rem;
    width: 18rem;
    height: 9rem;
    background-color: rgb(238, 231, 231);
    position: absolute;
    top: 12vh;
    left: 18vw;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    animation: cloud-in 2s 1;
  }
  .cloud h4 {
    text-align: center;
  }
  .cloud-tr {
    height: 5rem;
    width: 5rem;
    position: absolute;
    top: 16vh;
    left: 17vw;
    background-color: rgb(238, 231, 231);
    transform: rotate(-30deg);
    z-index: 1;
    animation: cloud-in 2s 1;
  }
  .create-new {
    height: 40px;
    width: 13rem;
    border-radius: 4px;
    border: 0.0625rem solid gray;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: crimson;
    border: 0;
    font-size: 14px;
  }
  .create-new:hover {
    cursor: pointer;
  }
  .creteTask {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    min-height: 21rem;
    width: 400px;
    position: absolute;
    top: 18vh;
    left: 16vw;
    padding: 1rem;
    background-color: white;
    border-radius: 4px;
  }
  .creteTask input, select, button {
    with: 100%; height: 40px;
    border-radius: 4px;
    text-align: left;
    font-size: 1rem;
    border: 0.0625rem solid #dddddd;
    box-sizing: border-box;
    padding: 0 1rem;
    margin-bottom: 0.5rem;
  }
  .button-group {
    display: flex; justify-content: space-between; align-items: center; gap: 20px;
    padding-top: 15px; margin-top: 10px;
    border-top: 0.0625rem solid #dddddd;
  }
  .button-group button {
    display: block;
    width: 100%;
    text-align: center;
  }
  .creteTask button:first-of-type {
    background-color: rgb(68, 153, 68);
    color: white;
    border: none;
  }
  .creteTask button:last-of-type {
    background-color: crimson;
    color: white;
    border: none;
  }
  .disabled {
    color: gray;
  }
  .links {
    display: flex; gap: 20px;
    align-items: center;
    font-size: 13px;
  }
  .status {
    display: flex; align-items: center; gap: 1rem;
    h4 {
      font-size: 13px;
    }
  }
  .tocreate {
    width: 220px;
    background-color: black;
    color: white;
    padding: 1rem;
    position: absolute;
    top: 9vh;
    left: -20vw;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: stretch;
    z-index: 1;
  }
  .tocreate p {
    padding: 0.3rem; margin-bottom: 10px;
    border-bottom: 0.0625rem solid rgba(255,255,255,0.2);
  }
  .tocreate p:hover {
    cursor: pointer;
    color: aquamarine;
  }
  .tocreate2 {
    animation: fade-down 1s 1 forwards;
    z-index: 1;
  }

  section {
    width: 78vw;
    padding: 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  section button {
    background-color: crimson;
    color: white;
    border: 0.0625rem solid white;
    padding: 0.3rem;
    width: 5rem;
  }
  h1 {
    padding: 20px;
    border-bottom: 1px solid #dddddd;
  }
  .task_view {
    max-height: 4rem;
    padding: 0.6rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    border-bottom: 1px solid #dddddd;
    input {
      flex-basis: 30px;
    }
    h6 {
      flex: 1;
      text-align: left;
      font-size: 13px;
      margin: 0;
    }
    .button-group {
      border: 0;
      padding: 0; margin: 0;
      flex-basis: 200px;
      button:last-of-type {
        background-color: black;
      }
    }
  }
  input .checkbox {
    border-radius: 100%;
    background-color: gray;
    width: 2rem;
  }
  .completed {
    background-color: lightgreen;
    color: green;
  }
  .editTask,
  .deleteTask {
    display: flex; gap: 10px; align-items: center;
    padding: 15px 20px 10px 20px;
    border-radius: 4px;
    background-color: white;
    input {
      height: 40px;
      padding: 0 1rem;
      border: 1px solid #dddddd; border-radius: 4px;
    }
    h4 {
      margin: 0;
      font-size: 14px;
    }
    button {
      text-align: center;
      &:first-of-type {
        background-color: black;
      }
    }
  }
</style>
