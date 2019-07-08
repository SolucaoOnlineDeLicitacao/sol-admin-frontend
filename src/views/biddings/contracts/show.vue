<style scoped lang="scss">
  .badge {
    &.waiting_signature {
      background-color: $greyish-brown;
    }

    &.signed {
      background-color: $cerulean;
    }

    &.refused {
      background-color: $danger-color;
    }

    &.partial_execution,
    &.total_inexecution {
      background-color: $peach;
    }

    &.completed {
      background-color: $apple-green;
    }
  }
</style>

<template lang="pug">
  .root(v-if="contract")
    headers(:title='this.$t(".title", { title: contract.title })')
    .container.contract
      .card
        .row
          .columns.eight
            h5.mb-0 {{ $t('.general.title') }}
            hr.mt-0

            .row.mb-1
              label {{ $t('models.contract.attributes.provider_title') }}
              span {{ contract.provider_title }}

            .row.mb-1
              label {{ $t('models.bidding.one') }}
              router-link.router-link(:to="{ name: 'bidding', params: { id: contract.bidding_id } }") {{ contract.bidding_title }}

            .row.mb-1
              label {{ $t('models.contract.attributes.status') }}
              span.badge(:class="contract.status")
                | {{ $t('models.contract.attributes.statuses.' + contract.status) }}

            .row.mb-1
              label {{ $t('models.contract.attributes.price_total') }}
              span
                | {{ $asCurrency(contract.price_total) }}

          .four.columns
            h5.mb-0 {{ $t('.actions.title') }}
            hr.mt-0

            .row
              label {{ $t('models.contract.attributes.supplierSignedAt') }}

              template(v-if="contract.refused_by_class == 'supplier'")
                span {{ $t('.refused.at', { value: contract.refused_by_at }) }}
              template(v-else)
                span {{ contract.supplier_signed_at || $t('.signatures.waiting') }}

            .row
              label {{ $t('models.contract.attributes.userSignedAt') }}
              span {{ contract.user_signed_at || $t('.signatures.waiting') }}

            template(v-if="contract.contract_pdf")
              a.button(:href="contractPath", download, target="_blank")
                | {{ $t('.button.download') }}


</template>

<script>

  export default {
    name: 'contract',
    data () {
      return {
        i18nScope: 'biddings.contracts.show',
        lol: null,
        contract: null,
        params: {},
        biddingId: null
      }
    },

    computed:  {
      waitingSignatureStatus() {
        let status = this.contract.status
        return status && status == "waiting_signature"
      },

      refusedStatus() {
        let status = this.contract.status
        return status && status == "refused"
      },

      contractPath() {
        return this.contract && this.$http.host + "/" + this.contract.contract_pdf
      },

    },

    methods: {
      getContract() {
        return this.$http.get('/administrator/biddings/' + this.biddingId + '/contracts/' + this.params.id)
          .then((response) => {
            this.contract = response.data

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      parseRoute() {
        let params = {}

        params.id = this.$params.asInteger(this.$route.params.id)

        this.biddingId = this.$params.asInteger(this.$route.params.bidding_id)
        this.params = params
      },
    },

    created: function () {
      this.parseRoute()
      this.getContract()
    }
  }

</script>
