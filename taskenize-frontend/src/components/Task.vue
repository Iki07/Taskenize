<script setup>
    import api from '@/api';
    import { ref, onMounted, computed } from 'vue';
    import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
    import { useTaskStore } from '../stores/tasks';
    import { useProStore } from '@/stores/projects';
    const route = useRouter()
    const store = useTaskStore()
    const fromPros = useProStore();

    const openPrivate = ref(true)
    const openProject = ref(false)
</script>
<template>
  <section>
    <div class="section" v-if="store.myTasksDiv">
            <div class="taskTitle">
              <h1>My Tasks</h1>
              <div class="addBlankTask"
              @click="store.createTask = !store.createTask, fromPros.createPro = false">
                Add new task
              </div>
            </div>
            <h3 @click="openPrivate = !openPrivate"><span v-if="openPrivate">- </span> 
            <span v-if="!openPrivate">+ </span>   My private tasks</h3>
            <div class="line"></div>
            <table v-if="openPrivate">
              <tr>
                <th>Title</th>
                <th>Importance</th>
                <th>Status</th>
                <th>Due date</th>
                <!--<th v-if="store.tabTyp">Type</th>-->
                <th v-if="store.tabTM">Team</th>
                <th v-if="store.tabPro">Project</th>
                <th v-if="store.tabWor">Workspace</th>     
                <th>View</th>
                <th>Delete</th>      
              </tr>
              <tr v-for="task in store.tasks" :key="task.TaskID"
              :class="{completed: task.Status == 3}">
                <td>{{ task.TaskTitle }}</td>
                <td v-if="task.Importance == 0">Not important</td>
                <td v-if="task.Importance == 1">Important</td>
                <td v-if="task.Status == 1">Created</td>
                <td v-else-if="task.Status == 2">In progress</td>
                <td v-else-if="task.Status == 3">Completed</td>
                <td v-else>N/A</td>
                <td>{{ task.DueDate }}</td>
                <!--<td v-if="store.tabTyp">
                  {{ task.TaskTypeName }}
                </td>-->
                <td v-if="store.tabTM">
                  {{ task.TeamName }}
                </td>
                <td v-if="store.tabPro">{{ task.ProjectName }}</td>
                <td v-if="store.tabWor">{{ task.WorkspaceName }}</td>
                <td>
                  <button @click="store.goTask(task.TaskID)">View</button>
                </td>
                <td>
                  <button @click="store.deleteTask(task.TaskID)">Delete</button>
                </td>
              </tr>
        </table>
        <div class="deleteTaskDiv" v-if="store.isCanceled">
          <h2>Are you sure you want to delete this task?</h2>
          <div class="delButtons">
            <button @click="store.cancelDelete">Cancel</button>
            <button @click="store.confirmDelete(store.idForDelete)">Delete</button>
          </div>
        </div>
        <h3 @click="openProject = !openProject"><span v-if="openProject">- </span> 
        <span v-if="!openProject">+ </span>   My project tasks</h3>
        <div class="line"></div>
        <table v-if="openProject">
              <tr>
                <th>Title</th>
                <th>Importance</th>
                <th>Status</th>
                <th>Due date</th>
                <!--<th v-if="store.tabTyp2">Type</th>-->
                <th v-if="store.tabTM2">Team</th>
                <th v-if="store.tabPro2">Project</th>
                <th v-if="store.tabWor2">Workspace</th>     
                <th>View</th>
                <th>Delete</th>      
              </tr>
              <tr v-for="task in store.proTasks" :key="task.TaskID"
              :class="{completed: task.Status == 3}">
                <td>{{ task.TaskTitle }}</td>
                <td v-if="task.Importance == 0">Not important</td>
                <td v-if="task.Importance == 1">Important</td>
                <td v-if="task.Status == 1">Created</td>
                <td v-else-if="task.Status == 2">In progress</td>
                <td v-else-if="task.Status == 3">Completed</td>
                <td v-else>N/A</td>
                <td>{{ task.DueDate }}</td>
                <!--<td v-if="store.tabTyp2">
                  {{ task.TaskTypeName }}
                </td>-->
                <td v-if="store.tabTM2">
                  {{ task.TeamName }}
                </td>
                <td v-if="store.tabPro2">{{ task.ProjectName }}</td>
                <td v-if="store.tabWor2">{{ task.WorkspaceName }}</td>
                <td>
                  <button @click="store.goTask(task.TaskID)">View</button>
                </td>
                <td>
                  <button @click="store.deleteTask(task.TaskID)">Delete</button>
                </td>
              </tr>
        </table>
    </div> 
  </section>
</template>
<style scoped>
    section {
    width: 78vw;
    padding: 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  section button {
    background-color: #02ad8b;
    color: white;
    border: none;
    padding: 0.3rem;
    width: 5rem;
  }
  .section {
    padding: 0.3rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  h1 {
    text-align: center;
  }
  h3 {
    cursor: pointer;
  }
  .taskTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
  } 
  .addBlankTask {
    background-color: #02ad8b;
    color: white;
    padding: 1rem;
    width: 9rem;
    height: 3rem;
    border-radius: 1rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .completed {
    background-color: lightgreen;
    color: green;
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
  table {
    border-collapse: separate;
    width: 100%;
    margin: 0 auto;
  }
  thead {
    border-collapse: separate;
    width: 90%;
    margin: 0 auto;
  }
  th {
    margin: 0 auto;
    background-color: #02ad8b;
    color: white;
  }
  th, td {
    border: solid 0.0625rem #e6e6e6;
    padding: 0.3rem;
    margin: 0.9rem;
    height: 4rem;
  }
  td button {
    background-color: #02ad8b;
  }
  .line {
    width: 70%;
    height: 0.2rem;
    background-color: black;
  }
</style>