<template>
    <div class="my-reservations" >
        <div v-if="reservations.length">
            <div class="reservation" v-for="reservation in reservations" :key="'reservation-' + reservation.rvId"
                        :class="{'no-check-in': !reservation.checkIn}">
                <!-- 예약 내역 카드 -->
                <div class="reservation-card">
                    <div class="reservation-details">
                        <h4>예약 내역:</h4>
                        <h3 class="reservation-id">예약 ID: {{ reservation.rvId }}</h3>
                        <p class="user-id">사용자 ID: {{ reservation.users.uid }}</p>
                        <p class="reservation-dates">예약 시작 날짜: {{ formatDate(reservation.rvDateFrom) }}</p>
                        <p class="reservation-dates">예약 종료 날짜: {{ formatDate(reservation.rvDateTo) }}</p>
                        <p class="room-grade">방 등급: {{ reservation.roomGrade.roomGradeEnum }}</p>
                    </div>
                    <!-- 체크인 버튼 -->
                    <div class="reservation-actions">
                        <div v-if="reservation.checkIn === undefined">
                            <button type="button" class="btn btn-primary" data-toggle="modal"
                                :data-target="'#modal-' + reservation.rvId" @click="showModal(reservation)">
                                체크인
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 체크인 정보 카드 -->
                <div v-if="reservation.checkIn" class="checkin-card">
                    <h5>체크인 정보:</h5>
                    <p>체크인 ID: {{ reservation.checkIn.cinId }}</p>
                    <p>객실ID: {{ reservation.checkIn.room.rid }}</p>
                    <p>객실ID: {{ reservation.checkIn.room.rid }}</p>
                    <p>체크인 날짜: {{ reservation.checkIn.cinDate }}</p>
                    <p>체크인 시간: {{ reservation.checkIn.cinTime }}</p>
                    <!-- 체크아웃 버튼 -->
                    <button type="button" class="btn" style="background-color: #FFD152; color: #FFFFFF; width: 150px;"  @click="checkOutRequestFunc(reservation)">
                        체크아웃 요청
                    </button>
                    <button type="button" class="btn btn-info" style="width: 150px;" @click="checkOut(reservation)">
                        체크아웃 확정
                    </button>
                </div>
            </div>
        </div>
        <p v-else>예약 목록이 없습니다.</p>
        <div v-if="showModalBool">
        <div v-for="reservation in reservations" :key="'modal-' + reservation.rvId" :id="'modal-' + reservation.rvId"
            class="modal fade" tabindex="-1" aria-labelledby="'modalLabel-' + reservation.rvId" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ reservation.roomGrade.roomGradeEnum }} 방 목록</h5>
                    </div>
                    <div class="modal-body">
                        <div v-for="room in filteredRooms" :key="'room-' + room.rid">
                            <p>Room Id: {{ room.rid }} - {{ room.roomGrade.roomGradeEnum }} - {{ room.roomStatusEnum }}
                            </p>
                            <input type="text" v-model="room.roomPwd" placeholder="비밀번호 4자리" maxlength="4"
                                class="form-control mb-2">
                            <button type="button" class="btn btn-success" @click="checkInRoom(room, reservation.rvId)">
                                체크인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>


<script>
import axios from '@/axios';

