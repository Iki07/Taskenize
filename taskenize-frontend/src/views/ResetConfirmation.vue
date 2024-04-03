<script setup>
import HeaderLanding from '@/components/HeaderLanding.vue';
import FooterLanding from '@/components/FooterLanding.vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { reactive, ref, onMounted } from 'vue';
import { useErrorHandling } from '@/utils/errorHandling';

const router = useRouter();
const { getErrorMessage } = useErrorHandling();
const title = ref('');
const text = ref('');
const showForm = ref(false);
let password = ref('');
const msg = ref('');
let user = reactive({
    email: '',
    password: ''
});
let passwordChanged = ref(false);


onMounted(async () => {
    const route = useRoute();
    const token = route.query.token;
    console.log("Token:", token); // Provera tokena

    if (token) {
        const authStore = useAuthStore();
        try {
            const response = await authStore.verify(token);
            if (response && response.status === 200) {
                console.log(response.message);
                user.email = response.data.email;
                title.value = "Password update";
                text.value = "Please enter your new password below.";
                showForm.value = true;
            } /*else {
                console.log(response.message);
                console.log("Token nije validan ili je istekao");
                title.value = "Password reset failure";
                text.value = "Sorry, your attempt to change password has failed.";
                showForm.value = false;
            }*/
        } catch (error) {
            console.error('Error in onSubmit:', error);
            console.log("Token nije obezbeđen");
            title.value = "Password update failure";
            text.value = "Sorry, your attempt to change password has failed.";
            showForm.value = false;
        }
    }
});

async function onSubmit() {
    console.log("onsubmit je okinut");
    user.password = password.value;
   // user.password = "1234";
    const authStore = useAuthStore();
    try {
        const response = await authStore.changePass(user);
        if (response && response.status === 200) {
            console.log("status 200 ", response);
            msg.value = "Congratulations! Password successfully changed. You will soon be redirected to Login page."
            passwordChanged.value = true;
            setTimeout(() => {
                router.push('/login');
            }, 5000);
        } /*else {
            console.log(response.message);
            msg.value = "Failed to change the password. Please try again.";
            passwordChanged.value = false;
        }*/
    } catch (error) {
        console.error('Error in onSubmit:', error);
        //msg.value = "An error occurred. Please try again.";
        msg.value = getErrorMessage(error);
        passwordChanged.value = false;
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
                <hgroup>
                    <h1>{{ title }} </h1>
                    <p>{{ text }}</p>

                    <div class="form-wrapper" v-if="showForm">

                        <form @submit.prevent="onSubmit">
                            <div class="form-field">
                                <label>Password</label>
                                <input name="pass" type="password" placeholder="Please enter your password here" v-model="password" />
                            </div><!--form-field-->

                            <div class="form-buttons" v-if="!passwordChanged">
                                <button type="submit" class="btn">Submit</button>
                                <RouterLink to="/" class="btn secondary">Cancel</RouterLink>
                            </div>
                        </form>
                    </div><!--form-wrapper-->
                    <RouterLink v-else to="pass-reset" class="btn secondary">Try again</RouterLink>

                    <p class="success" v-if="passwordChanged">{{ msg }}</p>
                    <p v-else-if="msg" class="error">{{ msg }}</p>


                </hgroup>


            </div><!--landing-page-inner-content-->



            <FooterLanding />

        </div>
    </div>
</template>

<style scoped>
form p {
    padding-top: 10px;
}
hgroup p.success {
    font-size: 16px;
    background-color: rgb(170, 248, 222);
    border: 1 px solid rgb(110, 247, 201);
    padding: 10px;
    border-radius: 6px;
}

hgroup p.error {
    font-size: 16px;
    background-color: rgb(244, 223, 216);
    border: 1 px solid rgb(247, 110, 110);
    padding: 10px;
    border-radius: 6px;
}

@media (max-width: 1024px) {
    .message {
        padding: 30px;
    }
}
</style>