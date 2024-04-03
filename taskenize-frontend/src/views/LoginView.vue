<script setup>
import HeaderLanding from '@/components/HeaderLanding.vue';
import FooterLanding from '@/components/FooterLanding.vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { reactive, ref } from 'vue';
import { useErrorHandling } from '@/utils/errorHandling';

let title = "Login";
let text = "Please enter the data required below in order to login."
let user = reactive({
    email: '',
    password: ''
});
const message = ref(''); //bilo je msg
//const isLoggedIn = ref(false); //proveri ovo
const { getErrorMessage } = useErrorHandling();
let isError = ref('');

async function onSubmit() {
    console.log("onsubmit je okinut");
    const authStore = useAuthStore();
    try {
        const response = await authStore.login(user);
        if (response && response.status === 200) {
            //poruka korisniku da proveri email
            //router.push('/login');
            console.log("status 200 ", response.data.msg);
            //message.value = "Login was successful."
            //isLoggedIn.value = true;
            //if (isLoggedIn) { console.log("isLoggedIN je OK"); }
            //else { console.log("isNotLoggedIN"); }

        } /*else {
            //poruka o gresci;
            console.log(response.msg);
        }*/
    } catch (error) {
        console.error('Error in onSubmit:', error);
        //poruka o gresci: "Greška prilikom registracije. Molimo pokušajte ponovo."
        message.value = getErrorMessage(error);
        isError.value = true;
       // isLoggedIn.value = true;
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
                <!--<hgroup v-if="!isLoggedIn">-->
                <hgroup>
                    <h1>{{ title }} </h1>
                    <p>{{ text }}</p>

                    <div class="form-wrapper">

                        <form @submit.prevent="onSubmit">
                            <div class="form-field">
                                <label>Email adress</label>
                                <input name="email" type="text" placeholder="Please enter your email here"
                                    v-model="user.email" />
                            </div><!--form-field-->
                            <div class="form-field">
                                <label>Password</label>
                                <input name="pass" type="password" placeholder="Please enter your password here"
                                    v-model="user.password" />
                            </div><!--form-field-->

                            <div class="form-buttons">
                                <button type="submit" class="btn">Login</button>
                                <RouterLink to="/" class="btn secondary">Cancel</RouterLink>
                            </div>
                            <p><RouterLink to="pass-reset" class="link">Forgot your password?</RouterLink></p>
                        </form>
                    </div><!--form-wrapper-->
                    <p v-html="message" :class="isError ? 'error' : ''"></p>
                </hgroup>
                <!--<p v-else v-html="message" class="message"></p>-->
                <!--<p v-html="message" class="message"></p>-->
                
            </div><!--landing-page-inner-content-->



            <FooterLanding />

        </div>
    </div>
</template>

<style scoped>
.link {
    font-size: 16px;
    color:#175CD3;
    text-decoration: underline;
}

form p {
    padding-top: 10px;
}



</style>