<template>
  <div>
    <Header />
  <!-- <form>
  
  <div data-mdb-input-init class="form-outline mb-4">
    <input type="userId" id="form2Example1" class="form-control" />
    <label class="form-label" for="form2Example1">User Id</label>
  </div>


  <div data-mdb-input-init class="form-outline mb-4">
    <input type="password" id="form2Example2" class="form-control" />
    <label class="form-label" for="form2Example2">Password</label>
  </div>  -->
<br/>
  <form @submit.prevent="signIn"  class="form-container">
    <!-- Id input -->
    <div class="form-outline mb-4">
      <label class="form-label">User Id</label>
      <br/>
      <input type="text" v-model="userId" class="form-control" />
    </div>

    <!-- Password input -->
    <div class="form-outline mb-4">
      <label class="form-label">Password</label>
      <br/>
      <input type="password" v-model="password" class="form-control" />
    </div>

    <!-- 2 column grid layout for inline styling -->
    <div class="row mb-4">
      <div class="col d-flex justify-content-center">
        <!-- Checkbox -->
        <div class="form-check">
          <input type="checkbox" v-model="isAdmin" class="form-check-input" id="adminLoginCheck" />
          <label class="form-check-label" for="adminLoginCheck">관리자 로그인</label>
        </div>
      </div>

      <!-- <div class="col">
        <a href="#!">Forgot password?</a>
      </div> -->
    </div>

    <!-- Submit button 
  <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-block mb-4">Sign in</button>
-->
    <button type="submit" class="btn btn-primary btn-block mb-4">Sign in</button>


    <!-- Register buttons -->
    <div class="text-center">
      <p>Not a member? <router-link to="/signup">Register</router-link></p>
      <p>or sign up with:</p>
      <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-link btn-floating mx-1">
        <i class="fab fa-facebook-f"></i>
      </button>

      <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-link btn-floating mx-1">
        <i class="fab fa-google"></i>
      </button>

      <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-link btn-floating mx-1">
        <i class="fab fa-twitter"></i>
      </button>

      <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-link btn-floating mx-1">
        <i class="fab fa-github"></i>
      </button>
    </div>
  </form>
  </div>
</template>
<script>
import Header from './Header.vue';
import axios from '@/axios';

export default {
  components: { Header },
  name: "LoginComponent",
  data() {
    return {
      userId: '',
      password: '',
      isAdmin: false  // 관리자 로그인 옵션 추가
    };
  },
  methods: {
    async signIn() {
      try {
        // 관리자 로그인 여부에 따라 API 엔드포인트 변경
        const endpoint = this.isAdmin ? '/admin/signin' : '/user/signin';
        
        const response = await axios.post(endpoint, {
          userId: this.userId,
          password: this.password
        });
        
        // 로그인 성공 시 처리
        console.log('로그인 성공:', response.data);
        localStorage.setItem('token', response.data.token);  // 토큰 저장
        localStorage.setItem('userId', this.userId);  // 사용자 ID 저장
        localStorage.setItem('type', this.isAdmin ? 'Admin' : 'User');

        this.$router.push('/');  // 메인 페이지 경로로 리디렉션
      } catch (error) {
        // 로그인 실패 시 처리
        console.error('로그인 실패:', error);
        alert('로그인 실패: ' + error.response.data.message);  // 실패 메시지 표시
        localStorage.removeItem('token');  // 로그인 실패 시 토큰 삭제
        this.isLoggedIn = false;  // 로그인 상태를 false로 설정
      }
    }
  }
}
</script>

<style scoped>
.form-container {
  max-width: 50%;
  margin: 0 auto;
}

.form-outline {
  width: 100%;
}

.form-control {
  width: 100%;
}

</style>