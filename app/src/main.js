import Vue from 'vue'
import store from '@/store'
import App from '@/App'
import { onReady } from '@/utils'

if (process.env.NODE_ENV === 'development') {
  new Vue({
    el: '#kindle-books-manager-app',
    store,
    components: { App },
    template: '<App/>'
  })
} else {
  onReady(() => {
    window.kbm = new Vue({
      el: '#kindle-books-manager-app',
      store,
      components: { App },
      template: '<App/>'
    })
  })
}
