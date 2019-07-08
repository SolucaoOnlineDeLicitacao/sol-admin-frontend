<style scoped lang="scss">

.muted {
  font-style: oblique;
  color: $brownish-grey;
}

</style>


<template lang="pug">
.root(v-if="admin")
  headers(:title='admin.name')

  .container.admin
    .card
      .row
        .twelve.columns
          h4.title {{ this.$t('.title') }}

      .row
        .five.columns
          label {{ $t('models.admin.attributes.name') }}
          span {{ admin.name }}

        .five.columns
          label {{ $t('models.admin.attributes.email') }}
          span {{ admin.email }}

        .two.columns
          label {{ $t('models.admin.attributes.role') }}
          span {{ $t('models.admin.attributes.roles.' + admin.role) }}

      .covenants-container(v-if="covenants")
        .row
          .twelve.columns
            h5.title.mb-0 {{ this.$t('.covenants.title') }}
            span.muted {{ this.$t('.covenants.description') }}
        table.u-full-width
          thead
            tr
              th {{ $t('models.covenant.attributes.number') }}
              th {{ $t('models.covenant.attributes.name') }}

          tbody
            tr(v-for="covenant in covenants")
              td
                router-link.router-link(:to="{ name: 'covenant', params: { id: covenant.id } }" v-if="covenant")
                  | {{ covenant.number }}
              td
                router-link.router-link(:to="{ name: 'covenant', params: { id: covenant.id } }" v-if="covenant")
                  | {{ covenant.name }}


</template>


<script>
  import view from '@/view.vue'

  export default {
    name: 'admin',
    data () {
      return {
        i18nScope: 'admins.show',
        admin: null,
        params: null,
        covenants: null,
      }
    },

    methods: {
      getAdmin() {
        return this.$http.get('/administrator/admins/' + this.params.id)
          .then((response) => {
            this.admin = response.data
            this.covenants = response.data.covenants

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
      this.getAdmin()
    }
  }

</script>
