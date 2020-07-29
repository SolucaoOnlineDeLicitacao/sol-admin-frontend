<style scoped lang="scss">

  .title {
    margin-top: 20px;
  }

  .cooperative {
    > .row {
      margin-bottom: 10px;
    }
  }

  h4 {
    font-size: 20px;
    letter-spacing: 0.3px;
    color: $greyish-brown-two;
  }
</style>


<template lang="pug">
  .root
    headers(:title="this.$t('.title')")


    .container.cooperative
      form.card(ref="form", method="post", @submit.prevent="submit")

        .row
          .twelve.columns
            h4.title
              | {{ $t('.cooperative_data') }}

        .row
          .eight.columns
            input-field(
              :autofocus="true",
              type="text",
              v-model="cooperative.name",
              name="cooperative[name]",
              :error="errors.name"
            )

          .four.columns
            input-field(
              type="text",
              v-model="cooperative.cnpj",
              name="cooperative[cnpj]",
              :error="errors.cnpj",
              :placeholder="cnpjPlaceholder"
              :mask="cnpjMask"
            )

        AddressFields(:errors="errorsAddress" prefix="cooperative" :address="address")

        .row
          .twelve.columns
            h4.title {{ $t('models.legal_representative.one') }}

        .row
          .eight.columns
            input-field(
              type="text",
              model="legal_representative",
              v-model="legal_representative.name",
              name="cooperative[legal_representative_attributes][name]",
              :error="errorsLegalRepresentative['legal_representative.name']"
            )

          .four.columns
            input-field(
              type="text",
              model="legal_representative",
              v-model="legal_representative.nationality",
              name="cooperative[legal_representative_attributes][nationality]",
              :error="errorsLegalRepresentative['legal_representative.nationality']"
            )


        .row
          .three.columns
            select-field(
              name="cooperative[legal_representative_attributes][civil_state]",
              model="legal_representative",
              v-model="legal_representative.civil_state",
              :options="civilStates",
              :placeholder="$t('options.blank')",
              :error="errorsLegalRepresentative['legal_representative.civil_state']"
            )

          .three.columns
            input-field(
              type="text",
              model="legal_representative",
              v-model="legal_representative.rg",
              name="cooperative[legal_representative_attributes][rg]",
              :error="errorsLegalRepresentative['legal_representative.rg']"
            )

          .three.columns
            input-field(
              type="text",
              model="legal_representative",
              v-model="legal_representative.cpf",
              name="cooperative[legal_representative_attributes][cpf]",
              :error="errorsLegalRepresentative['legal_representative.cpf']",
              placeholder="000.000.000-00",
              mask="000.000.000-00"
            )

          .three.columns
            input-field(
              type="text",
              model="legal_representative",
              v-model="legal_representative.valid_until",
              name="cooperative[legal_representative_attributes][valid_until]",
              :error="errorsLegalRepresentative['legal_representative.valid_until']",
              placeholder="00/00/0000",
              mask="00/00/0000"
            )

          AddressFields(:errors="errorsLegalRepresentativeAddress" prefix="cooperative[legal_representative_attributes]"  :address="legal_representative_address" errorPrefix="legal_representative.")


          .row
            .twelve.columns
              button.button-primary(
                type="submit",
                :disabled="submitting"
              )
                | {{ submitText }}

</template>


<script>
  import AddressFields from '../addresses/address-fields.vue';

  export default {
    name: 'newCooperative',

    components: {
      AddressFields
    },

    props: {
      redirect: { type: String }
    },

    data () {
      return {
        i18nScope: 'cooperatives.new',
        submitting: false,
        errors:  {},
        errorsAddress: {},
        errorsLegalRepresentative: {},
        errorsLegalRepresentativeAddress: {},

        // form
        cooperative: {},
        address: {},
        legal_representative_address: {},
        legal_representative: {},
      }
    },

    computed: {
      submitText() {
        if (this.submitting) return this.$t('.button.submitting')
        return this.$t('.button.submit')
      },

      civilStates() {
        return [
          { id: 'single', text: this.$t('models.legal_representative.attributes.civil_states.single') },
          { id: 'married', text: this.$t('models.legal_representative.attributes.civil_states.married') },
          { id: 'divorced', text: this.$t('models.legal_representative.attributes.civil_states.divorced') },
          { id: 'widower', text: this.$t('models.legal_representative.attributes.civil_states.widower') },
          { id: 'separated', text: this.$t('models.legal_representative.attributes.civil_states.separated') }
        ]
      },

      cnpjMask() {
        return { mask: '00.000.000/0000-00', options: { reverse: true, clearIfNotMatch: true } }
      },

      cnpjPlaceholder() {
        return '00.000.000/0000-00'
      }
    },

    methods: {
      submit() {
        const formData = new FormData(this.$refs.form)
        this.submitting = true

        this.$http.post('/administrator/cooperatives', formData)
          .then((response) => {
            this.$notifications.clear()

            this.errors = {}

            let redirectToRoute = this.redirect ? { path: this.redirect } : { name: 'cooperatives' }
            this.$router.replace(redirectToRoute)
          })
          .catch((err) => {

            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.$notifications.error(this.$t('.notifications.failure'))

            this.errors = this.$i18n.errify(errors, { model: 'cooperative' })
            this.errorsAddress = this.$i18n.errify(errors, { model: 'address' })
            this.errorsLegalRepresentative = this.$i18n.errify(errors, { model: 'legal_representative' })
            this.errorsLegalRepresentativeAddress = this.$i18n.errify(errors, { model: 'legal_representative.address' })
          })
          .then(() => {
            this.submitting = false
          })

      }
    }
  }

</script>
