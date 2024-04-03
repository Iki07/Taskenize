import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index';
import { useTaskStore } from './tasks';
import { useProStore } from './projects';
import { useRouter } from 'vue-router';

export const useWsStore = defineStore('wsps', () => {
    const route = useRouter()
    const store = useTaskStore();
    const fromPros = useProStore()

    const user = JSON.parse(localStorage.getItem('userData'))
    const sid = localStorage.getItem('sid')
    const usrRolWsps = user.userAuthData //podaci user-a
    const usrID = user.userID
    const defaultWS = ref('')
    const defaultWorID = ref('')
    const currentWspID = ref('')
    let wspArr = []
    for(let ws of usrRolWsps) {
        wspArr.push(ws.wsp_id)
    }
    //console.log("wspAr", wspArr)
    const goWsID = ref(null)
    const wsCreate = ref(false)
    const wsName = ref('')
    const wsDesc = ref('')
    const slAdmin = ref('')
    //const usrID = store.usrID
    function wscrtDone() {
        wsName.value = ''
        wsDesc.value = ''
        slAdmin.value = ''
        wsCreate.value = false
    }
    const formData = new FormData()
    function getFile(e) {
        const file = e.target.files[0]
        console.log(file)
        formData.set("avatar", file);
    }
    async function createWs() {
        formData.set("sid", sid)
        if(wsName.value) {
            formData.set("name", wsName.value)
        }
        if(wsDesc.value) {
            formData.set("description", wsDesc.value)
        }
        try {
            const msg = await api.addWsps(formData)
            console.log(msg)
        } catch(error) {
            console.log(error)
        } finally {
            formData.delete("sid")
            formData.delete("name")
            formData.delete("description")
            formData.delete("avatar")
            wscrtDone()
            store.onWsDiv()
        }
    }

    const myWsps = ref([])
    const wspsUserAdministrates = ref([])
    const wspsAssigned = ref([])
    const msgAdmin = ref('')
    //const msgUser = ref('')
    const assRoles = ref('')

    async function allWsps() {
        try {
            const msg = await api.getMyWsps(store.sid)
            console.log(msg)
            myWsps.value = msg.data.myWsps
            wspsUserAdministrates.value = msg.data.wspsUserAdministrates
            wspsAssigned.value = msg.data.wspsAssigned
            msgAdmin.value = msg.data.msg
            assRoles.value = msg.data.wspsAssigned[0].roles 
            
            let splitRoles = assRoles.value.split(',')
            assRoles.value = splitRoles
            console.log(msgAdmin.value)
        } catch (error) {
            console.log(error)
        }
    }

    const wspsSelect = ref(false)
    const chosenWsID = ref(false)
    const myWor = ref(false)
    //const chosenWsName = ref('') 

    function wspsChoose() {
      wspsSelect.value = !wspsSelect.value
      allWsps()
    }
    async function newWsps() {
      try {
        const msg = await api.selectOneWs(chosenWsID.value, sid)
        myWor.value = msg.data.myWs[0].wsp_name
        console.log(myWor.value)
        if(defaultWS.value) {
            defaultWS.value = false
        }
        //fromPros.myWor.value = msg.data.myWs[0]
        //localStorage.setItem("current_worID", msg.data.myWs[0].app_wor_id)
        //console.log(fromPros.myWor.value.app_wor_id)
        //console.log(fromPros.worID.value)
      } catch(error) {
        console.log(error)
      } finally {
        wspsSelect.value = false
        fromPros.allPro()
      }
    }

    function goWs(id) {
        goWsID.value = id
        console.log(goWsID.value)
        route.push({name: "workspace"})
    }

    const adminSel = ref(false)
    const selectedIds = ref('')
    const errorMsg = ref('')
    let usrs_ids = [] // const usrs_ids = ref([])
    function pushId(e) {
        let id = e.target.value
        if(e.target.checked) {
        usrs_ids.push(id)
        }
        else {
        usrs_ids.splice(usrs_ids.indexOf(id), 1)
        } 
    }
    function sendUsrIds() {
        let arr = []
        for(let u of usrs_ids) { // value
        arr.push(u) 
        }
        if(arr.length < 1) {
            errorMsg.value = "At least one admin must be added!"
            return
        }
        selectedIds.value = arr.join(",")
        console.log("iz stora: ", selectedIds.value)
        //fromPros.(fromPros.proTeam.value)
        adminSel.value = false
        usrs_ids = []
    } 

    return {
        wsCreate, wsName, wsDesc, slAdmin, usrID, myWsps, wspsSelect,
        chosenWsID, defaultWS, defaultWorID, myWor,wspsUserAdministrates,
        wspsAssigned, assRoles, goWsID, adminSel, selectedIds,
        errorMsg,
        createWs, wscrtDone, allWsps, wspsChoose, newWsps, goWs,
        getFile, pushId, sendUsrIds
    }
}) 
/**
 * msgUser,
 */