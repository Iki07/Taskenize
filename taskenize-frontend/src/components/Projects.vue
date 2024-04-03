<script setup>
import api from '@/api';
import { ref, onMounted, computed } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { useTaskStore } from '../stores/tasks';
import { useProStore } from '@/stores/projects';
const route = useRouter()
const store = useTaskStore()
const fromPros = useProStore();
const sid = localStorage.getItem('sid')
const openPMdiv = ref(false)
const openWorkDiv = ref(false)
const openAllDiv = ref(true)

</script>
<template>
  <section>
    <div class="section" v-if="store.myProDiv">
          <div class="proTitle">
            <h1>Projects</h1>
            <div class="addBlankPro"
            @click="fromPros.proModalOpen">
              Add new project
            </div>
          </div>
          <h3 @click="openPMdiv = !openPMdiv"><span v-if="!openPMdiv">+ </span>
          <span v-if="openPMdiv">- </span> 
          Projects you manage</h3>
          <div class="line"></div>
          <div class="youManage" v-if="openPMdiv">
            <div class="container" v-for="pro in fromPros.proWherePM" :key="pro.prj_id">
              <div class="first">
                <div class="p-name">{{ pro.prj_name}}</div>
                <div class="p-avatar">
                  <img :src="`http://307w123.e2.mars-hosting.com/api/avatar/${pro.prj_img}`" v-if="pro.prj_img">
                  <p v-if="!pro.prj_img">Avatar</p>
                </div>
              </div>
              <div class="second">
                <div class="p-status" v-if="pro.prj_status == 1">Created</div>
                <div class="p-status" v-if="pro.prj_status == 2">In progress</div>
                <div class="p-status" v-if="pro.prj_status == 3">Completed</div>
                <div class="p-enddate" v-if="!pro.prj_end_planned">N/A</div>
                <div class="p-enddate" v-if="pro.prj_end_planned">{{ pro.prj_end_planned }}</div>
                <button class="btn" @click="fromPros.goToPro(pro.prj_id)">View details</button>
                <button class="btn" @click="store.createTask = true">Add task</button>
              </div>
            </div>
          </div>
          <h3 @click="openWorkDiv = !openWorkDiv"><span v-if="!openWorkDiv">+ </span> 
            <span v-if="openWorkDiv">- </span>
          Projects you work on</h3>
          <div class="line"></div>
          <div class="youManage" v-if="openWorkDiv">
            <div class="container" v-for="pro in fromPros.proWhereAssigned" :key="pro.prj_id">
              <div class="first">
                <div class="p-name" >{{ pro.prj_name }}</div>
                <div class="p-avatar">
                  <img :src="`http://307w123.e2.mars-hosting.com/api/avatar/${pro.prj_img}`" v-if="pro.prj_img">
                  <p v-if="!pro.prj_img">Avatar</p>
                </div>
              </div>
              <div class="second">
                <div class="p-status" v-if="pro.prj_status == 1">Created</div>
                <div class="p-status" v-if="pro.prj_status == 2">In progress</div>
                <div class="p-status" v-if="pro.prj_status == 3">Completed</div>
                <div class="p-enddate" v-if="!pro.prj_end_planned">N/A</div>
                <div class="p-enddate" v-if="pro.prj_end_planned">{{ pro.prj_end_planned }}</div>
                <div class="pmsection">
                  <p>Project Manager: {{ pro.ProjectManager }}</p>
                  <div class="pm-avatar"></div>
                </div>
                <button class="btn" @click="fromPros.goToPro(pro.prj_id)">View details</button>
              </div>
            </div>
          </div>
          <h3 @click="openAllDiv = !openAllDiv"><span v-if="!openAllDiv">+ </span> 
          <span v-if="openAllDiv">- </span>
          View All Projects</h3>
          <table v-if="openAllDiv">
              <tr>
                <th>Avatar</th>
                <th>Title</th>
                <th>End date</th>
                <th>Status</th>
                <th>PM</th>
                <th>WS</th>
                <th>View</th> 
                <th>Delete</th>      
              </tr>
              <tr v-for="pro in fromPros.proRest" :key="pro.prj_id">
                <td>1</td>
                <td>{{ pro.prj_name }}</td>
                <td v-if="!pro.prj_end_planned ">N/A</td>
                <td v-if="pro.prj_end_planned ">{{ pro.prj_end_planned }}</td>
                <td v-if="pro.prj_status == 1">Created</td>
                <td v-if="pro.prj_status == 2">In progress</td>
                <td v-if="pro.prj_status == 3">Completed</td>
                <td >{{ pro.ProjectManager }}</td>
                <td >
                  {{ pro.wsp_name }}
                </td>
                <td>
                  <button @click="fromPros.goToPro(pro.prj_id)">View</button>
                </td>
                <td>
                  <button @click="fromPros.deletePro(pro.prj_id, sid)">Delete</button>
                </td>
              </tr>
        </table>
        </div>
      </section>
</template>
<style scoped>
section {
    width: 84vw;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.6rem;
  }
  section button {
    background-color: #02ad8b;
    color: white;
    border: none;
    padding: 0.3rem;
    width: 5rem;
  }
  h1 {
    text-align: center;
  }
  h3 {
    cursor: pointer;
  }
  .section {
    padding: 0.3rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
.addBlankPro {
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
  .line {
    width: 70%;
    height: 0.2rem;
    background-color: black;
  }
  .youManage {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: space-between;
    column-gap: 2rem;
    row-gap: 1rem;
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 35vh;
    width: 38vw;
    padding: 0.6rem;
    border: solid 0.0625rem #02ad8b;
    gap: 2rem;
  }
  .first {
    display: grid;
    grid-template-columns: 2fr 1fr;
    width: 100%;;
  }
  .p-name {
    border: solid 0.0625rem #02ad8b;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
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
    max-width: 100%;
    height: auto;
  }
  .pm-avatar {
    border: solid 0.0625rem #02ad8b;
    width: 1rem;
    height: 1rem;
    border-radius: 1rem;
  }
  .pmsection {
    display: flex;
    gap: 0.2rem;
  }
  .second {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
    justify-content: center;
    row-gap: 1rem;
  }
  .p-status, .p-enddate {
    border: solid 0.0625rem #02ad8b;
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btn {
    width: 50%;
    padding: 0.1rem;
  }
  .p-status{
    justify-self: start;
  }
  .p-enddate {
    justify-self: end;
  }
  .btn:first-of-type {
    justify-self: start;
  }
  .btn:last-of-type {
    justify-self: end;
  }
  .proDivIn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin-top: 0.3rem;
    cursor: pointer;
    border: 0.0625rem solid black;
    border-radius: 1.5rem;
  }
  .proDivIn:hover {
    background-color: rgb(27, 25, 25);
    color: rgb(11, 235, 235);
  }
  .proTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
</style>