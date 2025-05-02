import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/global.css'
import '@/assets/css/theme/index.css'
import '@/assets/css/iconfont/iconfont.css'
import request from "@/utils/request";

// 引入 vue-i18n
import VueI18n from 'vue-i18n'

// 引入语言包
import zh from '@/locales/zh.json'
import en from '@/locales/en.json'

Vue.config.productionTip = false

Vue.prototype.$request = request
Vue.prototype.$baseUrl = process.env.VUE_APP_BASEURL

Vue.use(ElementUI, {size: "small"})
Vue.use(VueI18n)

// 初始化 i18n
const i18n = new VueI18n({
    locale: 'zh',  // 默认语言
    messages: {
        zh,
        en
    }
})

const savedLocale = localStorage.getItem('locale');
if (savedLocale) {
    i18n.locale = savedLocale;
}

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app')
