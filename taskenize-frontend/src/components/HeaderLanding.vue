<script setup>
import { RouterLink, useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
    <div class="header">
        <div class="wrapper">
            <RouterLink to="/" class="logo"><img src="../assets/imgs/logo.png" alt="Taskenize"></RouterLink>
            <nav class="nav">
                <RouterLink v-if="route.name!=='register'" to="register" class="link">Register</RouterLink>
                <RouterLink v-if="route.name !== 'login'" to="login" class="link">Login</RouterLink>
            </nav>
        </div>
    </div>
</template>

<style scoped>
    .header {
        padding: 20px 60px 10px;
    }
    .wrapper {
        display: flex; 
        justify-content: space-between; 
        align-items: center;
    }
    .header .logo img {
        display: block;
        max-height: 120px; 
        width: auto;
    }
    .nav {
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        gap: 40px;
        list-style: none;
    }
    .link {
        font-size: 14px; 
        font-weight: 400; 
        text-transform: uppercase; 
        letter-spacing: 1px;
        display: block; 
        position: relative;
        text-decoration: none;
        color: var(--color-dark);
        transition: all 0.2s ease-in-out;
    }
    .link:hover {
        color: var(--color-primary);
    }
    .link:before {
        content: ''; 
        position: absolute; 
        left: -20px; 
        top: 0;
        width: 1px; height: 100%;
        background-color: rgba(0,0,0,0.1);
    }
    .link:first-child::before {
        display: none;
    }

    @media (max-width: 1024px) {
        .header {
            padding: 20px 30px;
            background-color: white;
        }
        .header .logo img {
            max-height: 80px;
        }
    }
</style>