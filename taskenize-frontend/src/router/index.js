import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue';
//import LogView from '../views/LogView.vue';
//import SignView from '../views/SignView.vue';
import DemoView from '../views/DemoView.vue';
import MyAccountView from '../views/MyAccountView.vue';
import ProjectView from '../views/ProjectView.vue';
import TaskView from '../views/TaskView.vue';
import WorkspacesView from '../views/WorkspacesView.vue';
import LandingPage from '../views/LandingPage.vue';
import ProfileView from '../views/ProfileView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import Welcome from '../views/Welcome.vue';
import RegistrationConfirmation from '../views/RegistrationConfirmation.vue';
import PassReset from '../views/PassReset.vue';
import ResetConfirmation from '../views/ResetConfirmation.vue';
import TestView from '../views/TestView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/demo',
      name: 'demo',
      component: DemoView
    },
    {
      path: '/myAccount',
      name: 'myAccount',
      component: MyAccountView
    },
    {
      path: '/taskSingle',
      name: 'taskSingle',
      component: TaskView
    },
    {
      path: '/project',
      name: 'project',
      component: ProjectView
    }, 
    {
      path: '/workspace',
      name: 'workspace',
      component: WorkspacesView
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: Welcome
    },
    {
      path: '/reg-confirmation',
      name: 'reg-confirmation',
      component: RegistrationConfirmation
    },
    {
      path: '/pass-reset',
      name: 'pass-reset',
      component: PassReset
    },
    {
      path: '/reset-confirmation',
      name: 'reset-confirmation',
      component: ResetConfirmation
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    //view za testiranje funckionalnosti:
    {
      path: '/test',
      name: 'test',
      component: TestView
    }
  ]
})

export default router
