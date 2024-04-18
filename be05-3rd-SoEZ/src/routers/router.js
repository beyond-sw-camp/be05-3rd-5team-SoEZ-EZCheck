import { createWebHistory, createRouter } from "vue-router";
import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import AvailableRoom from '../components/AvailableRoom.vue';
import UserSignup from '../components/UserSignup.vue';
import MyPage from '../components/MyPage.vue';
// import AdminMain from '@/AdminMain.vue';
import AdminHome from '@/components/AdminHome.vue';
import AdminCheckout from '@/components/AdminCheckout.vue';
import AdminRoomStatusChange from '@/components/AdminRoomStatusChange.vue';


const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/Login",
        name: "Login",
        component: Login
    },
    {
        path: "/AvailableRoom",
        name: "AvailableRoom",
        component: AvailableRoom
    },
    {
        path: '/signup',
        name: 'UserSignUp',
        component: UserSignup
    },
    {
        path: "/MyPage",
        name: "MyPage",
        component: MyPage
    },
    {
        path: '/AdminHome',
        name: 'AdminHome',
        component : AdminHome
    },
    {
        path: '/AdminCheckout',
        name: 'AdminCheckout',
        component : AdminCheckout
    },
    {
        path: '/AdminRoomStatusChange',
        name: 'AdminRoomStatusChange',
        component : AdminRoomStatusChange
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;