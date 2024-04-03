<script setup>
import HeaderLanding from '@/components/HeaderLanding.vue';
import FooterLanding from '@/components/FooterLanding.vue';
import { RouterLink, useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const title = ref('');
const text = ref('');
const showButton = ref(false);

onMounted(async () => {
    const route = useRoute();
    const token = route.query.token;

    if (token) {
        const authStore = useAuthStore();
        try {
            const response = await authStore.verify(token, "register");
            if (response && response.status === 200) {
                console.log(response.message);
                title.value = "Registration confirmation";
                text.value = "Congratulations! You have succesfully completed your registration.";
                showButton.value = true;
            } /*else {
                console.log(response.message);
                title.value = "Registration failure";
                text.value = "Sorry, your attempt to register to Taskenize has failed.";
                showButton.value = false;
            }*/
        } catch (error) {
            console.error('Error in onSubmit:', error);
            title.value = "Registration confirmation failure";
            text.value = "Sorry, your attempt to register to Taskenize has failed.";
            showButton.value = false;
        }
    }
});

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
                    <RouterLink v-if="showButton" to="login" class="btn">Continue</RouterLink>
                    <RouterLink v-if="!showButton" to="register" class="btn">Try again</RouterLink>
                </hgroup>
            </div>

            <FooterLanding />

        </div>
    </div>
</template>

<style scoped>
</style>