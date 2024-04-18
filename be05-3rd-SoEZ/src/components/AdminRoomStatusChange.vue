<template>
   <div>
    <Header/>
    <div class="container">
        <div class="row align-items-stretch">
            <div class="col-md-6 d-flex justify-content-start align-items-begin">
                <h3 class="mt-3">객실 상태 변경</h3>
            </div>
            <div class="col-md-6 d-flex justify-content-end align-items-begin">
                <button class="btn btn-primary mt-3"
                        @click="saveChangedStatus">저장</button>
            </div>
        </div>
        <hr>

        <table class="table table-bordered mz-">
            <tr class="submenu">
                <th>선택</th>
                <th>객실ID</th>
                <th>객실등급ID</th>
                <th>객실 비밀번호</th>
                <th>객실 상태</th>
            </tr> 

            <tbody>
                <tr v-for="room in filteredRooms" :key="room.rid" align="center">
                    <td>
                        <input  type="checkbox" 
                                @click="selectRooms(room)">
                    </td>
                    <td>{{ room.rid }}</td>
                    <td>{{ room.roomGrade.roomGradeEnum }}</td>
                    <td>{{ room.rpwd }}</td>
                    <td>{{ room.roomStatusEnum }}</td>
                </tr>
            </tbody>
        </table>
        
        <div class="error"> <!-- 에러라는 데이터 바인딩 -->
            {{ error }}
        </div>

    </div>
   </div>
</template>

<script>
import {ref, computed} from 'vue';
import axios from 'axios';
import Header from './Header.vue';

export default {    
    components : {
        Header
    },
    setup () {
        const rooms = ref([]);
        const selectedRoomIds = ref([]);

        const getRooms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/room/allRooms');
                rooms.value = response.data;
            } catch (error) {
                console.error(error);
            }
        }
        getRooms();

        const selectRooms = (room) => {
            if (!selectedRoomIds.value.includes(room.rid)) {
                selectedRoomIds.value.push(room.rid);
            } else {
                const index = selectedRoomIds.value.indexOf(room.rid);
                selectedRoomIds.value.splice(index, 1);
            }
        }

        const saveChangedStatus = async () => {
            try {
                await Promise.all(selectedRoomIds.value.map(roomId => axios.get(`http://localhost:8080/room/updateRoomStatus/${roomId}`)));
                window.alert('저장되었습니다.');
                getRooms();
            } catch (error) {
                console.error(error);
                window.alert("오류! 저장되지 않았습니다.");
                getRooms();
            } 
        }

        const filteredRooms = computed(() => rooms.value.filter(room => room.roomStatusEnum === "MAINTENANCE"));

        return {
            selectRooms,
            rooms,
            getRooms,
            saveChangedStatus,
            filteredRooms
        }
    }

}
</script>


<style>
    .no-border {
        border: none;
    }
    .work{
        color: olive;
        text-decoration: line-through;
    }
    
    .submenu th{
        line-height: 40px;          
        text-align: center;         
    }
    .text-right  {
        float: right;
    }
</style>
