<script setup>
import { RouterView, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
//import Header from './components/Header.vue';
import { userAutoLogout } from './utils/autoLogout';

const authStore = useAuthStore();
/*console.log ("sessionId je: ", authStore.sessionId);
if(authStore.sessionId) {userAutoLogout()};*/
userAutoLogout();
</script>

<template><!--
  <div class="test" v-if="!sessionId">
    <h3>You have been logged out. If you want to continue with your work, please login again.
      <RouterLink to="login" class="link">Login</RouterLink>
      </h3>
  </div>
  -->
  <RouterView />

</template>

<style scoped>
.test {
  padding: 10px;
  text-align: center;
}
</style>
