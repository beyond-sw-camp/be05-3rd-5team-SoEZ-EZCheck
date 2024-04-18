<template>
  <div class="datepicker">
    <label for="check-in">Check-in:</label>
    <input type="date" id="check-in" v-model="checkInDate" @change="updateDates" :min="minCheckInDate">

    <label for="check-out">Check-out:</label>
    <input type="date" id="check-out" v-model="checkOutDate" @change="updateDates" :min="minCheckOutDate">
  </div>
</template>

<script>
export default {
    name: "DatepickerComponent",
    data() {
        return {
            checkInDate: '',
            checkOutDate: '',
            minCheckInDate: new Date().toISOString().substring(0, 10),
            minCheckOutDate: ''
        };
    },
    watch: {
        checkInDate(newVal) {
            if (newVal) {
                const nextDay = new Date(newVal);
                nextDay.setDate(nextDay.getDate() + 1);
                this.minCheckOutDate = nextDay.toISOString().substring(0, 10);
                if (this.checkOutDate && this.checkOutDate <= newVal) {
                    this.checkOutDate = this.minCheckOutDate;
                }
            }
        }
    },
    methods: {
        updateDates() {
            this.$emit('update-dates', { checkInDate: this.checkInDate, checkOutDate: this.checkOutDate });
        }
    }
}
</script>

<style>
/* 필요한 스타일 추가 */
</style>
