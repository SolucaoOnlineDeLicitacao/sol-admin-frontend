<style scoped lang="scss">

  #view {
    height: 100%;
    width: 100%;
  }

  .navbar {
    background-color: #212529;
    color: white;

    strong {
      float: left;
    }
  }

  .menu {
    list-style: none;
    margin: 0;

    li {
      margin: 0;
      padding: 10px;
      float: left;
    }
  }

  .loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999; // TODO: extrair em _z-index.scss
  }

  .notifications {
    position: fixed;
    top: 6px; // tamanho do loading (4px) + extra (2px)
    left: 8px;
    right: 8px;
    z-index: 999; // TODO: extrair em _z-index.scss
  }

  .card-container {
    padding: 50px;

    background-color: white;
    border-radius: 5px;
  }

</style>

<style lang="scss">
  html,
  body {
   background-color: $pale-grey;
  }
</style>

<template lang="pug">

  #view
    navbar(:key="$route.fullPath" v-if="$auth.isAuthenticated()")

    loading.loading
    notifications.notifications
    transition(:name="transition.name", :mode="transition.mode")
      router-view

</template>


<script>

  const DEFAULT_ROUTE_TRANSITION_NAME = 'none'
  const DEFAULT_ROUTE_TRANSITION_MODE = 'out-in'

  import auth from './lib/core/modules/auth'

  export default {
    data() {
      return {
        transition: {
          name: DEFAULT_ROUTE_TRANSITION_NAME,
          mode: DEFAULT_ROUTE_TRANSITION_MODE
        }
      }
    },

    watch: {
      $route(to, from) {
        // definindo transição entre rotas
        this.transition = {
          name: _.dig(to, 'meta', 'transition', 'name') || DEFAULT_ROUTE_TRANSITION_NAME,
          mode: _.dig(to, 'meta', 'transition', 'mode') || DEFAULT_ROUTE_TRANSITION_MODE
        }
      }
    },

    beforeCreate: function() {
      if (auth.user == null) return

      this.$i18n.locale = auth.user.locale
    }
  }

</script>

