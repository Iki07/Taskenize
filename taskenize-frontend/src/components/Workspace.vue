<script setup>
import api from '@/api';
import { ref, onMounted, computed } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { useTaskStore } from '../stores/tasks';
import { useProStore } from '@/stores/projects';
import { useWsStore } from '@/stores/workspace';
const route = useRouter()
const store = useTaskStore()
const fromPros = useProStore();
const wsps = useWsStore();

const openAdmin = ref(false)
const openAssigned = ref(false)
const rol = ref(false)


</script>
<template>
    <section>
        <div class="section" v-if="store.myWorkspaces">
          <div class="wsTitle">
            <h1>Workspaces</h1>
            <div class="addBlankTask"
              @click="wsps.wsCreate = !wsps.wsCreate">
                Add new Workspace
            </div>
          </div>
          <div class="holder"  v-if="wsps.wsCreate"></div>
          <div class="wsCard" v-if="wsps.wsCreate">
            <div class="left">
              <input type="text" placeholder="WS name" 
              v-model="wsps.wsName">
              <textarea placeholder="Description"
              v-model="wsps.wsDesc"></textarea>
            </div>
            <div class="right">
              <label for="">Upload Avatar</label>
              <input type="file" @input="wsps.getFile">
              
              <button @click="wsps.createWs">Save</button>
              <button @click="wsps.wscrtDone">Cancel</button>
            </div>
          </div>
          <h3 @click="openAdmin = !openAdmin"><span v-if="!openAdmin">+ </span>
          <span v-if="openAdmin">- </span> 
          Workspaces you administrate</h3>
          <div class="line"></div>
          <div class="youManage" v-if="openAdmin">
            <div class="container" v-for="ws in wsps.wspsUserAdministrates" :key="ws.wsp_img">
              <div v-if="!ws">
                <h2>{{ wsps.msgAdmin }}</h2>
              </div>
              <div class="first">
                <div class="ws-name">{{ ws.wsp_name }}</div>
                <div class="ws-avatar">
                  <img :src="`http://307w123.e2.mars-hosting.com/api/avatar/${ws.wsp_img}`" v-if="ws.wsp_img" />
                  <p v-if="!ws.wsp_img">Avatar</p>
                </div>
              </div>
              <div class="second">
                <button class="btn" @click="wsps.goWs(ws.wsp_id)">View details</button>
              </div>
            </div>
            
          </div>
          <h3 @click="openAssigned = !openAssigned"><span v-if="!openAssigned">+ </span> 
          <span v-if="openAssigned">- </span>
          Workspaces you belong to</h3>
          <div class="line"></div>
          <div class="youManage" v-if="openAssigned">
            <div class="container" v-for="ws in wsps.wspsAssigned" :key="ws.wsp_id">
              <div class="first">
                <div class="ws-name">{{ ws.wsp_name }}</div>
                <div class="ws-avatar">
                  <img :src="`http://307w123.e2.mars-hosting.com/api/avatar/${ws.wsp_img_id}`" v-if="ws.wsp_img_id" />
                  <p v-if="!ws.wsp_img_id">Avatar</p>
                </div>
              </div>
              <div class="between">
                <label for="">Your role(s):</label>
                
                <label for="">Ws Admin</label>
                <div class="adm-avatar">
                  <img :src="`http://307w123.e2.mars-hosting.com/api/avatar/${ws.admin_img_id}`" v-if="ws.admin_img_id" />
                  <p v-if="ws.admin_img_id">{{ ws.admin }}</p>
                </div>
              </div>
              <div class="second">
                <div class="btn" @click="rol = true">Role list </div>
                <div v-if="rol" class="roles">
                  <p v-for="r in wsps.assRoles">{{ r }}</p>
                  <button @click="rol = false">OK</button>
                </div>
                <button class="btn" @click="wsps.goWs(ws.wsp_id)">View Details</button>
              </div>
            </div>
          </div>
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
    padding: 0.2rem;
    min-width: 12rem;
  }
  input, select, button {
    height: 2rem;
    font-size: 1.3rem;
    min-width: 12rem;
    text-align: center;
  }
  h3 {
    cursor: pointer;
  }
  textarea {
    border-radius: 0.6rem;
    text-align: center;
    font-size: 1.3rem;
    min-height: 60%;
  }
  .section {
    padding: 0.3rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
  .wsAvatar {
    min-height: 2rem;
    min-width: 12rem;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  
  .wsTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  .wsCard {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
    width: 90vw;
    height: 80vh;
    z-index: 5;
    position: fixed;
    left: 3rem;
    top: 3rem;
  }
  .left {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 66%;
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 43%;
    color: white;
  }
  .right input {
    margin-left: 3rem;
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
    height: 40vh;
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
  .ws-name {
    border: solid 0.0625rem #02ad8b;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .ws-avatar {
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
  .ws-avatar img {
    width: 100%;
    height: auto;
  }
  .second {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
    justify-content: center;
    row-gap: 1rem;
  }
  .between {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
  }
  .p-status, .p-enddate, .btn {
    border: solid 0.0625rem #02ad8b;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .p-status{
    justify-self: start;
  }
  .p-enddate {
    justify-self: end;
  }
  .adm-avatar {
    border: solid 0.0625rem #02ad8b;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 1.6rem;
    justify-self: end;
    margin-right: 1rem;
  }
  .btn:first-of-type {
    justify-self: start;
  }
  .btn:last-of-type {
    justify-self: end;
  }
  .roles {
    position: absolute;
    top: 80vh;
    left: 25vw;
    background-color: black;
    color: white;
    padding: 0.2rem;
    min-height: 9rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
 
  </style>