import Home from './components/home.vue'
import Login from './components/Login.vue'
import Add from './components/Add.vue'

import {createWebHistory,createRouter} from 'vue-router'
import Updatedby from './components/updatedby.vue'
import Node from './components/Node.vue'
import AddNode from './components/AddNode.vue'
import updatenode from './components/updatenode.vue'






const routes=[{
    name:'home',
    component:Home,
    path:'/home',

},
{
    name:'Login',
    component:Login,
    path:'/'
  },
  {
    name:'Add',
    component:Add,
    path:'/Add'
  },
  {
    name:'updatedby',
    component:Updatedby,
    path:'/updatedby/:id'
  },
  {
    name:'Node',
    component:Node,
    path:'/node'
  }, {
    name:'AddNode',
    component:AddNode,
    path:'/AddNode'
  },
  {
    name:'updatednode',
    component:updatenode,
    path:'/updatednode/:id'
  },


]
const router=createRouter({
  history:createWebHistory(),
  routes
  })

  export default router;