<template>
  <div>
      <ReservationPage></ReservationPage>
      <div>Inloggad som: {{user}}</div>
      <button @click='logOut'>Logga ut</button>
    <div>Dagens datum: {{ current.year }} - {{current.month}} - {{current.day}}</div>
    <button @click="getCurrentDate">Idag</button>
    <div class="checkmark show">✔</div>
    <div>                                 
        <button @click="monthDown" v-if='!(selected.month < current.month && selected.year <= current.year)'>-</button>
        Vald månad: {{ months[selected.month -1] }} {{selected.year}}
        <button @click="monthUp">+</button>
    
      </div>

    <div class="calendar-wrapper">
      <div class="weekday" v-for="(weekday, index) in weekdays" :key="'weekday'+index">{{ weekday }}</div>


      <div class="date-hidden" v-for="(n, index) in prevMonthDaysVisible" :key="'prev'+index">
        <div class="date-number">{{ n + numberOfDaysInPrevMonth - prevMonthDaysVisible }}</div>
      </div>

    <div class="date" @click='toggleModal(date)' v-for="(date, index) in selectedMonthData" :key="'current'+index">
        <div class="date-number" :class="{today: '' + current.year + current.month + current.day == '' + selected.year + selected.month + date.date}">{{ date.date }}</div>

        
        <div class="time-a" :class="[Object.entries(date.timePeriods[0].booking).length > 0 ? 'booked' : '', (date.timePeriods[0].booking.name === user && Object.entries(date.timePeriods[0].booking).length > 0) ? 'your-booking' : '']">8-12</div>
        <div class="time-b" :class="[Object.entries(date.timePeriods[1].booking).length > 0 ? 'booked' : '', (date.timePeriods[1].booking.name === user && Object.entries(date.timePeriods[1].booking).length > 0) ? 'your-booking' : '']">12-16</div>
        <div class="time-c" :class="[Object.entries(date.timePeriods[2].booking).length > 0 ? 'booked' : '', (date.timePeriods[2].booking.name === user && Object.entries(date.timePeriods[2].booking).length > 0) ? 'your-booking' : '']">16-20</div>
      </div>
      <div class="date-hidden" v-for="(n, index) in nextMonthDaysVisible" :key="'next'+index">
        <div class="date-number">{{ n }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import ReservationPage from "./ReservationPage.vue";
export default {
  created: function() {
    this.loadFromDb();
  },
  components: {
    ReservationPage
  },
  computed: {
    bookings() {
      return this.$store.state.bookings;
    },

    current() {
      return this.$store.state.current;
    },

    months(){
        return this.$store.state.months
    },

    nextMonthDaysVisible() {
      return Number(
        7 -
          moment(
            this.$store.state.selected.year +
              "-" +
              this.$store.state.selected.month,
            "YYYY-MM"
          )
            .endOf("month")
            .format("E")
      );
    },

    numberOfDaysInPrevMonth() {
      if (this.$store.state.selected.month === 1) {
        return moment(
          this.$store.state.selected.year - 1 + "-" + 12,
          "YYYY-MM"
        ).daysInMonth();
      } else {
        return moment(
          this.$store.state.selected.year +
            "-" +
            (this.$store.state.selected.month - 1),
          "YYYY-MM"
        ).daysInMonth();
      }
    },

    prevMonthDaysVisible() {
      return Number(
        moment(
          this.$store.state.selected.year +
            "-" +
            this.$store.state.selected.month,
          "YYYY-MM"
        )
          .startOf("month")
          .format("E") - 1
      );
    },

    selected(){
        return this.$store.state.selected
    },
    selectedMonthData() {
      return this.$store.state.selectedMonthData;
    },
    user(){
      return this.$store.state.user
    },
    weekdays() {
      return this.$store.state.weekdays;
    }
  },
  methods: {
    getCurrentDate() {
      this.$store.commit("setCurrentDate");
    },

    loadFromDb() {
      fetch("http://localhost:3000/bookings")
        .then(function(response) {
          return response.json();
        })
        .then(result => {
          this.$store.commit("loadFromDb", result);
        });
    },
    logOut() {
      this.$store.commit("logOut");
    },
    monthUp() {
      this.$store.commit("monthUp");
    },

    monthDown() {
      this.$store.commit("monthDown");
    },

    toggleModal(date) {
      this.$store.commit("toggleModal", date);
    },
  }
};
</script>

<style>
.calendar-wrapper {
  margin: 0 auto;
  max-width: 900px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 50px;
  grid-auto-rows: 90px;
  grid-gap: 4px;
  
}

.date {
  cursor: pointer;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas: "date-number timeA timeA" "date-number timeB timeB" ". timeC timeC";
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  margin: 2px;
  transition: all 0.3s;
}

.date:hover{
  
  transform: scale(1.08);
  background-color:#e6e6e6;
}

.weekday {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  padding: 10px;
  max-height: 24px;
  margin: 2px;
}

.date-number {
  font-size: 24px;
  padding-top: 4px;
  padding-left: 4px;
}

.today{
  text-decoration: underline;
}

.date-hidden {
  cursor: pointer;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas: "date . ." "date . ." ". . .";
  justify-content: center;
  align-items: center;
  color: lightgrey;
  
  margin: 2px;
  border: 1px solid gray;
}

.time-a {
  grid-area: timeA;
  background-color: bisque;
}

.time-b {
  grid-area: timeB;
  background-color: bisque;
}

.time-c {
  grid-area: timeC;
  background-color: bisque;
}

.booked {
  background-color: red;
}

.your-booking {
  background-color: lightblue;
}

.checkmark{
  transform: scale(0.1);
  transition: all 2s;
}

.checkmark .show{
  transform: scale(5);
}




</style>