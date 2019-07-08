<style scoped lang="scss">

.title {
  margin-top: 20px;
}

.supplier {
  .row {
    margin-bottom: 10px;
  }
}

</style>


<template lang="pug">
.root(v-if="supplier")
  headers(:title='supplier.name')

  .container.supplier
    .card
      .row
        .twelve.columns
          h4.title {{ $t('.title') }}

      .row
        .six.columns
          label {{ $t('models.supplier.attributes.name') }}
          span {{ supplier.name }}

        .three.columns
          label {{ $t('models.supplier.attributes.email') }}
          span {{ supplier.email }}

        .three.columns
          label {{ $t('models.supplier.attributes.phone') }}
          span {{ supplier.phone }}

      .row
        .six.columns
          label {{ $t('models.supplier.attributes.providerName') }}
          router-link.router-link(:to="{ name: 'provider', params: { id: supplier.provider_id }  }")
            | {{ supplier.provider_name }}

        .three.columns
          label {{ $t('models.supplier.attributes.cpf') }}
          span {{ supplier.cpf }}


</template>


<script>
  export default {
    name: 'supplier',
    data () {
      return {
        i18nScope: 'suppliers.show',
        supplier: null,
        params: null,
      }
    },

    methods: {
      getSupplier() {
        return this.$http.get('/administrator/suppliers/' + this.params.id)
          .then((response) => {
            this.supplier = response.data

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
      this.getSupplier()
    }
  }

</script>
