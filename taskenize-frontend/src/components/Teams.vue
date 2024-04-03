<script setup>
import api from '@/api';
import { ref, onMounted, computed } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { useTaskStore } from '../stores/tasks';
import { useProStore } from '@/stores/projects';
const route = useRouter()
const store = useTaskStore()
const fromPros = useProStore();
</script>
<template>
    <section>
        <div class="section" v-if="store.myTeamDiv">
            <h1>Teams</h1>
        </div>
    </section>
</template>
<style scoped>
section {
    width: 78vw;
    padding: 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  section button {
    background-color: #02ad8b;
    color: white;
    border: none;
    padding: 0.3rem;
    width: 5rem;
  }
  .section {
    padding: 0.3rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>