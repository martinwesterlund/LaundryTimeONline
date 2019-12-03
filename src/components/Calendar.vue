<template>
  <div>
    <Checkmark v-if="showCheckmark"></Checkmark>
    <ReservationPage></ReservationPage>
    <div id="cal-bg"></div>
    <div id="info-field">
      <header>
        
        <div id="app-name">
          <img src="../assets/logo.png" alt="">
          <div>Tvättid Online</div>
        </div>
        <div id="todays-date">
        Dagens datum: {{current.day}} {{ months[current.month -1] }} {{current.year}}
        <button @click="getCurrentDate">Idag</button>
      </div>
      <div id='inlogged-user'>
        <font-awesome-icon icon="user" /> {{user}}
        <button @click="logOut">Logga ut</button>
      </div>
      </header>
    

      <div class='selected-panel'>
        <div class='arrow'
          @click="monthDown"
          v-if="!(selected.month < current.month && selected.year <= current.year)"
        >&lt;</div>
        <div id='selected-month'>{{ months[selected.month -1] }} {{selected.year}}</div>
        
        <div class='arrow'
          @click="monthUp"
        >&gt;</div>
      </div>
    </div>
    <div class="calendar-wrapper">
      <div class="weekday" v-for="(weekday, index) in weekdays" :key="'weekday'+index">{{ weekday }}</div>

      <div class="date-hidden" v-for="(n, index) in prevMonthDaysVisible" :key="'prev'+index">
        <div class="date-number">{{ n + numberOfDaysInPrevMonth - prevMonthDaysVisible }}</div>
      </div>

      <div
        class="date"
        @click="toggleModal(date)"
        v-for="(date, index) in selectedMonthData"
        :key="'current'+index"
      >
        <div
          class="date-number"
          :class="{today: '' + current.year + current.month + current.day == '' + selected.year + selected.month + date.date}"
        >{{ date.date }}</div>
        <div class="time-areas">
          <div
            class="time-a"
            :class="[Object.entries(date.timePeriods[0].booking).length > 0 ? 'booked' : '', (date.timePeriods[0].booking.name === user && Object.entries(date.timePeriods[0].booking).length > 0) ? 'your-booking' : '']"
          >8-12</div>
          <div
            class="time-b"
            :class="[Object.entries(date.timePeriods[1].booking).length > 0 ? 'booked' : '', (date.timePeriods[1].booking.name === user && Object.entries(date.timePeriods[1].booking).length > 0) ? 'your-booking' : '']"
          >12-16</div>
          <div
            class="time-c"
            :class="[Object.entries(date.timePeriods[2].booking).length > 0 ? 'booked' : '', (date.timePeriods[2].booking.name === user && Object.entries(date.timePeriods[2].booking).length > 0) ? 'your-booking' : '']"
          >16-20</div>
        </div>
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
import Checkmark from "./Checkmark.vue";
export default {
  created: function() {
    this.loadFromDb();
  },
  components: {
    ReservationPage,
    Checkmark
  },
  computed: {
    bookings() {
      return this.$store.state.bookings;
    },

    current() {
      return this.$store.state.current;
    },

    months() {
      return this.$store.state.months;
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

    selected() {
      return this.$store.state.selected;
    },
    selectedMonthData() {
      return this.$store.state.selectedMonthData;
    },
    showCheckmark() {
      return this.$store.state.showCheckmark;
    },
    user() {
      return this.$store.state.user;
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
    }
  }
};
</script>

<style lang="scss">
$button-color: #1d1515;
$button-color-hover: #523b3b;

body {
  background-color: #dbd6d6;
}

#cal-bg {
  position: absolute;
  /* background-color: #e6e7e1; */
  background: url(../assets/bg.jpg);
  width: 100%;
  height: 100%;
  z-index: -9999;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  animation: fadeout 2s forwards;
}

#info-field {
  color: #1d1515;
}

/* #info-field div {
  padding: 5px;
} */

header{
  color: whitesmoke;
  display: flex;
  background-color: #1d1515;
  justify-content: center;
  align-items: center;
  height: 50px;
  font-size: 16px;
  animation: header-slide 1s;
}

header button{
  background-color: $button-color;
  border: 1px solid whitesmoke;
  color: whitesmoke;
  padding: 7px;
  margin: 5px 15px 0px;
  cursor: pointer;
  transition: all 0.25s;
  outline: 0;
}

header button:hover{
  background-color: $button-color-hover;
}

#app-name{
  width: 200px;
  display: flex;
  align-items: center;
  font-family: 'Staatliches', cursive;
  font-size: 18px;
  margin-left: 20px;
}

#app-name img{
  height: 20px;
  margin-right: 10px;
}
#app-name div{
  margin-top: 2px;
}

#todays-date{
  margin: auto auto auto auto;
}

#inlogged-user{
  width: 200px;
}
.calendar-wrapper {
  margin: 0 auto;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 30px;
  grid-auto-rows: 90px;
  grid-row-gap: 5px;
  animation: fadein 2s;
}

.selected-panel{
  display:flex;
  justify-content:center;
  align-items: center;
  margin: 0 auto;
  padding-top: 10px;
  font-size:24px;
  font-weight: bold;
  color:#1d1515
}

.arrow{
  cursor: pointer;
  font-size:32px;
}

.arrow:hover{
  color: #523b3b;
}


#selected-month{
width:200px;
}

.date {
  display: flex;
  margin: 0 auto;
  cursor: pointer;
  height: 80px;
  max-width: 140px;
  background-color: #1d1515;
  box-shadow: 0px 2px 3px #000;
  transition: all 0.25s;
  border-radius: 2px;
}
.date-number {
  position: relative;
  top: 15px;
  left: -25px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #1d1515;
  background-color: #74d8dc;
  min-width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0px 2px 3px #000;
  opacity: 1;
}
.today {
  font-weight: bold;
  background-color: #f28e8e;
}
.time-areas {
  width: 100%;
  margin-right: 25px;
  display: flex;
  flex-direction: column;
  font-weight: bold;
  font-size: 16px;
  color: #d4dbda;
}

.time-a {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25%;
  margin-top: auto;
  border-bottom: 1px solid #595959;
}

.time-b {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25%;
  margin: 2px 0;
}

.time-c {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25%;
  margin-bottom: auto;
  border-top: 1px solid #595959;
}

.booked {
  color: #d40000;
}

.your-booking {
  color: #9795ff;
}

.date:hover {
  transform: scale(1.02);
  background-color: #523b3b;
}

.weekday {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding-top: 15px;
  max-height: 24px;
  max-width: 120px;
  color: #1d1515;
  font-size: 18px;
}

.date-hidden {
  z-index: -3;
  display: flex;
  margin: 0 auto;
  height: 80px;
  min-width: 120px;
  background-color: #1d1515;
  box-shadow: 0px 2px 3px #000;
  opacity: 0.3;
}

.checkmark {
  transform: scale(0.1);
  transition: all 2s;
}

.checkmark .show {
  transform: scale(5);
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeout {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes header-slide {
  from {
    height: 0px;
  }
  to {
    height: 50px;
  }
}
</style>