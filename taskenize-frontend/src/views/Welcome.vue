<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <div>
        <h1>Welcome to Taskenize</h1>
        <p>What would you like to do next:</p>
        <ul>
            <li>add task?</li>
            <li> update profile?</li>
            <li>change WS name?</li>
            <RouterLink to="test" class="link">Test Page</RouterLink>
        </ul>
    </div>
</template>

<style scoped></style>