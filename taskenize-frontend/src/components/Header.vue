<script setup>
    import api from '@/api';
    import { ref, onMounted, computed } from 'vue';
    import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
    import { useTaskStore } from '../stores/tasks';
    import TaskProCreate from '../components/TaskProCreate.vue';
    import { useAuthStore } from '@/stores/authStore';
    import { useProStore } from '@/stores/projects';
    //import { useLogOutStore } from '@/stores/logout';
    import { useWsStore } from '@/stores/workspace';
    import { useProfiles } from '@/stores/profile';
    const user = JSON.parse(localStorage.getItem('userData'))
    const usrName = user.userName
    const usrID = user.userId

    const route = useRouter()
    const store = useTaskStore()
    const fromPros = useProStore();
    //const logout = useLogOutStore()
    const auth = useAuthStore()
    const wsps = useWsStore()
    const profiles = useProfiles()

    const wspsSelect = ref(false)
    const chosenWsID = ref('')
    //const chosenWsName = ref('') 

    function wspsChoose() {
      wspsSelect.value = !wspsSelect.value
     wsps.allWsps()
    }
    async function newWsps() {
      console.log("izabrani: " + chosenWsID.value)
      try {
        const msg = await api.selectOneWs(chosenWsID.value)
        console.log(msg.data.myWs[0].app_wor_name)
        store.myWor.value = msg.data.myWs[0]
        fromPros.myWor.value = msg.data.myWs[0]
        //localStorage.setItem("current_worID", msg.data.myWs[0].app_wor_id)
    //     //console.log(fromPros.myWor.value.app_wor_id)
    //     //console.log(fromPros.worID.value)
    } catch(error) {
        console.log(error)
    } finally {
      wspsSelect.value = false
    }
    }
    /**
     * v-if="wsps.wspsSelect"
     */
</script>
<template>
  <TaskProCreate />
    <nav>
        <img src="../assets/img/Taskenize-logos_white.png" alt="logo">
        <div class="create-new" @click="store.createClick = !store.createClick">Create New  +</div>
        <input type="text" placeholder="Search">
        <div class="create-new" @click="store.createView = !store.createView">
          <div class="avatar">{{ store.usr_lett }}</div>
          <p>View</p>
        </div>
    </nav>
  <div class="tocreate" :class="{tocreate2 : store.createClick}">
    <p @click="store.createTask = true, fromPros.createPro = false,
    store.createClick = false, store.createView = false">TASK</p>
    <p @click="fromPros.proModalOpen">PROJECT</p>
    <p @click="store.createClick = false, store.createView = false">TEAM</p>
  </div>
  <div class="tocreate1 tocreate2" v-if="store.createView">
    <p @click="profiles.viewProfile(usrID)">Profile</p>
    <p @click="auth.logout">Logout</p><!--<p @click="logout.toLogOut">Logout</p>-->
    <div class="worselect" @click="wsps.wspsChoose">
      <p>Workspaces</p>
    </div>
    <div >
      <select name="" id="" v-model="wsps.chosenWsID">
        <option v-for="ws in wsps.myWsps" :key="ws.worID"
        :value="ws.worID">{{ ws.workspace }}</option>
      </select>
      <button @click="wsps.newWsps">Choose</button>
    </div>
  </div>
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

  a {
    text-decoration: none;
    color: white;
  }
  a:hover {
    color: rgb(11, 235, 235);
  }

  h4 {
    margin-bottom: 0.5rem;
  }
  h6 {
    text-align: center;
  }
  img {
    width: 4rem;
  }
  nav input {
    width: 40vw;
    border-radius: 40vw;
    text-align: center;
    background-color: black;
    color: white;
    font-size: 1rem;
  }
  nav {
    z-index: 10;
    background-color: black;
    width: 100%;
    height: 11vh;
    border-bottom: 0.0625rem solid gray;
    padding: 0.6rem;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2rem;
    height: 2rem;
    border-radius: 2rem;
    border: 0.0625rem solid white;
  }
  button {
    background-color: #02ad8b;
    color: white;
    border: none;
    border-radius: 1rem;
    padding: 0.13rem;
    width: 6rem;
    margin-top: 0.3rem;
    margin-left: 0.3rem;
  }
  .create-new {
    height: 2rem;
    width: 9rem;
    border-radius: 2rem;
    border: 0.0625rem solid gray;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    z-index: 11;
    background-color: black;
  }
  .create-new:hover {
    cursor: pointer;
    color: rgb(11, 235, 235);
  }
  .tocreate {
    position: absolute;
    top: -30vh;
    left: 14.5vw;
  }
  .tocreate1 {
    position: absolute;
    top: -30vh;
    right: 0.5vw;
  }
  .tocreate p {
    padding: 0.3rem;
    border-bottom: 0.0625rem solid gray;
  }
  .tocreate1 p {
    padding: 0.3rem;
    border-bottom: 0.0625rem solid gray;
  }
  .tocreate p:hover {
    cursor: pointer;
    color: rgb(11, 235, 235);
  }
  .tocreate1 p:hover {
    cursor: pointer;
    color: rgb(11, 235, 235);
  }
  .tocreate2 {
    width: 9rem;
    min-height: 12rem;
    background-color: black;
    color: white;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: stretch;
    z-index: 4;
    animation: fade-down 1s 1 forwards;
  }
  select, option {
    max-width: 95%;
    border-radius: 1rem;
    text-align: center;
  }
</style>
