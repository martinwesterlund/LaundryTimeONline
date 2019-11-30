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

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
}
body{
margin: 0;
  padding: 0;
}
</style>
