import NotFound from '@/components/not-found.vue'

import Login from '@/views/login.vue'
import editProfile from '@/views/profile/edit.vue'
import editPassword from '@/views/password/edit.vue'

import Home from '@/views/home.vue'

import Integrations from '@/views/integrations/index.vue'

import Notifications from '@/views/notifications/index.vue'

// CRUDS
import Admins from '@/views/admins/index.vue'
import Admin from '@/views/admins/show.vue'
import EditAdmin from '@/views/admins/edit.vue'
import NewAdmin from '@/views/admins/new.vue'

import Cooperatives from '@/views/cooperatives/index.vue'
import Cooperative from '@/views/cooperatives/show.vue'
import EditCooperative from '@/views/cooperatives/edit.vue'
import NewCooperative from '@/views/cooperatives/new.vue'

import Covenants from '@/views/covenants/index.vue'
import Covenant from '@/views/covenants/show.vue'
import EditCovenant from '@/views/covenants/edit.vue'
import NewCovenant from '@/views/covenants/new.vue'

import AllBiddings from '@/views/biddings/index.vue'
import Bidding from '@/views/biddings/show.vue'
import GlobalProposals from '@/views/covenants/biddings/proposals/index.vue'

import Contracts from '@/views/biddings/contracts/index.vue'
import Contract from '@/views/biddings/contracts/show.vue'


import Lots from '@/views/covenants/biddings/lots/index.vue'
import Proposals from '@/views/covenants/biddings/lots/proposals/index.vue'

import Group from '@/views/covenants/groups/show.vue'
import NewGroup from '@/views/covenants/groups/new.vue'
import EditGroup from '@/views/covenants/groups/edit.vue'

import Providers from '@/views/providers/index.vue'
import Provider from '@/views/providers/show.vue'
import EditProvider from '@/views/providers/edit.vue'
import NewProvider from '@/views/providers/new.vue'

import Items from '@/views/items/index.vue'
import Item from '@/views/items/show.vue'
import EditItem from '@/views/items/edit.vue'
import NewItem from '@/views/items/new.vue'

import Suppliers from '@/views/suppliers/index.vue'
import Supplier from '@/views/suppliers/show.vue'
import EditSupplier from '@/views/suppliers/edit.vue'
import NewSupplier from '@/views/suppliers/new.vue'

import Users from '@/views/users/index.vue'
import User from '@/views/users/show.vue'
import EditUser from '@/views/users/edit.vue'
import NewUser from '@/views/users/new.vue'

// reports
import Reports  from '@/views/reports/index.vue'
import GeneralReports  from '@/views/reports/general/index.vue'
import BiddingStatusReport from '@/views/reports/biddings/status.vue'
import ContractClassificationReport from '@/views/reports/contracts/classification.vue'


const namespace = null

