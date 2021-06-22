<style scoped lang="scss">

.title {
  margin-top: 20px;
}

.cooperative {
  > .row {
    margin-bottom: 10px;
  }
}

</style>


<template lang="pug">
.root(v-if="cooperative")
  headers(:title='cooperative.name')

  .container.cooperative
    .card
      .row
        .twelve.columns
          h4.title {{ $t('.title') }}

      .row
        .six.columns
          label {{ $t('models.cooperative.attributes.name') }}
          span {{ cooperative.name }}

        .six.columns
          label {{ $t('models.cooperative.attributes.cnpj') }}
          span {{ cooperative.cnpj }}

      .row
        .twelve.columns
          h4.title {{ $t('models.address.one') }}

      .row
        .eight.columns
          label {{ $t('models.address.attributes.address') }}
          span {{ address.address }}

        .four.columns
          label {{ $t('models.address.attributes.number') }}
          span {{ address.number }}

      .row
        .six.columns
          label {{ $t('models.address.attributes.neighborhood') }}
          span {{ address.neighborhood }}

        .three.columns
          label {{ $t('models.address.attributes.cityName') }}
          span {{ address.city_name }}

        .three.columns
          label {{ $t('models.address.attributes.cep') }}
          span {{ address.cep }}

      .row
        .six.columns
          label {{ $t('models.address.attributes.complement') }}
          span {{ address.complement || $t('messages.not_informed') }}

        .six.columns
          label {{ $t('models.address.attributes.referencePoint') }}
          span {{ address.reference_point }}

      .row
        .six.columns
          label {{ $t('models.address.attributes.phone') }}
          span {{ address.phone || $t('messages.not_informed') }}

        .six.columns
          label {{ $t('models.address.attributes.email') }}
          span {{ address.email || $t('messages.not_informed') }}

      hr

      .row
        .twelve.columns
          h4.mt-0.title {{ $t('models.legal_representative.one') }}

      .row
        .eight.columns
          label {{ $t('models.legal_representative.attributes.name') }}
          span {{ legal_representative.name }}

        .four.columns
          label {{ $t('models.legal_representative.attributes.nationality') }}
          span {{ legal_representative.nationality }}

      .row
        .three.columns
          label {{ $t('models.legal_representative.attributes.civilState') }}
          span {{ $t('models.legal_representative.attributes.civil_states.' + legal_representative.civil_state) }}

        .three.columns
          label {{ $t('models.legal_representative.attributes.rg') }}
          span {{ legal_representative.rg }}

        .three.columns
          label {{ $t('models.legal_representative.attributes.cpf') }}
          span {{ legal_representative.cpf }}

        .three.columns
          label {{ $t('models.legal_representative.attributes.validUntil') }}
          span {{ legal_representative.valid_until }}

      .row
        .twelve.columns
          h5.title {{ $t('models.address.one') }}
      .row
        .eight.columns
          label {{ $t('models.address.attributes.address') }}
          span {{ legal_representative_address.address }}

        .four.columns
          label {{ $t('models.address.attributes.number') }}
          span {{ legal_representative_address.number }}

      .row
        .six.columns
          label {{ $t('models.address.attributes.neighborhood') }}
          span {{ legal_representative_address.neighborhood }}

        .three.columns
          label {{ $t('models.address.attributes.cityName') }}
          span {{ legal_representative_address.city_name }}

        .three.columns
          label {{ $t('models.address.attributes.cep') }}
          span {{ legal_representative_address.cep }}

      .row
        .six.columns
          label {{ $t('models.address.attributes.complement') }}
          span {{ legal_representative_address.complement || $t('messages.not_informed') }}

        .six.columns
          label {{ $t('models.address.attributes.referencePoint') }}
          span {{ legal_representative_address.reference_point }}



      .covenants-container(v-if="covenantsCount")
        hr
        .row
          .twelve.columns
            h5.title {{ this.$t('.covenants.title') }}

        table.u-full-width
          thead
            tr
              th {{ $t('models.covenant.attributes.number') }}
              th {{ $t('models.covenant.attributes.name') }}
              th {{ $t('models.covenant.attributes.admin') }}

          tbody(v-if="covenants")
            tr(v-for="covenant in covenants")
              td
                router-link.router-link(:to="{ name: 'covenant', params: { id: covenant.id } }")
                  | {{ covenant.number }}
              td
                router-link.router-link(:to="{ name: 'covenant', params: { id: covenant.id } }")
                  | {{ covenant.name }}
              td
                router-link.router-link(:to="{ name: 'admin', params: { id: covenant.admin_id } }")
                  | {{ covenant.admin_name }}

</template>


<script>
  export default {
    name: 'cooperative',
    data () {
      return {
        i18nScope: 'cooperatives.show',
        lol: null,
        cooperative: null,
        address: null,
        legal_representative: null,
        legal_representative_address: null,
        covenants: null,
        covenantsCount: null,
        params: null,
      }
    },

    methods: {
      getCooperative() {
        return this.$http.get('/administrator/cooperatives/' + this.params.id)
          .then((response) => {
            this.cooperative = response.data
            this.address = this.cooperative.address
            this.legal_representative = this.cooperative.legal_representative
            this.legal_representative_address = this.cooperative.legal_representative.address
            this.covenants = this.cooperative.covenants
            this.covenantsCount = this.covenants.length

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
      this.getCooperative()
    }
  }

</script>
