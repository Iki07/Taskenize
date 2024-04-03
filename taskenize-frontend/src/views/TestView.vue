<script setup>
//import api from "@/api/index";
import { ref } from "vue";
import { generateRandomAvatar } from '@/utils/imageProcess';
const taskFormData = new FormData();
let fileToUpload;
const ime = ref('');

//samo za forme koje salju avatar - create user, tem, project, wsp
async function submitForm() {
    console.log("Pozivanje submitForm funkcije");
    taskFormData.set("ime", ime.value);
    // Proveravam da li je slika dodata u FormData
    if (!taskFormData.has("file")) {
        // Ako slika nije dodata, generišem avatar
        const avatarBlob = await generateRandomAvatar();
        fileToUpload = new File([avatarBlob], "avatar.png", { type: "image/png" });
        console.log("avatar je ", fileToUpload)
        taskFormData.set("file", fileToUpload);
        console.log("forma je: ", taskFormData);
    }
    console.log("Forma sadrzi: ");
    for (let [key, value] of taskFormData.entries()) {
        console.log(key, value);
    }
    // Logika za slanje form data na server
    // ...
}

async function getFile(e) {
    const maxFileSize = 0.5 * 1024 * 1024;
 
    const file = e.target.files[0]; //ovo je bilo u  kodu
   
    if (!file.type.startsWith('image/')) {
        console.log("Please choose image file type."); // uskladi sa ostalim porukama u app-u
        return;
    }
    if (file.size > maxFileSize) {
        console.log("Image is too large."); //  uskladi sa ostalim porukama u app-u
        return;
    }
    fileToUpload = file;
    console.log("slika je ", fileToUpload)
    taskFormData.set("file", fileToUpload); 
    console.log("Image is OK.");
    } 
 
    

</script>

<template>
    <div class="content">
        <h1>This is test page</h1>
        <form @submit.prevent="submitForm">
            <input type="text" name="ime" v-model="ime">Unesi ime
            <input type="file" name="slika" @input="getFile">
            <button type="submit">Pošalji</button>
        </form>
    </div>
    <!--<div class="attach-test">
        <img :src="'http://307w123.e2.mars-hosting.com/api/image/' + img_id">
        <a :href="'http://307w123.e2.mars-hosting.com/api/attach/' + att_id">{{ attach_title }}</a>
    </div>-->
</template>

<style scoped>
.content {
    padding: 40px;
}
</style>