const routes = [
  {
    name:      'home',
    path:      '', // root
    component: Home,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  // login
  // ----
  {
    name:      'login',
    path:      '/login',
    component: Login,
    meta:      {
      transition: { name: 'fade' }
    }
  },

  // password
  // ----
  {
    name:      'editPassword',
    path:      '/password/edit',
    component: editPassword,
    meta:      {
      auth:       false,
      transition: { name: 'fade' }
    }
  },

  // profile
  // ----
  {
    name:      'editProfile',
    path:      '/profile',
    component: editProfile,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },


  // integrations
  // ----
  {
    name:      'integrations',
    path:      '/integrations',
    component: Integrations,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },


  // admins
  // ----
  {
    name:      'admins',
    path:      '/admins',
    component: Admins,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'newAdmin',
    path:      '/admins/new',
    component: NewAdmin,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'admin',
    path:      '/admins/:id',
    component: Admin,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'editAdmin',
    path:      '/admins/:id/edit',
    component: EditAdmin,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  // cooperatives
  // ----
  {
    name:      'cooperatives',
    path:      '/cooperatives',
    component: Cooperatives,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'newCooperative',
    path:      '/cooperatives/new',
    component: NewCooperative,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'cooperative',
    path:      '/cooperatives/:id',
    component: Cooperative,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'editCooperative',
    path:      '/cooperatives/:id/edit',
    component: EditCooperative,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  // covenants
  // ----
  {
    name:      'covenants',
    path:      '/covenants',
    component: Covenants,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'newCovenant',
    path:      '/covenants/new',
    component: NewCovenant,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'covenant',
    path:      '/covenants/:id',
    component: Covenant,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'editCovenant',
    path:      '/covenants/:id/edit',
    component: EditCovenant,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },
  //biddings
  {
    name:      'allBiddings',
    path:      '/biddings',
    component: AllBiddings,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'bidding',
    path:      '/biddings/:id',
    component: Bidding,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },


  //biddings/contracts
 {
    name:      'contracts',
    path:      '/biddings/:bidding_id/contracts',
    component: Contracts,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'contract',
    path:      '/biddings/:bidding_id/contracts/:id',
    component: Contract,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

//covenants/biddings/proposals
  {
    name:      'globalProposals',
    path:      '/covenants/:covenant_id/biddings/:bidding_id/proposals',
    component: GlobalProposals,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

 //covenants/biddings/lots
  {
    name:      'lots',
    path:      '/covenants/:covenant_id/biddings/:bidding_id/lots',
    component: Lots,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

 //covenants/biddings/lots/proposals
  {
    name:      'proposals',
    path:      '/covenants/:covenant_id/biddings/:bidding_id/lots/:lot_id/proposals',
    component: Proposals,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },


  // covenants/groups
  {
    name:      'group',
    path:      '/covenants/:covenant_id/groups/:id',
    component: Group,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },


 {
    name:      'newGroup',
    path:      '/covenants/:covenant_id/groups/new',
    component: NewGroup,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },


 {
    name:      'editGroup',
    path:      '/covenants/:covenant_id/groups/:id/edit',
    component: EditGroup,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },


  // providers
  // ----
  {
    name:      'providers',
    path:      '/providers',
    component: Providers,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'newProvider',
    path:      '/providers/new',
    component: NewProvider,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'provider',
    path:      '/providers/:id',
    component: Provider,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'editProvider',
    path:      '/providers/:id/edit',
    component: EditProvider,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  // items
  // ----
  {
    name:      'items',
    path:      '/items',
    component: Items,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'newItem',
    path:      '/items/new',
    component: NewItem,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'item',
    path:      '/items/:id',
    component: Item,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'editItem',
    path:      '/items/:id/edit',
    component: EditItem,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },


  // suppliers
  // ----
  {
    name:      'suppliers',
    path:      '/suppliers',
    component: Suppliers,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'newSupplier',
    path:      '/suppliers/new',
    component: NewSupplier,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'supplier',
    path:      '/suppliers/:id',
    component: Supplier,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'editSupplier',
    path:      '/suppliers/:id/edit',
    component: EditSupplier,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },


  // users
  // ----
  {
    name:      'users',
    path:      '/users',
    component: Users,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'newUser',
    path:      '/users/new',
    component: NewUser,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'user',
    path:      '/users/:id',
    component: User,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  {
    name:      'editUser',
    path:      '/users/:id/edit',
    component: EditUser,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  // reports

 {
    name:      'reports',
    path:      '/reports',
    component: Reports,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },
 {
    name:      'generalReports',
    path:      '/general/reports',
    component: GeneralReports,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },
 {
    name:      'biddingStatusReport',
    path:      '/reports/biddings/status',
    component: BiddingStatusReport,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

 {
    name:      'contractClassificationReport',
    path:      '/reports/contracts/classification',
    component: ContractClassificationReport,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  // notifications
  // ----
  {
    name:      'notifications',
    path:      '/notifications',
    component: Notifications,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  // TODO componetnes específicos para rotas específicas!
  // Rails tem ErrorsController, com páginas dinâmicas em rotas específicas:
  // /401 - unauthorized (não autenticado)
  // /403 - forbidden (não tem permissão)
  // /404 - not found
  // /422 - falha de verificação CSRF e CORS
  // /500 - internal server error
  //

  // "catch-all" componente para rotas não encontradas (404):
  { path: '*', component: NotFound }
]


export { routes, namespace }
export default routes
