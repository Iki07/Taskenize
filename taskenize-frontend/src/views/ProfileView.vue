<script setup>
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import { ref, onMounted } from 'vue';
import { useProfiles } from '@/stores/profile';
import api from '@/api';
const route = useRouter()
const sid = localStorage.getItem('sid')
const user = JSON.parse(localStorage.getItem('userData'))
const usrName = user.userName
const profiles = useProfiles()

async function viewSelProfile(id) {
    console.log("profile ID: ",id)
    try {
        const msg = await api.goToProfile(sid, id)
        console.log(msg)
    } catch (error) {
        console.log(error)
    }
}
onMounted(() => {
    viewSelProfile(profiles.selectedId)
})
function backTo() {
    route.push({
        name: 'myAccount'
    })
}
const canUpdate = ref(false)

</script>
<template>
    <Header />
    <div class="main">
        <div class="top">
            <div class="left">
                <div class="name">
                    <h2>{{ usrName }}</h2>
                </div>
                <div class="displayName">
                    <h2>Display Name</h2>
                </div>
                <div class="bio">
                    <h4>Biografy</h4>
                </div>
            </div>
            <div class="right">
                <div class="p-avatar"></div>
                <div class="email">
                    <h2>email@test.com</h2>
                </div>
                <div class="update" v-if="canUpdate">
                    <button>Update Profile</button>
                </div>
                <div>
                    <button @click="backTo">Go back</button>
                </div>
                <div>
                    <button>View your Tasks</button>
                </div>
            </div>
        </div>
        <div>
            <div class="bottom">
                <div class="workspaces">
                    <div class="title">
                        <h2>Workspaces</h2>
                    </div>
                    <div class="list">

                    </div>
                </div>
                <div class="projects">
                    <div class="title">
                        <h2>Projects</h2>
                    </div>
                    <div class="list">
                        
                    </div>
                </div>
                <div class="teams">
                    <div class="title">
                        <h2>Teams</h2>
                    </div>
                    <div class="list">
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.main {
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
}
.left {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 65vw;
}
.right {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 35vw;
}
.right div {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    min-height: 10vh;
}
.left div {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    min-height: 10vh;
}
.bottom {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 0.6rem
}
.bio {
    width: 96%;
    height: 25vh;
    border: solid 0.0625rem #02ad8b;
    margin-left: 1.5rem;
}
.top {
    display: flex;
    padding: 0.6rem;
}
.title {
    border: solid 0.0625rem #02ad8b;
    width: 30vw;
    display: flex;
    justify-content: center;
    align-items: center;
}
.list {
    border: solid 0.0625rem #02ad8b;
    width: 30vw;
    min-height: 25vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
button {
    background-color: #02ad8b;
    color: white;
    border: none;
    font-size: 1rem;
    padding: 0.13rem;
    width: 9rem;
    margin-top: 0.3rem;
    margin-left: 0.3rem;
}
.p-avatar {
    border: solid 0.0625rem #02ad8b;
    width: 9rem;
    height: 3rem;
    border-radius: 0.3rem;
}
</style>