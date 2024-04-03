<script setup>
import HeaderLanding from '@/components/HeaderLanding.vue';
import FooterLanding from '@/components/FooterLanding.vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { reactive, ref } from 'vue';
import { useErrorHandling } from '@/utils/errorHandling'; //
import { sanitizeName, sanitizeEmail, validatePassword, validateEmail } from '@/utils/validation';

let title = "Register";
let text = "Please fill in the form below in order to register."
let user = reactive({
    name: '',
    email: '',
    password: ''
});
const message = ref('');
const successMessage = ref('');
const registrationAttempted = ref(false);
const { getErrorMessage } = useErrorHandling();//
let isError = ref('');

async function onSubmit() {
    console.log("onsubmit je okinut");
    // Sanitizacija
    user.name = sanitizeName(user.name);
    user.email = sanitizeEmail(user.email);

    // Validacija
    if (!validateEmail(user.email)) {
        message.value = "Invalid email format.";
        isError.value = true;
        return;
    }

    if (!validatePassword(user.password)) {
        message.value = "Password does not meet the required criteria.";
        isError.value = true;
        return;
    }

    const authStore = useAuthStore();
    try {
        const response = await authStore.register(user);
        if (response && response.status === 200) {
            registrationAttempted.value = true;
            console.log("status 200 ", response.data.msg);
            console.log("Pre promene poruke: ", message.value);
            successMessage.value = "Thank you.<br>" + response.data.msg + "<br>Please check your inbox.";
            console.log("Posle promene poruke: ", message.value);
            
        }/* else {
            registrationAttempted.value = true;
            console.log(response.data.msg);
            message.value = response.data.msg;
        }*/
    } catch (error) {
        successMessage.value = getErrorMessage(error);
        registrationAttempted.value = true;
        //isError = true;
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

            <div class="landing-page-inner-content" >
                <hgroup v-if="!registrationAttempted">
                    <h1>{{ title }} </h1>
                    <p>{{ text }}</p>
                
                    <div class="form-wrapper">

                        <form @submit.prevent="onSubmit">
                            <div class="form-field">
                                <label>Full name</label>
                                <input name="name" type="text" placeholder="Please enter your first and last name here" v-model="user.name"/>
                            </div><!--form-field-->
                            <div class="form-field">
                                <label>Email adress</label>
                                <input name="email" type="text" placeholder="Please enter your email here" v-model="user.email"/>
                            </div><!--form-field-->
                            <div class="form-field">
                                <label>Password</label>
                                <input name="pass" type="password" placeholder="Please enter your password here" v-model="user.password"/>
                            </div><!--form-field-->

                            <div class="form-buttons">
                                <button type="submit" class="btn">Register</button>
                                <RouterLink to="/" class="btn secondary">Cancel</RouterLink>
                            </div>
                        </form>
                    </div><!--form-wrapper-->
                    <p v-html="message" :class="isError ? 'error' : ''"></p>
                </hgroup>
                <p v-html="successMessage" class="message"></p>

            </div><!--landing-page-inner-content-->

             

            <FooterLanding />

        </div>
    </div>
</template>

<style scoped>
</style>