<template>
  <div class="room-list">
    <div v-for="room in availableRooms" :key="room.type" class="room">
      <img :src="getRoomImage(room.type)" class="card-img-top" alt="`Image of ${room.type}`" />
      <div class="room-details">
        <h3>{{ room.type }}</h3>
        <p>{{ room.description }}</p>
        <p>Price: {{ room.price }}</p>
      </div>
      <button @click="bookRoom(room.type)">Book Now</button>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  name: "RoomListComponent",
  props: {
    checkInDate: String,
    checkOutDate: String
  },
  data() {
    return {
      rooms: [
        { type: 'SUPERIOR', description: 'A cozy room with all the essentials.', price: '$100' },
        { type: 'DELUXE', description: 'Spacious room with luxurious amenities.', price: '$200' },
        { type: 'SUITE', description: 'An exquisite suite with premium features.', price: '$300' }
      ],
      availableRooms: []
    };
  },
  watch: {
    checkInDate(newVal) {
      if (newVal && this.checkOutDate) {
        this.fetchAvailableRooms();
      }
    },
    checkOutDate(newVal) {
      if (newVal && this.checkInDate) {
        this.fetchAvailableRooms();
      }
    }
  },
  methods: {
    getRoomImage(roomType) {
      switch (roomType) {
        case 'SUPERIOR':
          return "https://18db057190b78dc7.kinxzone.com/upfiles/resort/room/170425755812539117.jpg";
        case 'DELUXE':
          return "https://www.lottehotel.com/content/dam/lotte-hotel/lotte/seoul/accommodation/main-tower/club-flour/deluxe/180821-16-2000-acc-seoul-hotel.jpg.thumb.1920.1920.jpg";
        case 'SUITE':
          return "https://www.lottehotel.com/content/dam/lotte-hotel/lotte/seoul/accommodation/executive-tower/suite/royal-suite-room/181026-53-2000-roo-LTSE.jpg.thumb.1920.1920.jpg";
        default:
          return "https://www.lottehotel.com/content/dam/lotte-hotel/lotte/seoul/accommodation/main-tower/standard/deluxe/181107-8-2000-roo-LTSE.jpg.thumb.768.768.jpg"; // 기본 이미지 URL
      }
    },

    fetchAvailableRooms() {
      const reservationRequest = {
        rvDateFrom: this.checkInDate,
        rvDateTo: this.checkOutDate
      };
      axios.post('/reservation/listAvailableGrades', reservationRequest, {
        headers: {
          'Content-Type': 'application/json',
          //'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          // Clear the availableRooms before updating
          this.availableRooms = [];
          const availableTypes = response.data.map(room => room.roomGradeEnum);

          // Update the availableRooms based on the available types
          this.availableRooms = this.rooms.filter(room => availableTypes.includes(room.type));
        })
        .catch(error => {
          console.error('Error fetching available rooms:', error);
        });
    },
    bookRoom(roomType) {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('로그인이 필요합니다');
        this.$router.push('/login');
        return;
      }
      const rgId = roomType === 'SUPERIOR' ? 1 :
        roomType === 'DELUXE' ? 2 :
          roomType === 'SUITE' ? 3 : null;
      let reservationRequest = {
        uId: userId,
        rgId: rgId,
        rvDateFrom: this.checkInDate,
        rvDateTo: this.checkOutDate
      };

      axios.post('/reservation/make', reservationRequest, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          alert('Room booked successfully!');
          console.log(response.data);
          this.fetchAvailableRooms();
        })
        .catch(error => {
          console.error('Error booking the room:', error);
          alert('Failed to book the room.');
        });
    }
  },
  mounted() {
    if (this.checkInDate && this.checkOutDate) {
      this.fetchAvailableRooms();
    }
  }
}
</script>

<style></style>