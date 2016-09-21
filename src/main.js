import Vue from 'vue'
import App from './App'
import Home from './components/Hello'
import User from './components/User'
import Reg from './components/Reg'
import New from './components/New'
import Detail from './components/Detail'
import VueRouter from 'vue-router'

const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.use(VueRouter)

const router = new VueRouter()

router.map({
  '/': {
    component: Home
  },
  '/user': {
    component: User
  },
  '/reg': {
    component: Reg
  },
  '/new': {
    component: New
  },
  '/detail/:id': {
    component: Detail
  }
})

router.start(App, '#app')

