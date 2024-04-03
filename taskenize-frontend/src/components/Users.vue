<script setup>
import api from '@/api';
import { ref, onMounted, computed } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { useTaskStore } from '../stores/tasks';
import { useProStore } from '@/stores/projects';
import { useUsersStore } from '@/stores/users';
import { useProfiles } from '@/stores/profile';
import Header from './Header.vue';
const userStore = useUsersStore()
const route = useRouter()
const store = useTaskStore()
const fromPros = useProStore();
const profiles = useProfiles()

</script>
<template>
  <section>
    <div class="section" v-if="store.usersDiv">
      <div class="taskTitle">
        <h1>Users</h1>
        <div class="addBlankTask"
        @click="userStore.openCreateModal">
          Create new user
        </div>
      </div>
      <table >
        <tr>
          <th>Avatar</th>
          <th>Name</th>
          <th>Email</th>   
          <th>Workspace</th>  
          <th>Team</th>
          <th>Role</th>
          <th>View</th>
          <th>Delete</th>      
        </tr>
        <tr v-for="u in userStore.usersToShow">
          <td>
            <div class="p-avatar">
              <img :src="`http://307w123.e2.mars-hosting.com/api/avatar/${u.usr_img}`" v-if="u.usr_img" />
              <p v-if="!u.usr_img">Avatar</p>
            </div>
          </td>
          <td >{{ u.usr_name }}</td>
          <td >{{ u.usr_email }}</td>
          <td >{{ u.wsp_name }}</td>
          <td >{{  }}</td>
          <td >{{ u.role_name }}</td>
          <td>
            <button @click="profiles.viewProfile(u.usr_id)">View</button>
          </td>
          <td>
            <button >Delete</button>
          </td>
        </tr>
      </table>
    </div>
  </section>
  <div class="holder" v-if="userStore.createUser"></div>
  <div class="createUser" v-if="userStore.createUser">
    <h2 v-if="userStore.mandatory">Please fill out all mandatory fields</h2>
    <h2 v-if="userStore.regMail">Please fill out all mandatory fields</h2>
    <div class="modalDivs">
      <div class="field">
        <p>User Name: </p>
        <input type="text" :class="{mandatory : userStore.mandatory}"
        placeholder="Name" v-model="userStore.name">
      </div>
      <div class="field">
        <p>User Email: </p>
        <input type="text" :class="{mandatory : userStore.mandatory}"
        placeholder="user@mail.com" v-model="userStore.email">
      </div>
    </div>
    <div class="modalDivs">
      <div class="field">
        <p>Select Workspace: </p>
        <select v-model="userStore.wspId" :class="{mandatory : userStore.mandatory}">
          <option v-for="ws in userStore.myWsps" :value="ws.wsp_id">
            {{ ws.wsp_name }}
          </option>
        </select>
      </div>
      <div class="field">
        <p>Select Team: </p>
        <select v-model="userStore.temId" >
          <option value="">team</option>
        </select>
      </div>
    </div>
    <div class="modalDivs">
      <div class="field">
        <label :class="{mandatory : userStore.mandatory}">Select Roles:</label>
        <div v-for="rol in userStore.roleIds">
        <p  v-if="rol == 2">Admin</p>
        <p v-if="rol == 3">User</p>
        <p  v-if="rol == 4">Project Manager</p>
        <p  v-if="rol == 5">Team Manager</p>
        </div>
        <button class="multiBtn" @click="userStore.roleSel = true">Select Roles</button>
      </div>
      <div class="multi" v-if="userStore.roleSel">
          <div >
            <div class="check">
              <input type="checkbox" value="2"
              @click="userStore.pushRoleId">
              <p>Admin</p>
              <input type="checkbox" value="3"
              @click="userStore.pushRoleId">
              <p>User</p>
              <input type="checkbox" value="4"
              @click="userStore.pushRoleId">
              <p>Project Manager</p>
              <input type="checkbox" value="5"
              @click="userStore.pushRoleId">
              <p>Team Manager</p>
            </div>
          </div>
          <button class="multiBtn" @click="userStore.roleSel = false">Done</button>
        </div>
    </div>
    <div class="modalDivs">
      <div class="buttons">
        <button @click="userStore.createNewUser">DONE</button>
      </div>
      <div class="buttons">
        <button @click="userStore.createUserDone">CANCEL</button>
      </div>
    </div>
  </div>
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
  h2 {
    text-align: center;
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
  .holder {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    opacity: 0.8;
    background-color: black;
  }
  .createUser {
    height: 90vh;
    width: 90vw;
    padding: 3rem;
    position: absolute;
    top: 4vh;
    left: 6vw;
    z-index: 3;
    color: white;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .field {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
  .field input, select {
    font-size: 1.2rem;
    width: 12rem;
    border-radius: 2rem;
    text-align: center;
  }
  .modalDivs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  .modalDivs button {
    width: 12rem;
    font-size: 1.1rem;
    background-color: #02ad8b;
    color: white;
    border: none;
    padding: 0.3rem;
  }
  .buttons {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .multi {
    
    width: 18rem;
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
  .mandatory {
    border: solid 0.1325rem rgba(255, 0, 0, 0.789);
  }
  .p-avatar {
    border: solid 0.0625rem #02ad8b;
    width: 3rem;
    height: 3rem;
    border-radius: 3rem;
    justify-self: end;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .p-avatar img {
    width: 100%;
    height: auto;
  }
  </style>