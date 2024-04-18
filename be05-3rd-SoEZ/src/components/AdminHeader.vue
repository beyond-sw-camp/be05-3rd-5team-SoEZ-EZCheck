<template>
    <div class="banner">
        <div class="container">
            <!-- <div class="d-flex justify-content-between align-items-center">
                <h2 class="mb-4 mt-4">관리자 페이지</h2>
            </div> -->
            <div class="row">
                <div class="col-sm-6 mb-3 mb-sm-0">
                    <div class="card transparent-card">
                        <div class="card-body">
                            <h5 class="card-title">객실 상태 관리</h5>
                            <p class="card-text">객실 상태 변경 메뉴</p>
                            <button class="btn btn-light " @click="gotoAdminRoomStatus">바로가기</button>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="card transparent-card">
                        <div class="card-body">
                            <h5 class="card-title">체크아웃 관리</h5>
                            <p class="card-text">체크아웃 요청 승인 관리</p>
                            <button class="btn btn-light " @click="gotoAdminCheckOut">바로가기</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script>
import { useRouter } from 'vue-router';

export default {
    setup() {
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
    };
    }
};
</script>
    
<style>
.border {
    border-bottom: 10px solid #dee2e6;
}
.banner {
    background-image: url('https://www.shillahotels.com/images/upload/spofrpack/240118/FILE666e1afb156024f6.jpg');
    /* 원하는 배경 이미지 URL로 변경 */
    background-size: cover;
    background-position: center;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.transparent-card {
    background-color: transparent;
    border: none;
}

.card {
    background-color: rgba(255, 255, 255, 0.7); /* 흰색 배경에 70%의 투명도 적용 */
    color: black;
}

.card-title {
    font-size:40px;
    font-weight: bold;
}

.card-text {
    font-size: 17px;
}
</style>