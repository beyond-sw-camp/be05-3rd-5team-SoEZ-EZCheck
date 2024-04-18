<template>
  <div class="home">
    <Header />
    <div class="banner">
      <div class="banner-content">
        <h1>Welcome to ezCheck</h1>
        <p>Discover luxury stays with ezCheck</p>
        <router-link type="button" class="btn btn-light" to="/AvailableRoom">Book Now</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './Header.vue';

export default {
  name: 'HomeComponent',
  components: {
    Header
  }
};
</script>

<style scoped>
.home {
  text-align: center;
}

.banner {
  background-image: url('https://www.conradseoul.co.kr/revolution/content/fileImage.do?fileId=11671&cntntsSn=11669');
  /* 원하는 배경 이미지 URL로 변경 */
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-content {
  text-align: center;
  color: #fff;
}

.banner h1 {
  font-size: 3em;
  margin-bottom: 20px;
}

.banner p {
  font-size: 1.5em;
  margin-bottom: 30px;
}

.btn-primary {
  background-color: #ffcd00;
  color: #000;
  border: none;
  padding: 10px 20px;
  font-size: 1.2em;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #ffdb4d;
}
</style>