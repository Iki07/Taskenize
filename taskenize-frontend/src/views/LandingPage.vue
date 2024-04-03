<script setup>
import HeaderLanding from '@/components/HeaderLanding.vue';
import FooterLanding from '@/components/FooterLanding.vue';
import { RouterLink } from 'vue-router';
let title = "From planning to performance";
let text = "Taskenize your way";
</script>

<template>
    <div class="landing-page-container">
        <figure>
            <img src="../assets/imgs/landing-photo.jpg" alt="Taskenize">
        </figure>
        <div class="landing-page-content">
                <HeaderLanding />
              
                <div class="landing-page-inner-content">
                    <hgroup>
                        <h1>{{ title }} </h1>
                        <p>{{ text }}</p>
                        <RouterLink to="demo" class="btn">View demo</RouterLink>
                    </hgroup>
                </div> 

                <FooterLanding />
                
            </div>  
        </div>
</template>

<style scoped>
</style>