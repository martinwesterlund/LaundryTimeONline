import Vue from 'vue'
import App from './App.vue'
import { store } from './store/store'

// if(navigator.serviceWorker) {
//   navigator.serviceWorker.register('/sw.js')
//   .then((reg) => console.log('ServiceWorker registered', reg))
//   .catch((err) => console.log('ServiceWorker not registered', err));
// }

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
