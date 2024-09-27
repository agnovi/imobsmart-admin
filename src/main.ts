import { createApp } from 'vue'
import Toast from 'vue-toastification'
import App from './App.vue'
import router from './router'
import FloatingVue from 'floating-vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'
import { vMaska } from 'maska'
import VueEasyLightbox from 'vue-easy-lightbox'
import money from 'v-money3'
import DashboardPlugin from './plugins/globalComponents'
import vSelect from 'vue-select'
import {
  // Directives
  vTooltip,
  vClosePopper,
  // Components
  Dropdown,
  Tooltip,
  Menu
} from 'floating-vue'
import 'vue-select/dist/vue-select.css'
import './assets/main.css'
import 'floating-vue/dist/style.css'
import 'vue-toastification/dist/index.css'
import 'floating-vue/dist/style.css'
import './assets/main.css'
import 'floating-vue/dist/style.css'
import 'vue-toastification/dist/index.css'
// import 'sweetalert2/dist/sweetalert2.min.css'
import '../node_modules/nprogress/nprogress.css'
import PdfApp from 'vue3-pdf-app'
import 'vue3-pdf-app/dist/icons/main.css'

import DashboardLayout from './components/DashboardLayout.vue'
import EmptyLayout from './components/EmptyLayout.vue'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.directive('tooltip', vTooltip)
app.directive('close-popper', vClosePopper)
app.component('VDropdown', Dropdown)
app.component('VTooltip', Tooltip)
app.component('VMenu', Menu)
app.component('PdfApp', PdfApp)
app.use(pinia)
app.use(VueEasyLightbox)
app.use(DashboardPlugin)
app.use(Toast)
app.use(money)
app.directive('maska', vMaska)
app.use(FloatingVue, { container: '#app' })
app.component('DefaultLayout', DashboardLayout)
app.component('VSelect', vSelect)
app.component('EmptyLayout', EmptyLayout)
app.use(router)
app.mount('#app')
