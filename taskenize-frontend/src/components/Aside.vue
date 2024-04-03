<script setup>
    import api from '@/api';
    import { ref, onMounted, computed } from 'vue';
    import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
    import { useTaskStore } from '../stores/tasks';
    import { useProStore } from '@/stores/projects';
    //import { useWsStore } from '@/stores/workspace';
    const route = useRouter()
    const store = useTaskStore()
    const fromPros = useProStore();
    //const wsps = useWsStore()
    // const wsTitle = computed(() => {
    //   store.myWor.value.app_wor_name
    // }) 
</script>
<template>
    <aside>
      <div class="aside">
        <div class="a-inbox">
          <!--<h4 v-if="wsps.defaultWS"> {{ wsps.defaultWS }}</h4>-->
          <!--<h4 v-if> {{ wsps.myWor }}</h4>-->
          <h3 @click="store.onTasksDiv" :class="{clicked_h : store.myTasksDiv}">My Tasks</h3>
        </div>
        
        <div class="a-projects">
          <h3 @click="store.onProDiv" :class="{clicked_h : store.myProDiv}">My Projects</h3>
        </div>
        <div class="a-team">
          <h3 @click="store.onTeamDiv" :class="{clicked_h : store.myTeamDiv}">Team</h3>
        </div>
        <div class="a-users">
          <h3 @click="store.onUsersDiv" :class="{clicked_h : store.usersDiv}">Users</h3>
        </div>
        <div class="a-reports">
          <h3 @click="store.onReportsDiv" :class="{clicked_h : store.reportsDiv}">Reports</h3>
        </div>
        <div class="a-ws">
          <h3 @click="store.onWsDiv" :class="{clicked_h : store.myWorkspaces}">Workspaces</h3>
        </div>
      </div>
      <!--<div class="line"></div>-->
      <!--<div class="aside">
        <div class="a-inbox">
          <h4 v-if="wsps.defaultWS"> {{ wsps.defaultWS }}</h4>
          -<h4 v-if> {{ wsps.myWor }}</h4>
          <h3 @click="store.onTasksDiv" :class="{clicked_h : store.myTasksDiv}">My Tasks</h3>
        </div>
        
        <div class="a-projects">
          <h3 @click="store.onProDiv" :class="{clicked_h : store.myProDiv}">My Projects</h3>
        </div>
        <div class="a-team">
          <h3 @click="store.onTeamDiv" :class="{clicked_h : store.myTeamDiv}">Team</h3>
        </div>
        <div class="a-users">
          <h3 @click="store.onUsersDiv" :class="{clicked_h : store.usersDiv}">Users</h3>
        </div>
        <div class="a-reports">
          <h3 @click="store.onReportsDiv" :class="{clicked_h : store.reportsDiv}">Reports</h3>
        </div>
        <div class="a-ws">
          <h3 @click="store.onWsDiv" :class="{clicked_h : store.myWorkspaces}">Workspaces</h3>
        </div>
      </div>-->
    </aside>
</template>
<style scoped>
  a {
    text-decoration: none;
    color: white;
  }
  a:hover {
    color: rgb(11, 235, 235);
  }
  aside {
    background-color: black;
    min-height: 100vh;
    width: 15vw;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  aside div h3, h4 {
    padding: 0.9rem;
  }
  aside h3:hover,h4:hover {
    cursor: pointer;
  }

  .aside {
    position: -webkit-sticky;
    position: sticky;
    top:0;
  }
  .clicked_h {
    color: rgb(27, 25, 25);
    background-color: rgb(11, 235, 235);
    width: 100%;
    padding-left: 1.2rem;
  }
  .line {
    width: 70%;
    height: 0.2rem;
    background-color: white;
  }
</style>