<template>
  <div id="app">
    <Login v-if='!user'></Login>
    <Calendar v-if='user'></Calendar>
  </div>
</template>

<script>
import Calendar from "./components/Calendar.vue";
import Login from "./components/Login.vue"


export default {
  name: "app",
  components: {
    Calendar,
    Login
  },
  computed: {
    user(){
      return this.$store.state.user
    }
  },
  created() {
    this.$store.commit("setCurrentDate");
  }
  
};
</script>

<style lang='scss'>
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
@import url('https://fonts.googleapis.com/css?family=Staatliches&display=swap');
@import url('https://fonts.googleapis.com/css?family=Reem+Kufi|Staatliches&display=swap');
@import url('https://fonts.googleapis.com/css?family=Libre+Franklin&display=swap');

$button-color: #1d1515;

#app {
  // font-family: 'Reem Kufi', sans-serif;
  // font-family: 'Staatliches', cursive;
  // font-family: 'Roboto', sans-serif;
  font-family: 'Libre Franklin', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
}
body{
margin: 0;
  padding: 0;
}

// #calendar {
//   animation: fadein 2s;
// }

button, input{
  font-family: 'Roboto', sans-serif;
}



@keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}

</style>
