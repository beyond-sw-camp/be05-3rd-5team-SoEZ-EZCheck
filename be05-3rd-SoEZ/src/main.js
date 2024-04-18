import { createApp } from 'vue'

import 'bootstrap/dist/css/bootstrap.css'

import App from './App.vue'
import routers from './routers/router'

//createApp(App).mount('#app')
// const app = createApp(App)
// app.use(routers)
// app.mount('#app')
createApp(App).use(routers).mount('#app')