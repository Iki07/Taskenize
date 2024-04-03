import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index';
import { useProStore } from './projects';
import { useWsStore } from './workspace';
import { useUsersStore } from './users';
import { useRouter } from 'vue-router';
import { useAuthCheck }  from '../utils/authCheck'

export const useTaskStore = defineStore('tasks', () => {
  const route = useRouter()
  const fromPros = useProStore()
  const usersStore = useUsersStore()
  const wsps = useWsStore()
    const user = JSON.parse(localStorage.getItem('userData'))
    const sid = localStorage.getItem('sid')
    const usr_data = user.userAuthData //podaci user-a
    const currentWsps = ref(usr_data.workspace)
    const usrName = user.userName
    //const role = usr_data.role[0].role
    const usr_lett = usrName.split('')[0]
    const usrID = user.userId
    let worID = usr_data[0].wsp_id
    let wsp_ids = []
    const wspToSelect = ref([])
    for(let u of usr_data) {
      wsp_ids.push(u.wsp_id)
    }
    wsp_ids = wsp_ids.filter((val, ind, arr) => {
      return arr.indexOf(val) === ind
    })
    const usr_teams = user.teamsManaged
    const usr_pros = user.projecsManaged
    //const tmID = ref(0)
    //let proID = 0
    const check = useAuthCheck()
    const isTM = check.isTM(wsp_ids, usr_data)
    const isPM = check.isPM(wsp_ids, usr_data)
    //const { isPM } = useAuthCheck()
   // const myWor = ref([])

    const createClick = ref(false)
    const createView = ref(false)

    const myTasksDiv = ref(true)
    const myProDiv = ref(false)
    const myTeamDiv = ref(false)
    const usersDiv = ref(false)
    const reportsDiv = ref(false)
    const myWorkspaces = ref(false)
    //================PRIKAZ SVIH TASKOVA===============//
    function onTasksDiv() { // UKLJUČUJE TASK COMP, A ISKLJUČUJE DRUGE
        myTasksDiv.value = true
        myProDiv.value = false
        myTeamDiv.value = false
        usersDiv.value = false
        reportsDiv.value = false
        myWorkspaces.value = false
        // console.log(
        //   //check.isTM(wsp_ids, usr_data)
        //   isTM + "\n" +
        //   "wspID: " + worID
        // )
        allMyTasks() //POVLAČI SVE TASKOVE IZ BAZE
        //console.log(role)       
    }
    //================PRIKAZ SVIH PROJEKATA===============//
    function onProDiv() { //UKLJUČUJE PROJECT.VUE COMPONENT A ISKLJUČUJE OSTALE
        myTasksDiv.value = false
        myProDiv.value = true
        myTeamDiv.value = false
        usersDiv.value = false
        reportsDiv.value = false
        myWorkspaces.value = false
        fromPros.allPro() //POVLAČI SVE PRO
    }
    //================PRIKAZ SVIH TIMOVA===============//
    function onTeamDiv() {
        myTasksDiv.value = false
        myProDiv.value = false
        myTeamDiv.value = true 
        usersDiv.value = false
        reportsDiv.value = false
        myWorkspaces.value = false
    }
    //================PRIKAZ SVIH USERSA===============//
    function onUsersDiv() {
      myTasksDiv.value = false
      myProDiv.value = false
      myTeamDiv.value = false 
      usersDiv.value = true
      reportsDiv.value = false
      myWorkspaces.value = false
      usersStore.getUsers()
    }
    //================PRIKAZ SVIH REPORTSA===============//
    function onReportsDiv() {
      myTasksDiv.value = false
      myProDiv.value = false
      myTeamDiv.value = false 
      usersDiv.value = false
      reportsDiv.value = true
      myWorkspaces.value = false
    }
    //================PRIKAZ SVIH WORKSPACES===============//
    function onWsDiv() {
      myTasksDiv.value = false
      myProDiv.value = false
      myTeamDiv.value = false 
      usersDiv.value = false
      reportsDiv.value = false
      myWorkspaces.value = true
      wsps.allWsps()
    }
    const idForDelete = ref(null)
    const isCanceled = ref(false)
    const tmSL = ref(false)
    const proSL = ref(false)

    const tasks = ref([]) //ovde smeštamo taskove dobijene func
    const oneTask = ref([]) //smeštamo 1 (selekt) task - za pregled
    const oneTaskComment = ref([]) // komente vezane za "oneTask"
    const goTskID = ref('') // ID taska koji želimo pregledati
    const proTasks = ref([])
    const tmTasks = ref([])
    const taskOverview = ref(false)
    const createTask = ref(false)

    const taskFormData = new FormData()
    const selWsp = ref(null)
    const taskName = ref('')
    const taskDescription = ref('')
    const taskDue = ref('')
    const pTime = ref('')
    const rTime = ref('')
    const taskComm = ref('')
    //const tPrior = ref('')
    const tStatus = ref(1)
    const tFlag = ref('')
    const tType = ref(1)
    const tCategory = ref('')
    const tAssign = ref('')
    const tReassign = ref('')
    const tem_id = ref(null)
    const pro_id = ref(null)

    function createTaskDone() { // čistimo formu 
        createTask.value = !createTask.value 
        taskName.value = ''
        taskDescription.value = ''
        taskDue.value = ''
        pTime.value = ''
        rTime.value = ''
        taskComm.value = ''
        //tPrior.value = ''
        tStatus.value = ''
        tFlag.value = ''
        tType.value = ''
        tCategory.value = ''
        tAssign.value = ''
        tReassign.value = ''
        selWsp.value = ''
        tem_id.value = null
        pro_id.value = null
        tmSL.value = false
        proSL.value = false
        titleError.value = false
        wspToSelect.value = []
      }

      const tabTyp = ref(false)
      const tabTM = ref(false)
      const tabPro = ref(false)
      const tabWor = ref(false)

      const tabTyp2 = ref(false)
      const tabTM2 = ref(false)
      const tabPro2 = ref(false)
      const tabWor2 = ref(false)

      async function allMyTasks() {
        try {
          const msg = await api.getMyTasks(sid, usrID)
          console.log(msg)
          tasks.value = msg.data.allTasks 
          proTasks.value = msg.data.allProjectTasks
          tmTasks.value = msg.data.allTeamTasks
          let typ = 0
          let tm = 0
          let pro = 0
          let wor = 0
          for(let t of tasks.value) {
            if(t.ProjectID) {
              pro++
            }
            if(t.TeamID) {
              tm++
            }
            if(t.TaskTypeID) {
              typ++
            }
            if(t.WorkspaceID) {
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
          //ovde za pro:
          let typ2 = 0
          let tm2 = 0
          let pro2 = 0
          let wor2 = 0
          for(let t of proTasks.value) {
            if(t.ProjectID) {
              pro2++
            }
            if(t.TeamID) {
              tm2++
            }
            if(t.TaskTypeID) {
              typ2++
            }
            if(t.WorkspaceID) {
              wor2++
            }
          }
          if(typ2 > 0) {
            tabTyp2.value = true
          }
          if(tm2 > 0) {
            tabTM2.value = true
          }
          if(pro2 > 0) {
            tabPro2.value = true
          }
          if(wor2 > 0) {
            tabWor2.value = true
          }
        } catch (error) {
          console.log(error)
        }
      }
      //Povlači PRO-Private WSP

      async function getWspToSelect() {
        const dto = {
          "sid": sid,
          "assignTo": tAssign.value,
          "projectId": pro_id.value
        }
        try {
          const msg = await api.getWspsToAssign(dto)
          console.log(msg)
          wspToSelect.value = msg.data.availableWsps
          console.log(wspToSelect.value)
        } catch (error) {
          console.log(error)
        }
      }


      //=======================PROMENA IZ TRUE u 1============//
      function importance(e) {
        //let imp;
        if(e.target.checked === true) {
          tFlag.value = 1
        } else {
          tFlag.value = 0
        }
        console.log(tFlag.value)
      }
      //kupimo fajl i guramo u FD
      function getFile(e) {
        const file = e.target.files[0]
        console.log(file)
        taskFormData.set("attach", file);
      }
      const titleError = ref(false)
      async function addTask() {
        if(!taskName.value) {
          titleError.value = true
          return
        }
        console.log(tCategory.value)
        // console.log(tAssign.value)
        // console.log(selWsp.value)
        try {
          taskFormData.set("sid", sid)
          taskFormData.set("title", taskName.value)
          taskFormData.set("userId", usrID)
          if(selWsp.value) {
            taskFormData.set("selectedWsp", Number(selWsp.value))
          }
          taskFormData.set("currentWsp", Number(worID))
          if(pro_id.value) {
            taskFormData.set("projectId", Number(pro_id.value))
          }
          if(tem_id.value) {
            taskFormData.set("teamId", Number(tem_id.value))
          }
          if(taskDescription.value) {
            taskFormData.set("description", taskDescription.value)
          }
          if(tType.value) {
            taskFormData.set("taskType", Number(tType.value))
          }
          taskFormData.set("dueDate", taskDue.value)
          taskFormData.set("status", tStatus.value)
          if(pTime.value) {
            taskFormData.set("timePlanned", Number(pTime.value))
          }
          if(rTime.value) {
            taskFormData.set("timeSpent", Number(rTime.value))
          }
          //taskFormData.set("taskPrior", tPrior.value) //???
          taskFormData.set("comment", taskComm.value)
          if(tCategory.value) {
            taskFormData.set("categoryId", Number(tCategory.value))
          }
          if(tAssign.value) {
            taskFormData.set("assignTo", Number(tAssign.value))
          }
          if(tReassign.value) {
            taskFormData.set("taskReassign", Number(tReassign.value))
          }
           //???
          taskFormData.set("importance", tFlag.value)
          //Ubaci selWsp = param("selectedWsp")
          const msg = await api.createTask(taskFormData)
          console.log(msg)
          
        } catch (error) {
          console.log(error)
        } finally {
          createTaskDone()
          onTasksDiv()
          taskFormData.delete("atach")
          taskFormData.delete("importance")
          taskFormData.delete("project_id")
          taskFormData.delete("team_id")
          taskFormData.delete("selectedWsp")
          taskFormData.delete("assignTo")
          taskFormData.delete("categoryId")
          taskFormData.delete("timeSpent")
          taskFormData.delete("timePlanned")
          taskFormData.delete("taskType")
          taskFormData.delete("description")
        } 
      }
      //================PREGLED ODREĐENOG TASKA===============//
      function goTask(id) {
        goTskID.value = id
        route.push({name: "taskSingle"})
      }
      //OVO JE IZMEŠTENO U TASKVIEW
      async function goToTask(id) {
        try {
          const msg = await api.goToTask(id)
          //console.log(msg)
          oneTask.value = msg.data.taskSelected
          //console.log(msg.data.comment)
          oneTaskComment.value = msg.data.comment
          
          taskOverview.value = true
        } catch (error) {
          console.log(error)
        }
      }
      /**
       *          UPDATE
       */ //   TAKOĐE U TASKVIEW
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
      // U SLUČAJU DA ŽELIMO DA UPOZORIMO KORISNIKA
      function deleteTask(id) {
        isCanceled.value = true
        idForDelete.value = id
      }
      function cancelDelete() {
        isCanceled.value = false
      }
      //================BRISANJE ODREĐENOG TASKA===============//
      async function confirmDelete(id) {
        try {
          const msg = await api.deleteMyTask(sid, Number(id))
          console.log(msg)
          onTasksDiv()
        } catch (error) {
          console.log(error)
        } finally {
          isCanceled.value = false
          route.push({
            name: "myAccount"
          })
        }
      }

  return { taskFormData, taskName, taskDescription, taskDue, pTime, rTime,
    taskComm, tStatus, tFlag, tType, tCategory, tAssign, tReassign,
    createTaskDone, allMyTasks, getFile, addTask, goToTask, statusChanged,
    confirmDelete, tasks, tabTyp, tabPro, tabTM, tabWor, createTask, onTasksDiv,
    onProDiv, onTeamDiv, goTask, onUsersDiv, onReportsDiv, onWsDiv,
    myTasksDiv, myProDiv, myTeamDiv, isCanceled, oneTask, oneTaskComment,
    taskOverview, usrID, worID, usr_lett, createClick, createView,
    usr_data, goTskID, usersDiv, reportsDiv, myWorkspaces, currentWsps,
    usrName, wsp_ids, check, isTM, tem_id, pro_id, isPM, wspToSelect,
    usr_teams, usr_pros, tmSL, proSL, selWsp, importance, getWspToSelect,
    deleteTask, cancelDelete, idForDelete, isCanceled, titleError,
    sid, proTasks, tmTasks, tabTyp2, tabPro2, tabTM2, tabWor2 }
}) //tPrior