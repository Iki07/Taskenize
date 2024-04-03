import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/api/index";
import router from "@/router/index";

export const useAuthStore = defineStore ('auth', () => {
    //const isLoggedIn = ref(false);
    const sessionId = ref("");
    const user = ref({});

    async function register(user) {
        try {
            const response = await api.registerUser(user);
            console.log('API Response:', response); 
            return response; // Vraćamo odgovor
        } catch (error) {
            console.error('API Error:', error);
            throw error; // Bacamo grešku dalje
        }
    };

    /*async function createUser(email) {
        try {
            const response = await api.createUser(email);
            console.log('API Response:', response); 
            return response; // Vraćamo odgovor
        } catch (error) {
            console.error('API Error:', error);
            throw error; // Bacamo grešku dalje
        }
    };*/

    async function login (user) {
        const response = await api.loginUser(user);
        user.value = response.data.userData;
        let taskCategories = response.data.taskCategories;
        console.log("user iz authStore-a", user.value);
        sessionId.value = response.data.sid;
        console.log("new SessionId ", sessionId.value);
        localStorage.setItem('sid', sessionId.value);
        localStorage.setItem('userData', JSON.stringify(user.value));
        localStorage.setItem('taskCategories', JSON.stringify(taskCategories));
        //isLoggedIn.value = true;
        //dodaj potrebno preusmeravanje ovde, za sada neka ide Welcome
        router.push({
            name: "myAccount"
        });
    }

    //async function verify(token) {
    async function verify(token, reg=null) {
        try {
           //const response = await api.verifyToken(token);
            const response = await api.verifyToken(token, reg);
            console.log('API Response:', response); 
            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error; // Bacamo grešku dalje
        }
    }

    async function resetPass(email) {
        try {
            const response = await api.resetPasswordRequest(email);
            console.log('API Response:', response); 
            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error; // Bacamo grešku dalje
        }
    }
    
    async function changePass(user) {
        try {
            const response = await api.changePassword(user);
            console.log('API Response:', response); 
            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error; // Bacamo grešku dalje
        }
    }

    async function updateLS(sid) {
        try {
            const response = await api.fetchUserInfo(sid);
            localStorage.setItem('userData', JSON.stringify(response.data.userData))
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    async function logout() {
        user.value = null;
        sessionId.value = null;
        localStorage.removeItem('sid');
        localStorage.removeItem('userData');
        localStorage.removeItem('taskCategories');
        await router.push("/login");
    }

    return {
        sessionId,
        register,
        //createUser,
        login,
        verify,
        //isLoggedIn,//pretpostavka da ce nam trebati kasnije, mada to moze da resi i sid...neka ga za sad
        resetPass,
        changePass,
        logout,
        updateLS
    }
})