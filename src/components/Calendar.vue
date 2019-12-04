<template>
  <div>
    <Checkmark v-if="showCheckmark"></Checkmark>
    <ReservationPage></ReservationPage>
    <div id="cal-bg"></div>
    <div id="info-field">
      <header>
        <div id="todays-date">
          {{current.day}} {{ months[current.month -1] }} {{current.year}}
          <button
            @click="getCurrentDate"
          >Idag</button>
        </div>

        <div id="app-name">
          <img src="../assets/logo.png" alt />
          <div>Tvättid Online</div>
        </div>

        <div id="inlogged-user">
          <font-awesome-icon icon="user" />
          Inloggad som: {{user}}
          <button @click="logOut">Logga ut</button>
        </div>
      </header>

      <div class="selected-panel">
        <div
          class="arrow"
          @click="monthDown"
          v-if="!(selected.month < current.month && selected.year <= current.year)"
        >&lt;</div>
        <div id="selected-month">{{ months[selected.month -1] }} {{selected.year}}</div>

        <div class="arrow" @click="monthUp">&gt;</div>
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
          ref="date-number"
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

    hover(date) {
      this.$store.commit("hover", date);
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
$button-color-hover: #525252;

body {
  background-color: #ffffff;
}

#cal-bg {
  position: absolute;
  background: url(../assets/bg.jpg);
  width: 100%;
  height: 100%;
  z-index: -9999;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  animation: fadeout 1s forwards;
}

#info-field {
  color: #1d1515;
}

header {
  color: whitesmoke;
  display: flex;
  background-color: #1d1515;
  justify-content: center;
  align-items: center;
  height: 50px;
  font-size: 16px;
  animation: header-slide 1s;
}

header button {
  background-color: $button-color;
  border: 1px solid whitesmoke;
  color: whitesmoke;
  padding: 7px;
  margin: 5px 15px;
  cursor: pointer;
  transition: all 0.25s;
  outline: 0;
}

header button:hover {
  background-color: $button-color-hover;
}

#app-name {
  width: 33%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Staatliches", cursive;
  font-size: 18px;
}

#app-name img {
  height: 20px;
  margin-right: 10px;
}
#app-name div {
  margin-top: 2px;
}

#todays-date {
  width: 33%;
}

#inlogged-user {
  width: 33%;
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

.selected-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding-top: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #1d1515;
}

.arrow {
  cursor: pointer;
  font-size: 32px;
}

.arrow:hover {
  color: #523b3b;
}

#selected-month {
  width: 200px;
}

.date {
  display: flex;
  margin: 0 auto;
  cursor: pointer;
  height: 80px;
  max-width: 140px;
  background-color: #1d1515;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.12),
    0 4px 4px rgba(0, 0, 0, 0.12), 0 8px 8px rgba(0, 0, 0, 0.12),
    0 16px 16px rgba(0, 0, 0, 0.12);
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
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
  opacity: 1;
}
.today {
  box-sizing: border-box;
  font-weight: bold;
  background-color: #ffffff;
  border: 3px solid #74d8dc;
}
.time-areas {
  width: 100%;
  margin-right: 25px;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #d4dbda;
}

.time-a {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25%;
  margin-top: auto;
  border-bottom: 1px solid #595959;
  box-sizing: border-box;
}

.time-b {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25%;
  margin: 2px 0;
}

.time-c {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25%;
  margin-bottom: auto;
  border-top: 1px solid #595959;
}

.booked {
  color: #595959;
}

.your-booking {
  color: #69b6d5;
  font-weight: bold;
}

.date:hover {
  transform: translateY(-4px);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.06), 0 2px 2px rgba(0, 0, 0, 0.06),
    0 4px 4px rgba(0, 0, 0, 0.06), 0 8px 8px rgba(0, 0, 0, 0.06),
    0 16px 16px rgba(0, 0, 0, 0.06);
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
  min-width: 110px;
  background-color: #1d1515;
  box-shadow: 0px 2px 3px #000;
  opacity: 0.1;
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

//MEDIA QUERIES

//MOBILE
@media only screen and (max-width: 480px) {
  header {
    height: 100px;
    font-size: 12px;
    justify-items: space-between;
  }

  #app-name {
    margin: 0px;
  }

  #app-name img {
    width: 50px;
    height: 50px;
    margin: 0px;
  }

  #app-name div {
    display: none;
  }

  .selected-panel {
    margin: 15px 0px 15px;
  }

  .calendar-wrapper {
    margin: 20px auto 0px;
    max-width: 370px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 30px;
    grid-auto-rows: 72px;
    grid-row-gap: 2px;
    animation: fadein 2s;
  }

  .weekday {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    max-height: 24px;
    max-width: 40px;
    color: #1d1515;
    font-size: 12px;
    padding-bottom: 25px;
    padding: 0;
  }

  .date {
    display: flex;
    justify-content: center;
    cursor: pointer;
    height: 50px;
    width: 42px;
    background-color: #1d1515;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.12),
      0 4px 4px rgba(0, 0, 0, 0.12), 0 8px 8px rgba(0, 0, 0, 0.12),
      0 16px 16px rgba(0, 0, 0, 0.12);
    transition: all 0.25s;
    border-radius: 2px;
  }
  .date-number {
    position: relative;
    top: -15px;
    left: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #1d1515;
    background-color: #74d8dc;
    min-width: 30px;
    height: 30px;
    border-radius: 50%;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
    opacity: 1;
  }
  .today {
    background-color: #ffffff;
    box-sizing: border-box;
    font-weight: bold;
    border: 2px solid #74d8dc;
  }
  .time-areas {
    display: flex;
    margin-top: 15px;
    width: 100px;
    padding: 0;
    font-size: 8px;
    color: #d4dbda;
  }

  .time-a {
    width: 35px;
    border: none;
    margin: 0;
    padding: 2px;
  }

  .time-b {
    display: flex;
    width: 32px;
    border: none;
    margin: 0;
    padding: 2px;
  }

  .time-c {
    display: flex;
    width: 35px;
    border: none;
    margin: 0;
    padding: 2px;
  }

  .date-hidden {
    display: flex;
    justify-content: center;
    z-index: -3;
    height: 50px;
    min-width: 42px;
    background-color: #1d1515;
    box-shadow: 0px 2px 3px #000;
    opacity: 0.1;
  }

  .date-hidden .date-number {
    left: -11px;
  }

  @keyframes header-slide {
    from {
      height: 0px;
    }
    to {
      height: 100px;
    }
  }
}
</style>