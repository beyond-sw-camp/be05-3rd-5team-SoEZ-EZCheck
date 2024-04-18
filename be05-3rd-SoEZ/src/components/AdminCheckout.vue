<template>
    <div>
        <Header/>
        <div class="container">
            <div class="row align-items-stretch">
                <div class="col-md-6 d-flex justify-content-start align-items-begin">
                    <h3 class="mt-3">체크아웃 요청 승인</h3>
                </div>
                <div class="col-md-6 d-flex justify-content-end align-items-center">
                    <section>
                        <Datepicker @update-dates="handleDateChange"/>
                        <!-- 체크아웃 날짜 선택시 해당 일에 해당하는 체크아웃 요청 목록만 확인 가능하도록 설정  -->
                        <!-- 백 checkout - checkoutController의 @GetMapping("/date"), getCheckOutRecordsByDate메서드 사용 -->
                    </section>
                </div>
            </div>

            <hr>

            <table class="table table-bordered mz-">
                <tr class="submenu">
                    <th>선택</th>
                    <th>체크아웃 요청ID</th>
                    <th>사용자ID</th>
                    <th>체크아웃 요청 날짜</th>
                    <th>체크아웃 상태</th>
                    <!-- 체크아웃 상태는 INPROGRESS, ACCEPTED나 REJECTED 중 택1 -->
                </tr>

                <tbody>
                    <tr v-for="coutRoom in filteredCoutRooms"
                        :key="coutRoom.coutId"
                        style="vertical-align: middle;" 
                        align="center">
                        <td>
                            <button  class="btn btn-primary"
                                    @click="approveCheckoutRequest(coutRoom.coutId)">승인</button>
                            <button  class="btn btn-danger" 
                                    @click="rejectCheckoutRequest(coutRoom.coutId)">거절</button>
                            <!-- <button  class="btn btn-primary"
                                    @click="selectRooms(coutRoom)">승인</button>
                            <button  class="btn btn-danger" 
                                    @click="selectRooms(coutRoom)">거절</button> -->
                        </td>
                        <td>{{coutRoom.coutId}}</td>
                        <td>{{coutRoom.uid}}</td>
                        <td>{{coutRoom.coutDate}}</td>                        
                        <td>{{ coutRoom.checkOutStatusEnum }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import Header from './Header.vue';
import { ref, computed } from 'vue';
import axios from '@/axios';
import Datepicker from './Datepicker.vue';

export default {
    components: {
        Header,
        Datepicker
    },
    setup() {
        const coutRooms = ref([]);

        const getCheckoutRooms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/checkouts/all');
                coutRooms.value = response.data;
            } catch (error) {
                console.error(error);
            }
        }
        getCheckoutRooms();

        const approveCheckoutRequest = async (coutId) => {
            try {
                await axios.get(`http://localhost:8080/checkouts/approve/${coutId}`);
                window.alert('승인되었습니다.');
                getCheckoutRooms();
            } catch (error) {
                console.error(error);
                window.alert("오류! 처리되지 않았습니다.");
                getCheckoutRooms();
            }
        }

        const rejectCheckoutRequest = async (coutId) => {
            try {
                await axios.get(`http://localhost:8080/checkouts/reject/${coutId}`);
                window.alert('거절되었습니다.');
                getCheckoutRooms();
            } catch (error) {
                console.error(error);
                window.alert("오류! 처리되지 않았습니다.");
                getCheckoutRooms();
            }
        }

        // 체크아웃 상태가 INPROGRESS 또는 REJECTED인 경우만 필터링
        const filteredCoutRooms = computed(() => coutRooms.value.filter(coutRoom => coutRoom.checkOutStatusEnum === "INPROGRESS" || coutRoom.checkOutStatusEnum === "REJECTED"));

        return {
            coutRooms,
            approveCheckoutRequest,
            rejectCheckoutRequest,
            filteredCoutRooms
        }
    }
}
</script>

<style>
.submenu th {
    /* line-height: 5px;
    텍스트 한 줄의 높이 설정 */
    text-align: center;
    /* 텍스트를 가운데로 정렬 */
}
.coutAuthorize {
    display: flex;
    justify-content: right;
    align-items: right;
}
</style>