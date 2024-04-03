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
    //categories.value = JSON.parse(localStorage.getItem('taskCategories'))
    const categories = JSON.parse(localStorage.getItem('taskCategories')) //ref([])
    const privCat = []
    const temCat = []
    const proCat = []
    for(let c of categories) {
      if(c.tsk_type === 1) {
        privCat.push(c)
      } else if(c.tsk_type === 2) {
        proCat.push(c)
      } else if(c.tsk_type === 3) {
        temCat.push(c)
      }
    }
    const teams = store.usr_teams
    const pros = store.usr_pros

    const users = ref([])
    async function usersToAssign() {
      const dto = {
        "sid": store.sid,
        "userId": store.usrID,
        "projectId": store.pro_id,
        "teamId": store.tem_id
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
    // IZBOR TIMA I PRO IZ TASKA
    function temSelect() {
      store.pro_id = null
      console.log(store.tem_id)
      store.tmSL = true
      store.proSL = false
      usersToAssign()
    }
    function proSelect() {
      store.tem_id = null
      store.proSL = true
      store.tmSL = false
      console.log(store.pro_id)
      usersToAssign()
    }
    
</script>
<template>
    <div class="holder" v-if="store.createTask || fromPros.createPro"></div>
    <div class="creteTask" v-if="store.createTask">
    <div class="fields">
      <div class="left_fields">
        <h3 :class="{blocked : !store.titleError}, {errorField : store.titleError}">Task name mast be filled</h3>
        <div class="field">
          <input type="text" :class="{errorField : store.titleError}" placeholder="Task Name" 
          v-model="store.taskName">
        </div>
        
        <div class="field">
          <textarea type="text" placeholder="Description" v-model="store.taskDescription"></textarea>
        </div>
        <div class="field" id="deadline">
          <label for="">Deadline:</label>
          <input type="date" v-model="store.taskDue">
        </div>
        <div class="field fieldup">
          <input type="number" placeholder="Time Planned" v-model="store.pTime">
          <input type="number" placeholder="Time Spent" v-model="store.rTime">
        </div>
        <div class="field">
          <input type="file" @input="store.getFile">
        </div>
        <div class="field">
          <textarea placeholder="Add your comment" v-model="store.taskComm"></textarea>
        </div>
      </div>
      <div class="right_fields">
        <div class="field">
          <select name="" id="" v-model="store.tStatus">
            <option value="1" selected>Created</option>
            <option value="2">In progress</option>
            <option value="3">Completed</option>
          </select>
        </div>
        <div class="field">
          <input type="checkbox" id="check" @change="store.importance">
          <p>Flag as Important</p>
        </div>
        <div class="field"></div>
        <div class="field lab">
          <label >Select Task Type</label>
          <select name="" id="" v-model="store.tType" >
            <option value="1" selected>Private</option>
            <option value="2" :disabled="!store.isPM">Project Task</option>
            <option value="3" :disabled="!store.isTM">Team Task</option>
          </select>
        </div>
        <div class="field lab">
          <label>Select category</label>
          <select name="" id="" v-model="store.tCategory">
            <option value="" selected >Category</option>
            <option v-if="store.tType == 1" v-for="cat in privCat" 
            :key="cat.cat_id" :value="cat.cat_id" >{{ cat.cat_name }}</option>
            <option v-if="store.tType == 2" v-for="cat in proCat" 
            :key="cat.cat_id" :value="cat.cat_id" >{{ cat.cat_name }}</option>
            <option v-if="store.tType == 3" v-for="cat in temCat" 
            :key="cat.cat_id" :value="cat.cat_id" >{{ cat.cat_name }}</option>
          </select>
        </div>
        <div class="field lab">
          <label v-if="store.tType == 2 ">Select Project</label>
          <label v-if="store.tType == 3">Select Team</label>
          <select v-model="store.tem_id" v-if="store.tType == 3" @change="temSelect">
            <option v-for="t in teams" :key="t.tem_id" :value="t.tem_id">{{ t.tem_name }}</option>
          </select>
          <select v-model="store.pro_id" v-if="store.tType == 2" @change="proSelect">
            <option v-for="p in pros" :value="p.prj_id" selected>{{ p.prj_name }}</option>
          </select>
        </div>
        
        <div class="field lab">
          <label v-if="store.tmSL || store.proSL">Assign to</label>
          <select v-model="store.tAssign" v-if="store.tmSL && store.tType != 1">
            <option value="" >Assign to</option>
            <option v-for="u in users" :key="u.usr_id"
            :value="u.usr_id" >{{ u.usr_name }}</option>
          </select>
          <select v-model="store.tAssign" 
          v-if="store.proSL && store.tType != 1"
          @change="store.getWspToSelect">
          <option value="" >Assign to</option>
            <option v-for="u in users" :key="u.usr_id"
            :value="u.usr_id" >{{ u.usr_name }}</option>
          </select>
        </div>
        <div class="field" >
          <select v-model="store.tReassign" v-if="store.role == 'admin'">
            <option value="" selected>Reassign</option>
          </select>
        </div>
        <div class="field lab" v-if="store.wspToSelect.length > 1">
          <label>Select Workspace</label>
          <select v-model="store.selWsp" >
            <option v-for="w in store.wspToSelect" :value="w.wsp_id" selected>
            {{ w.wsp_name }}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="buttonsDiv">
      <button @click="store.addTask">Create</button>
      <h2 :class="{blocked : !store.titleError}, {errorField : store.titleError}">Task name mast be filled</h2>
      <button @click="store.createTaskDone">Cancel</button>
    </div>
  </div>
  <!--Projects-->
  <div class="createPro" v-if="fromPros.createPro">
    <div class="fields">
      <div class="left_fields">
        <h3 v-if="store.titleError">This field is mandatory</h3>
        <div class="field">
          <input type="text" :class="{errorField : store.titleError}" placeholder="Project Name" v-model="fromPros.proName">
        </div>
        <div class="field">
          <textarea placeholder="Description" v-model="fromPros.proDesc"></textarea>
        </div>
        <div class="field fieldup">
          <input type="date" v-model="fromPros.proPlanBegin">
          <input type="date" v-model="fromPros.proRealBegin">
        </div>
        <div class="field fieldup">
          <input type="date" v-model="fromPros.proPlanFin">
          <input type="date" v-model="fromPros.proRealFin">
        </div>
        <div class="field"></div>
        <div class="field"></div>
        <div class="field lab">
          <label>Upload file:</label>
          <input type="file" @input="fromPros.getFile">
        </div>
      </div>
      <div class="right_fields">
        <div class="field lab">
          <label>Upload Avatar</label>
          <input type="file" @input="fromPros.getAvatar">
        </div>
        <div class="field">
          <select name="" id="" v-model="fromPros.proStatus">
            <option value="1">Created</option>
            <option value="2">In progress</option>
            <option value="3">Completed</option>
          </select>
        </div>
        <div class="field lab">
          <label >Select Workspace</label>
          <div v-if="fromPros.wsps_add.length > 0">
            <h3>Who is added:</h3>
            <h4 v-for="n in fromPros.wsps_add">
              {{ n.name }} <span class="remove"
              @click="fromPros.removeWsp(n.id)">X</span>
            </h4>
          </div>
          <button class="multiBtn" @click="fromPros.prowspSel = true">Select WS</button>
          <div class="multi" v-if="fromPros.prowspSel">
            
            <div v-for="ws in fromPros.myWsps"
            :key="ws.wsp_id" >
              <div class="check">
                <input type="checkbox" :id="ws.wsp_id" 
                :value="ws.wsp_name"
                @click="fromPros.pushWs">
                <p > {{ ws.wsp_name }}</p>
              </div>
            </div>
            <button class="multiBtn" @click="fromPros.sendWspIds">Done</button>
          </div>
        </div>
        <div class="field popup" v-if="fromPros.selectWsError">
          <h4>Please Select Workspace</h4>
          <button @click="fromPros.selectWsError = false">OK</button>
        </div>
        <div class="field lab">
          <label>Assign PM</label>
          <select v-model="fromPros.proPM">
            <option v-for="pm in fromPros.PMforAssign"
            :value="pm.usr_id">{{ pm.usr_name }}</option>
          </select>
        </div>
        <div class="field"></div>
        
        <div class="field lab">
          <label>Select Project Team</label>
          <div v-if="fromPros.usrs_ids.length > 0">
            <h3>Who is added:</h3>
            <h4 v-for="n in fromPros.usrs_ids">
              {{ n.name }} <span class="remove"
              @click="fromPros.removeUsr(n.id)">X</span>
            </h4>
          </div>
          <button class="multiBtn" @click="fromPros.proTmSel = true">Select TM</button>
          <div class="multi" v-if="fromPros.proTmSel">
            <div v-for="user in fromPros.userToAssign"
            :key="user.usr_id" >
              <div class="check">
                <input type="checkbox" :id="user.usr_id" 
                :value="user.usr_name"
                @click="fromPros.pushId">
                <p > {{ user.usr_name }}</p>
              </div>
            </div>
            <button class="multiBtn" @click="fromPros.sendUsrIds">Done</button>
          </div>
        </div>
      </div>
    </div>
    <div class="msg"
        v-if="fromPros.nw_pro_name"><h3>{{ fromPros.success }}</h3></div>
    <div class="buttonsDiv">
        <button @click="fromPros.addPro">Create</button>
        
        <button @click="fromPros.createProDone">Cancel</button>
    </div>
  </div>
</template>
<style scoped>
 .creteTask, .createPro {
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
  
  
  .createPro input, select, button {
    border-radius: 2rem;
    text-align: center;
    font-size: 1rem;
    height: 2rem;
    width: 76%;
  }
  
  .creteTask input, select, textarea {
    border-radius: 2rem;
    text-align: center;
    font-size: 1rem;
    width: 76%;
    height: 1.7rem;
  }
  #check {
    width: 2rem;
  }
  #deadline {
    max-width: 75%;
    padding: 0.1rem;
  }
  .fieldup input {
    width: 36%;
  }
  textarea {
    border-radius: 0.6rem;
    text-align: center;
    font-size: 1rem;
    min-height: 3.3rem;
  } 
  .creteTask button:first-of-type {
    background-color: rgb(68, 153, 68);
    color: white;
    border: none;
    font-size: 1rem;
    padding: 0.3rem;
  }
  .createPro button:first-of-type {
    background-color: rgb(68, 153, 68);
    color: white;
    border: none;
    font-size: 1rem;
    padding: 0.3rem;
  }
  .creteTask button:last-of-type {
    background-color: rgb(11, 235, 235);
    color: black;
    border: none;
    margin-right: 5rem;
    padding: 0.3rem;
  }
  .createPro button:last-of-type {
    background-color: rgb(11, 235, 235);
    color: black;
    border: none;
    margin-right: 5rem;
    padding: 0.3rem;
  }
  .creteTask p {
    color: white;
  }
  .fields {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
  }
  .left_fields, .right_fields {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .field {
    display: flex;
    max-width: 93%;
    gap: 1rem;
    min-width: 9rem;
    min-height: 0.6rem;
  }
  .lab {
    flex-direction: column;
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
  .status {
    display: flex;
    justify-content: space-evenly;
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
  .buttonsDiv {
    display: flex;
    justify-content: space-between;
    padding: 0.3rem;
    width: 100%;
  }
  button {
    max-width: 7rem;
  }
  .errorField {
  display: block;
  
  border: solid 0.15rem red;
  }
  .blocked {
  display: none;
  background-color: red;
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
  .popup {
    display: flex;
    flex-direction: column;
    background-color: rgb(216, 211, 211);
    color: crimson;
  }
  .popup button {
    background-color: crimson;
  }
  .remove {
    border: solid 0.0625rem;
    border-radius: 50%;
    cursor: pointer;
  }
  .msg {
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid 0.0625rem white;
    padding: 1rem;
    min-width: 2rem;
    max-width: 70vw;
  }
</style>