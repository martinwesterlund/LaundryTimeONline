<template>
  <div>
    <div id="header">
      
      <div id="login-bg"></div>
      <img src="../assets/logo.png" alt="logo">
      <div class="header-text">Tvättid online</div>
      
      <div id="login-form">
        <input class="login-field" type="text" v-model="userName" placeholder="Användarnamn" />
        <input class="login-field" type="password" v-model="password" placeholder="Lösenord" />
        <button @click="loginUser()" class="btn">Logga in</button>
        <div class="error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    error() {
      return this.$store.state.error;
    },
    password: {
      set(password) {
        this.$store.commit("addPassword", password);
      },
      get() {
        return this.$store.state.password;
      }
    },
    showLoginForm() {
      return this.$store.state.showLoginForm;
    },
    userName: {
      set(userName) {
        this.$store.commit("addUserName", userName);
      },
      get() {
        return this.$store.state.userName;
      }
    }
  },
  methods: {
    loginUser() {
      fetch("http://localhost:3000/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userName: this.userName,
          password: this.password
        })
      }).then(result => {
        this.$store.commit("logIn", result.status);
      });
    },
    toggleLoginForm(){
        this.$store.commit('toggleLoginForm')
    }
  }
};
</script>

<style lang='scss' scoped>
$button-color: #1d1515;

* {
  margin: 0;
  padding: 0;
}

#header {
  min-height: 100vh;
  color: #fff;
}

img{
  
  margin: 25vh auto 0 auto;
  width: 15vh;
  animation: fadein 2s, slide-in 1s;
}

#login-bg {
  position: absolute;
  background-color: #e6e7e1;
  background:url(../assets/bg.jpg);
  width: 100%;
  height: 100%;
  z-index: -1;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.header-text {
  color: whitesmoke;
  font-size: 54px;
  font-family: 'Staatliches', cursive;
  animation: fadein 2s, text-slide-in 1s;
}

.btn {
  background: $button-color;
  cursor: pointer;
  display: inline-flex;
  color: #fff;
  text-decoration: none;
  padding: 1em 2em;
  border: 2px solid #666;
  transition: 0.5s;
  margin: 2px;
  outline: 0;
  justify-content: center;
}

.btn:hover {
  background: #333;
  color: whitesmoke;
}

#login-form {
  display:flex;
  margin: 0 auto;
  flex-direction: column;
  width: 250px;
  font-size: 18px;
  color: black;
}

.login-field {
  padding: 1em 1em;
  margin: 2px;
}

.error {
  color: red;
}

.fade-out{
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 1s, opacity 1s linear;
}
@keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}

@keyframes slide-in {
  from { margin-top: 20vh;
         }
  to   { margin-top: 25vh;
         }
}

@keyframes text-slide-in {
  from { margin-top: -20px;
         }
  to   { margin-top: 0;
         }
}
</style>