<template>
  <div v-if="showModal" class="modalDialog">
    <div>
      <div id="close" @click="closeModal">X</div>
      <h2>{{selected.day}} {{ months[selected.month -1] }} {{ selected.year }}</h2>

        <!-- <div>{{selected.timePeriods}}</div> -->
      <div class='time-in-modal' v-for="(timePeriod, index) in selectedMonthData[selected.day -1].timePeriods" v-bind:key="'timePeriod'+ index">
          <div>{{ timePeriod.time }}</div>
          <div v-if='timePeriod.booking.name'>Bokad av: {{ timePeriod.booking.name }}</div>
          <p v-if="timePeriod.booking.message">Meddelande: {{timePeriod.booking.message }}</p>
          <button
            v-if="timePeriod.booking.name === user"
            @click="deleteBooking(timePeriod.booking)"
          >Avboka tid</button>
          <div v-if="Object.entries(timePeriod.booking).length === 0">
          <button v-if="!showSubmitForm" @click='toggleSubmitForm(timePeriod.label)'>Boka tid</button>
          <div v-if='showSubmitForm && booking.booked.label === timePeriod.label'>
            <textarea cols="30" rows="3" placeholder="Eventuellt meddelande" v-model="booking.message"></textarea>
            <button @click="toggleSubmitForm(timePeriod.label)">Avbryt</button>
            <input type="submit" @click="addBooking(booking.booked.label)" value="OK" />
          </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    booking(){
      return this.$store.state.booking
    },
    showModal() {
      return this.$store.state.showModal;
    },
    showSubmitForm(){
      return this.$store.state.showSubmitForm
    },
    selected(){
      return this.$store.state.selected;  
    },
    selectedMonthData() {
      return this.$store.state.selectedMonthData;
    },
    months(){
      return this.$store.state.months;
    },
    user(){
      return this.$store.state.user
    }
  },
  methods: {
    addBooking(label) {
      this.$store.commit("bookTime");

      fetch("http://localhost:3000/bookings", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date: this.booking.date,
          name: this.user,
          booked: label,
          message: this.booking.message
        })
      }).then(this.loadFromDb);
    },

    deleteBooking(booking) {
      fetch("http://localhost:3000/bookings", {
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date: booking.date,
          name: this.user,
          booked: booking.booked
        })
      })
        .then(this.loadFromDb)
        .then(() => this.$store.commit("clearSelectedDate"));
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
    
    toggleSubmitForm(label){
      this.$store.commit('toggleSubmitForm', label)
    },
    closeModal() {
      this.$store.commit('closeModal');
    },

  }
};
</script>

<style>
.modalDialog {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 99999;
}

.modalDialog > div {
  z-index: 999999;
  width: 400px;
  position: relative;
  margin: 10% auto;
  padding: 5px 20px 13px 20px;
  border-radius: 10px;
  background: #fff;
  pointer-events: auto;
}
#close {
  cursor: pointer;
  background: #606061;
  color: #ffffff;
  line-height: 25px;
  position: absolute;
  right: -12px;
  text-align: center;
  top: -10px;
  width: 24px;
  text-decoration: none;
  font-weight: bold;
  border-radius: 12px;
  box-shadow: 1px 1px 3px #000;
}
#close:hover {
  background: #ff70ff;
}

.time-in-modal {
  border: 1px solid black;
  padding: 10px;
  margin: 10px;
  font-size: 18px;
}

.time-in-modal * {
  margin: 10px
}

.time-in-modal p{
  font-style: italic;
}

</style>