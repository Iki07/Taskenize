<script setup>
import HeaderLanding from '@/components/HeaderLanding.vue';
import FooterLanding from '@/components/FooterLanding.vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';
import { useErrorHandling } from '@/utils/errorHandling';

let title = "Reset your password";
let text = "Please enter your mail below in order to reset your password."
let email = ref('');

const msg = ref('');
const resetSent= ref(false);
const { getErrorMessage } = useErrorHandling();

async function onSubmit() {
    console.log("onsubmit je okinut");
    const authStore = useAuthStore();
    try {
        const response = await authStore.resetPass(email.value);
        if (response && response.status === 200) {
            //poruka korisniku da proveri email
            //router.push('/login');
            console.log("status 200 ", response);
            msg.value = "Thank you.<br>Verification email has been sent.<br>Please check your inbox."
            resetSent.value = true;
            if (resetSent) { console.log("reset je poslat"); }
            else { console.log("reset nije poslat"); }

        } /*else {
            //poruka o gresci;
            console.log(response.message);
        }*/
    } catch (error) {
        console.error('Error in onSubmit:', error);
        //poruka o gresci: "Greška prilikom registracije. Molimo pokušajte ponovo."
        msg.value = getErrorMessage(error);
    }
}
</script>

<template>
    <div class="landing-page-container">
        <figure>
            <img src="../assets/imgs/landing-photo.jpg" alt="Taskenize">
        </figure>
        <div class="landing-page-content">
            <HeaderLanding />

            <div class="landing-page-inner-content">
                <hgroup v-if="!resetSent">
                    <h1>{{ title }} </h1>
                    <p>{{ text }}</p>

                    <div class="form-wrapper">

                        <form @submit.prevent="onSubmit">
                            <div class="form-field">
                                <input name="email" type="text" placeholder="Please enter your email here"
                                    v-model="email" />
                            </div><!--form-field-->

                            <div class="form-buttons">
                                <button type="submit" class="btn">Reset Password</button>
                                <RouterLink to="login" class="btn secondary">Cancel</RouterLink>
                            </div>
                        </form>
                    </div><!--form-wrapper-->
                </hgroup>
                <p v-else v-html="msg" class="message"></p>

            </div><!--landing-page-inner-content-->



            <FooterLanding />

        </div>
    </div>
</template>

<style scoped>
</style>