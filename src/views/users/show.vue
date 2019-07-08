<style scoped lang="scss">

.title {
  margin-top: 20px;
}

.user {
  .row {
    margin-bottom: 10px;
  }
}

</style>


<template lang="pug">
.root(v-if="user")
  headers(:title='user.name')

  .container.user
    .card
      .row
        .twelve.columns
          h4.title {{ $t('.title') }}

      .row
        .six.columns
          label {{ $t('models.user.attributes.name') }}
          span {{ user.name }}

        .three.columns
          label {{ $t('models.user.attributes.email') }}
          span {{ user.email }}

        .three.columns
          label {{ $t('models.user.attributes.phone') }}
          span {{ user.phone }}

      .row
        .six.columns
          label {{ $t('models.user.attributes.cooperativeName') }}
          router-link.router-link(:to="{ name: 'cooperative', params: { id: user.cooperative_id }  }")
            | {{ user.cooperative_name }}

        .three.columns
          label {{ $t('models.user.attributes.roleTitle') }}
          span {{ user.role_title }}

        .three.columns
          label {{ $t('models.user.attributes.cpf') }}
          span {{ user.cpf }}


</template>


<script>
  export default {
    name: 'user',
    data () {
      return {
        i18nScope: 'users.show',
        user: null,
        params: null,
      }
    },

    methods: {
      getUser() {
        return this.$http.get('/administrator/users/' + this.params.id)
          .then((response) => {
            this.user = response.data

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      parseRoute() {
        let params = {}

        params.id = this.$params.asInteger(this.$route.params.id)

        this.params = params
      }

    },

    created: function () {
      this.parseRoute()
      this.getUser()
    }
  }

</script>