export default {
    name: "MyReservationsComponent",
    data() {
        return {
            reservations: [],
            rooms: [],
            filteredRooms: [],
            showModalBool: false
        };
    },
    methods: {
        openModal() {
            this.showModalBool = true;
        },
        closeModal() {
            this.showModalBool = false;
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => {
                backdrop.parentNode.removeChild(backdrop);
            });
        },
        fetchReservations() {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert("로그인이 필요합니다.");
                this.$router.push('/login');
                return;
            }
            const requestDTO = { uId: userId };
            axios.post('/reservation/myReservations', requestDTO, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    this.reservations = response.data;
                    this.reservations.forEach(reservation => {
                        this.fetchCheckInInfo(reservation);
                    });
                })
                .catch(error => {
                    console.error('예약 목록을 불러오는 데 실패했습니다:', error);
                });
        },
        fetchCheckInInfo(reservation) {
            axios.post('/checkIn/myRvCheckIn', { rvId: reservation.rvId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    if (response.data) {
                        // 체크인 정보가 있는 경우, 예약 객체에 직접 할당
                        reservation.checkIn = response.data;
                    } else {
                        // 체크인 정보가 없는 경우, 예약 객체에 checkIn 프로퍼티를 undefined로 설정
                        reservation.checkIn = undefined;
                    }
                })
                .catch(error => {
                    console.error('체크인 정보를 불러오는 데 실패했습니다:', error);
                    reservation.checkIn = undefined;  // 에러 발생 시 checkIn 정보를 undefined로 설정
                });
        },
        showModal(reservation) {
            this.openModal();
            axios.get(`/checkIn/reservations/available`, { params: { rId: reservation.rvId } })
                .then(response => {
                    this.rooms = response.data;
                    this.filteredRooms = [];
                    for (let i = 0; i < this.rooms.length; i++) {
                        if (this.rooms[i].roomGrade.roomGradeEnum === reservation.roomGrade.roomGradeEnum) {
                            this.filteredRooms.push(this.rooms[i]);
                        }
                    }
                    console.log(this.filteredRooms);
                })
                .catch(error => {
                    console.error('가능한 방 목록을 불러오는 데 실패했습니다:', error);
                });
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        },
        cancelReservation(reservation) {
            if (!confirm("예약을 취소하시겠습니까?")) {
                return;
            }
            const requestDTO = {
                rvId: reservation.rvId
            };
            axios.delete('/reservation/delete', {
                data: requestDTO, headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    alert(response.data);
                    this.fetchReservations();  // 예약 목록 갱신
                })
                .catch(error => {
                    console.error('예약 취소 실패:', error);
                    alert('예약 취소 실패: ' + error.response.data);
                });
        },
        checkOutRequestFunc(reservation) {
            const checkOutRequest = {
                rId: reservation.checkIn.room.rid // room id만 사용
            };
            axios.post('/checkouts/checkoutrequest', checkOutRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                alert('체크아웃이 요청되었습니다.: ' + response.data);
            })
            .catch(error => {
                console.error('체크아웃 요청 실패:', error);
                alert('체크아웃 요청 실패: ' + error.response.data);
            });
        },
            checkOut(reservation) {
                    const checkoutRequest = {
                        cinId: reservation.checkIn.cinId
                    }
            
            axios.post(`/checkouts/perform`, checkoutRequest, {
            headers :{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }

            })
            .then(response => {
                alert('체크아웃 되었습니다.: ' + response.data);

                  // 체크아웃이 완료되면 해당 예약을 배열에서 제거
                const index = this.reservations.findIndex(item => item.rvId === reservation.rvId);
                if (index !== -1) {
                    this.reservations.splice(index, 1);
        }
                
                
            })
            .catch(error => {
                console.error('체크아웃  실패:', error);
                alert('체크아웃  실패: ' + error.response.data);
            });
        },
        checkInRoom(room, rvId) {
            const checkInRequest = {
                userId: localStorage.getItem('userId'), // 사용자 ID
                rvId: rvId, // 예약 ID
                roomId: room.rid, // 방 ID
                roomPwd: room.roomPwd, // 입력된 방 비밀번호
                rgId: room.roomGrade.rgId // 방 등급 ID
            };

            if (!room.roomPwd || room.roomPwd.length < 4) {
                alert("비밀번호 4자리를 입력해주세요.");
                return;
            }

            axios.post('/checkIn/pcheckIn', checkInRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    alert('체크인이 완료되었습니다: ' + response.data);
                    this.fetchReservations();
                    this.closeModal();
                    // 체크인 후 모달 닫기 및 필드 초기화
                    room.roomPwd = ''; // 비밀번호 필드 초기화
                })
                .catch(error => {
                    console.error('체크인 요청 실패:', error);
                    alert('체크인 실패: ' + error.response.data);
                });
            }
        },
        
    mounted() {
        this.fetchReservations();
    }
}
</script>
<style scoped>
.my-reservations {
    margin: 20px;
}

.reservation-heading {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
}

.reservation-list {
    display: flex;
    flex-direction: column;
}

.reservation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
}

.reservation-details, .reservation-actions {
    flex: 1;
}

.reservation-id, .user-id, .reservation-dates, .room-grade, .reservation-actions h4 {
    font-size: 18px;
    margin-bottom: 8px;
}

.reservation-actions button {
    padding: 10px 20px;
    border-radius: 5px;
}

.no-reservations {
    font-size: 18px;
    font-style: italic;
    color: #666;
}

.no-check-in {
    display: flex;
    align-items: center; /* 버튼을 중앙에 위치시킵니다 */
    justify-content: center; /* 버튼을 수평 중앙에 위치시킵니다 */
}
</style>