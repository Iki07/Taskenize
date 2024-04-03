import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

export function userAutoLogout() {
    const authStore = useAuthStore();
    const route = useRoute();
    const logoutTimer = ref(null);

    const publicPages = ['landing', 'login', 'register', 'demo', 'reg-confirmation', 'pass-reset', 'reset-confirmation'];

    const startLogoutTimer = () => {
        if (logoutTimer.value) {
            clearTimeout(logoutTimer.value);
        }
        logoutTimer.value = setTimeout(() => {
            // Logika za odjavljivanje
            authStore.logout();
        }, 1200000); 
    };

    const resetLogoutTimer = () => {
        const isPublicPage = publicPages.includes(route.name);
        if (!isPublicPage) {
            startLogoutTimer();
        }
    };

    // Osluškivači događaja za resetovanje tajmera na korisnikovu interakciju
    onMounted(() => {
        window.addEventListener('mousedown', resetLogoutTimer);
        window.addEventListener('keypress', resetLogoutTimer);
        window.addEventListener('scroll', resetLogoutTimer);
        window.addEventListener('touchstart', resetLogoutTimer);
    });

    onUnmounted(() => {
        window.removeEventListener('mousedown', resetLogoutTimer);
        window.removeEventListener('keypress', resetLogoutTimer);
        window.removeEventListener('scroll', resetLogoutTimer);
        window.removeEventListener('touchstart', resetLogoutTimer);
        if (logoutTimer.value) {
            clearTimeout(logoutTimer.value);
        }
    });

    // Reagovanje na promene rute
    watch(() => route.name, () => {
        resetLogoutTimer(); // Resetujem tajmer svaki put kada se promeni ruta
    });
}

