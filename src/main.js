import Vue from 'vue'
import App from './App'
import Home from './components/Hello'
import User from './components/User'
import Admin from './components/Admin'
import Reg from './components/Reg'
import New from './components/New'
import Detail from './components/Detail'
import Chat from './components/Chat'
import ChatAdmin from './components/ChatAdmin'
import VueRouter from 'vue-router'

const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.use(VueRouter)

const router = new VueRouter()

router.map({
  '/': {
    name: 'home',
    component: Home
  },
  '/user': {
    name: 'user',
    component: User
  },
  '/admin': {
    name: 'admin',
    component: Admin
  },
  '/reg': {
    name: 'reg',
    component: Reg
  },
  '/new': {
    name: 'new',
    component: New
  },
  '/edit/:id': {
    name: 'edit',
    component: New
  },
  '/chat/:id': {
    name: 'chat',
    component: Chat
  },
  '/chat/:id/:item': {
    name: 'chatitem',
    component: Chat
  },
  '/chatadmin/:id': {
    name: 'chatadmin',
    component: ChatAdmin
  },
  '/detail/:id': {
    name: 'detail',
    component: Detail
  }
})

router.start(App, '#app')

