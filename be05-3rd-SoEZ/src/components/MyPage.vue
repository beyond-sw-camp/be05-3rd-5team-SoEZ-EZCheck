<template>
  <div>
    <Header />
  <div class="my-page">
    <h1>My Page</h1>
    <div class="navigation">
      <!-- 네비게이션 링크, 선택적으로 router-link 사용 가능 -->
      <button type="button" @click="selectedTab = 'info'" class="btn btn-light">내 정보</button>
      <button @click="selectedTab = 'reservations'" class="btn btn-light">내 예약 목록</button>
    </div>

    <hr />
    <!-- 선택된 탭에 따라 다른 컴포넌트를 표시 -->
    <div v-if="selectedTab === 'info'">
      <!-- '내 정보' 버튼을 눌렀을 때 UserInfo 컴포넌트를 렌더링 -->
      <UserInfo :userInfo="userInfo" @update:userInfo="userInfo = $event" />
    </div>
    <div v-if="selectedTab === 'reservations'">
      <MyReservations />
    </div>
  </div>
  </div>
  
</template>

<script>
import { ref, onMounted } from 'vue';
import Header from './Header.vue';
import MyReservations from './MyReservations.vue';
import UserInfo from '@/components/UserInfo.vue';

export default {

  name: 'MyPage',
  components: {
    Header,
    MyReservations,
    UserInfo,
  },

  setup() {

    const userInfo = ref({})
    const selectedTab = ref('reservations');  // 기본적으로 예약 목록 탭을 선택

    const fetchReservations = () => {
      // API 호출을 통해 예약 데이터 불러오기
      // 예시: state.reservations = [{ id: 1, description: '호텔 예약', date: '2024-04-20' }];
      // 실제 API 호출로 대체해야 함
    }

    onMounted(fetchReservations);

    return {
      userInfo,
      selectedTab,
    }

  }

}
</script>

<style scoped>
.my-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.navigation button {
  margin: 5px;
}

.reservation-box {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
}
</style>