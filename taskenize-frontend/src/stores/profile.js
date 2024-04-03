import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index';
import { useProStore } from './projects';
import { useWsStore } from './workspace';
import { useRouter } from 'vue-router';
import { useAuthCheck }  from '../utils/authCheck'
import { useTaskStore } from './tasks'; 

export const useProfiles = defineStore('profile', () => {
    const user = JSON.parse(localStorage.getItem('userData'))
    const usrName = user.userName
    const sid = localStorage.getItem('sid')
    const route = useRouter()
    const selectedId = ref('')
    function viewProfile(id) {
      selectedId.value = id
      route.push({
        name: 'profile'
      })
    }


    return {
        selectedId,
        viewProfile
    }
})