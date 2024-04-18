<template>
   <div>
    <Header/>
    <div>
        <AdminHeader/>hi
    </div>
   </div>
</template>

<script>
import { useRouter } from 'vue-router';
// import Datepicker from './Datepicker.vue';
import AdminHeader from './AdminHeader.vue';
import Header from './Header.vue';

export default {
    components : {
        AdminHeader,
        Header
    },
    setup () {
        const router = useRouter();

        const gotoAdminRoomStatus = () => {
            try {
                router.push({
                    name: 'AdminRoomStatusChange'
                });
            } catch (error) {
                console.error('Error navigating to AdminRoomStatusChange:', error);
            }
        };

        const gotoAdminCheckOut = () => {
            try {
                router.push({
                    name: 'AdminCheckout'
                });
            } catch (error) {
                console.error('Error navigating to AdminCheckout:', error);
            }
        };

        return {
            gotoAdminRoomStatus,
            gotoAdminCheckOut
        }
    }
}
</script>

<style>
</style>