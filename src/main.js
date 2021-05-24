import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import './theme/index.css';
import echarts from 'echarts';
import VeLine from 'v-charts/lib/line.common'
import VePie from 'v-charts/lib/pie.common'
import VeRing from 'v-charts/lib/ring.common'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.prototype.$echart = echarts;

Vue.component(VeLine.name, VeLine)
Vue.component(VePie.name, VePie)
Vue.component(VeRing.name, VeRing)

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});