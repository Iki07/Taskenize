import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index';
import { useProStore } from './projects';
import { useWsStore } from './workspace';
import { useRouter } from 'vue-router';
import { useAuthCheck }  from '../utils/authCheck'
import { useTaskStore } from './tasks'; 

export const useUsersStore = defineStore("users", () => {
    const taskStore = useTaskStore()
    const wsStore = useWsStore()
    const reg_email = /^[a-zA-Z]{3,}[a-zA-Z0-9]*@[a-zA-Z]{4,}\.[a-zA-Z]{2,}$/;
    const sid = localStorage.getItem('sid')
    const myWsps = ref([])

    const createUser = ref(false)
    const createView = ref(false)
    const mandatory = ref(false)
    const regMail = ref(false)
    function openCreateModal() {
        createUser.value = true
        availableWsps()
    }

    const name = ref('')
    const email = ref('')
    const wspId = ref('')
    const temId = ref('')

    function createUserDone() {
        name.value = ''
        email.value = ''
        wspId.value = ''
        temId.value = ''
        roleIds.value = []
        mandatory.value = false
        regMail.value = false
        createUser.value = false
    }

    const roleSel = ref(false)
    const roleIds = ref([])
    function pushRoleId(e) {
        let id = e.target.value
        if(e.target.checked) {
            roleIds.value.push(id)
        }
        else {
            roleIds.value.splice(roleIds.value.indexOf(id), 1)
        } 
        console.log("roles: ", roleIds.value)
    }

    async function availableWsps() {
        try {
            const msg = await api.getAvailableWsps(sid)
            console.log(msg)
            myWsps.value = msg.data.wspsAvailable
        } catch (error) {
            console.log(error)
        }
    }
    async function createNewUser() {
        if(!name.value) {
            mandatory.value = true
            return
        }
        if(!email.value) {
            mandatory.value = true
            return
        }
        if(!reg_email.test(email.value)) {
            regMail.value = true
            return
        }
        if(!wspId.value) {
            mandatory.value = true
            return
        }
        if(!roleIds.value || roleIds.value.length < 1) {
            mandatory.value = true
            return
        }
        const dto = {
            "sid": sid,
            "name": name.value,
            "email": email.value,
            "roleIds": roleIds.value,
            "wspId": wspId.value
        }
        if(temId.value) {
            dto.temId = temId.value
        }
        try {
            const msg = await api.createNewUsr(dto)
            console.log(msg)
        } catch (error) {
            console.log(error)
        } finally {
            createUserDone()
        } 
    }
    const usersToShow = ref([])
    async function getUsers() {
        try {
            const msg = await api.getUsers(sid)
            console.log(msg)
            usersToShow.value = msg.data.usersToShow
        } catch (error) {
            console.log(error)
        }
    }
    return {
        createUser, createView, reg_email, name, email, roleIds,
        wspId, temId, roleSel, myWsps, mandatory, regMail,
        usersToShow,
        pushRoleId, availableWsps, openCreateModal, createNewUser,
        createUserDone, getUsers
    }
})