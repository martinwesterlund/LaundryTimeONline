<template>
  <div>
    <div id="header">
      <div id="login-bg"></div>
      <div class="header-text">Tvättid online</div>
      <div id="login-form">
        <input type="text" v-model="userName" placeholder="Användarnamn" />
        <input type="password" v-model="password" placeholder="Lösenord" />
        <button @click="loginUser()" class="btn">Logga in</button>
        <div class='error'>{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    
    userName: {
      set(userName) {
        this.$store.commit("addUserName", userName);
      },
      get() {
        return this.$store.state.userName;
      }
    },
    password: {
      set(password) {
        this.$store.commit("addPassword", password);
      },
      get() {
        return this.$store.state.password;
      }
    },

    error(){
      return this.$store.state.error
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
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

#header {
  min-height: 100vh;
  color: #fff;
}

#login-bg {
  position: absolute;
  background: url(../assets/laundry.jpg);
  width: 100%;
  height: 100vh;
  opacity: 0.4;
  z-index: -1;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.header-text {
  color: black;
  font-size: 72px;
  padding-top: 30vh;
}

.btn {
  cursor: pointer;
  display: inline-flex;
  background: #333;
  color: #fff;
  text-decoration: none;
  padding: 1em 1em;
  border: 1px solid #666;
  margin: 0.5em 0;
  transition: 1s;
}

.btn:hover {
  background: #eaeaea;
  color: #333;
}

#login-form {
  font-size: 18px;
  color: black;

  padding: 2vh;
}

.error{
  font-weight: bold;
  color: red;
}
</style>