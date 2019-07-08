<style scoped lang="scss">

  .navbar {
    background: linear-gradient(rgb(84, 124, 137), rgb(59, 91, 111));
    color: white;
    line-height: 56px;

    strong {
      float: left;
    }

    a {
      color: $white;
      text-decoration: none;

      &:hover,
      &:focus {
        color: $pinkish-grey;
      }
    }

    button {
      margin-top: 20px;
      margin-bottom: 0;

      color: $white;
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

  .notification-badge {
    position: absolute;
    top: -12px;
    right: -15px;
    height: 18px;
    min-width: 18px;
    padding: 0 4px;

    background-color: red;
    border-radius: 18px;
    color: white;
    font-size: 10px;
    line-height: 18px;
    text-align: center;
  }

  .notification-link {
    position: relative;

    .fa {
      font-size: 1.5em;
    }
  }

</style>


<template lang="pug">

  .navbar
    .container
      ul.menu
        li {{ this.$t('.app') }}
        li
          router-link.router-link(:to="{ name: 'home' }")
            | {{ this.$t('.home') }}

        li
          router-link.router-link(:to="{ name: 'users' }")
           | {{ this.$t('.users') }}
        li
          router-link.router-link(:to="{ name: 'cooperatives' }")
            | {{ this.$t('.cooperatives') }}

        li
          router-link.router-link(:to="{ name: 'providers' }")
            | {{ this.$t('.providers') }}

        li
          router-link.router-link(:to="{ name: 'items' }")
            | {{ this.$t('.items') }}

        li
          router-link.router-link(:to="{ name: 'covenants' }")
            | {{ this.$t('.covenants') }}

        li
          router-link.router-link(:to="{ name: 'integrations' }")
            | {{ this.$t('.integrations') }}

        li
          router-link.router-link(:to="{ name: 'allBiddings' }")
            | {{ this.$t('.biddings') }}

        li
          router-link.router-link(:to="{ name: 'biddingStatusReport' }")
            | {{ this.$t('.reports') }}

        li
          router-link.router-link.profile-link(:to="{ name: 'editProfile' }")
            i.fa.fa-user

        li
          router-link.router-link.notification-link(:to="{ name: 'notifications' }")
            i.fa.fa-bell
            .notification-badge(v-if="unreadsCount") {{ unreadsCount }}

      button.u-pull-right(type="button", data-action="logout", @click="logout")
        | {{ btnLogoutLabel }}

</template>


<script>

  export default {
    data () {
      return {
        i18nScope: 'navbar',
        unreadsCount: 0,
        interval: null,
        loggingOut: false,
      }
    },

    computed: {
      btnLogoutLabel() {
        return this.loggingOut ? this.$t('.button.logout.labelOngoing') : this.$t('.button.logout.label')
      }
    },

    methods: {
      logout() {
        this.loggingOut = true
        // SAMPLE
        // ----
        // It this app was a confidential app, it was required to authenticate with client credentials
        // before revoking an access token.
        // @see https://tools.ietf.org/html/rfc6749#section-2.1
        // @see https://github.com/doorkeeper-gem/doorkeeper/blob/8e8b9a0a675c2892a4b940b8ce5457727ad823b0/app/controllers/doorkeeper/tokens_controller.rb#L46
        //
        // let params = {
        //   token: app.auth.token,
        //   client_id: app.secrets.client.id,
        //   client_secret: app.secrets.client.secret
        // }
        let params = { token: app.auth.token }
        // return this.$http.delete('/logout')
        return this.$http.post('/oauth/revoke', params)
          .then((response) => {
            // apaga possíveis notificações de erro anteriores
            this.$notifications.clear()
            // atualiza token csrf
            // app.csrf.token = response.headers[app.csrf.HEADER.toLowerCase()]
            // desautentica no client - o que emite um evento de app @logout, ao
            // qual já estamos escutando! (veja created() hook)
            app.auth.logout()
            // e redireciona para onde deve!
            this.$router.push({ name: 'login' })
          })
          .catch((err) => {
            this.$notifications.error(this.$t('.notifications.logout.failure'))
            // TODO: implementar padrão de erro de JSONAPI
            let code = _.dig(err, 'response', 'error', 'code')
          })
          .then(() => {
            this.loggingOut = false
          })
      },

      fetchUnreadsCount() {
        return this.$http.get('/administrator/notifications/unreads_count')
          .then((response) => {
            this.unreadsCount = response.data.count

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      }
    },

    created: function () {
      this.fetchUnreadsCount();

      this.interval = setInterval(function () {
        this.fetchUnreadsCount();
      }.bind(this), 10000);
    },

    beforeDestroy: function(){
      clearInterval(this.interval);
    },

    watch:{
      $route (to, from){
        this.fetchUnreadsCount();
      }
    }
  }

</script>

