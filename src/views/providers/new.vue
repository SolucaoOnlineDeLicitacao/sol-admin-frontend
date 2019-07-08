<style scoped lang="scss">

  .classification-line {
    line-height: 38px;
  }

  .focus {
    background-color: #ffebbd;
    padding: 0 10px;
    transition: 0.2s ease;
  }

  .error {
    font-size: 12px;
    color: #FF0000;
  }

</style>


<template lang="pug">
  .root
    headers(:title="this.$t('.title')")

    .container.provider
      form.card(ref="form", method="post", @submit.prevent="submit")

        .row
          .twelve.columns
            h4.title
              | {{ $t('.general.title') }}

        .row
          .six.columns
            input-field(
              :autofocus="true",
              type="text",
              v-model="provider.name",
              name="provider[name]",
              :error="errors.name"
            )

          .three.columns
            select-field(
              name="provider[type]",
              model="provider",
              v-model="provider.type",
              :options="types",
              :placeholder="$t('options.prompt')",
              :error="errors['provider.type']"
            )

          .three.columns
            input-field(
              type="text",
              v-model="provider.document",
              name="provider[document]",
              :error="errors.document",
              :label="documentLabel",
              :mask="providerMask"
            )

        AddressFields(:errors="errorsAddress" prefix="provider" :address="address")

        .row
          .twelve.columns
            h4.title {{ $t('models.legal_representative.one') }}

        .row
          .eight.columns
            input-field(
              type="text",
              model="legal_representative",
              v-model="legal_representative.name",
              name="provider[legal_representative_attributes][name]",
              :error="errorsLegalRepresentative['legal_representative.name']"
            )

          .four.columns
            input-field(
              type="text",
              model="legal_representative",
              v-model="legal_representative.nationality",
              name="provider[legal_representative_attributes][nationality]",
              :error="errorsLegalRepresentative['legal_representative.nationality']"
            )

        .row
          .three.columns
            select-field(
              name="provider[legal_representative_attributes][civil_state]",
              model="legal_representative",
              v-model="legal_representative.civil_state",
              :options="civilStates",
              :placeholder="$t('options.prompt')",
              :error="errorsLegalRepresentative['legal_representative.civil_state']"
            )

          .three.columns
            input-field(
              type="text",
              model="legal_representative",
              v-model="legal_representative.rg",
              name="provider[legal_representative_attributes][rg]",
              :error="errorsLegalRepresentative['legal_representative.rg']"
            )

          .three.columns
            input-field(
              type="text",
              model="legal_representative",
              v-model="legal_representative.cpf",
              name="provider[legal_representative_attributes][cpf]",
              :error="errorsLegalRepresentative['legal_representative.cpf']",
              placeholder="000.000.000-00",
              mask="000.000.000-00"
            )

          .three.columns
            input-field(
              type="text",
              model="legal_representative",
              v-model="legal_representative.valid_until",
              name="provider[legal_representative_attributes][valid_until]",
              :error="errorsLegalRepresentative['legal_representative.valid_until']",
              placeholder="00/00/0000",
              mask="00/00/0000"
            )

          AddressFields(:errors="errorsLegalRepresentativeAddress" prefix="provider[legal_representative_attributes]"  :address="legal_representative_address" errorPrefix="legal_representative.")

        .row
          .twelve.columns
            h4.title
              | {{ $t('.classifications.title') }}


        .row(v-if="this.classificationGroupOptions")
          .six.columns
            select-field-empty(
              name="classification[name]",
              model="classification",
              :options="this.classificationGroupOptions",
              :placeholder="$t('options.prompt')",
              :error="errors.classification",
              :hideSearch="false",
              :includePrompt="true",
              :hideLabel="true"
            )

          .six.columns
            .button.button-primary(@click="addClassification")
              i.fa.fa-plus.mr-1
              | {{ $t('.classifications.button.add') }}

        .row.classification-line.mb-1(v-for="(classification, index) in classifications")
          .six.columns(:class="classification.focus ? 'focus' : ''" v-if="!classification._destroy")
            | {{ classification.name }}

          .six.columns(v-if="!classification._destroy")
            button.button.mb-0(type="button" @click="removeClassification(classification)")
              i.fa.fa-close-thin.mr-1
              | {{ $t('.classifications.button.remove') }}

          input(type="hidden", name="provider[provider_classifications_attributes][][classification_id]", :value="classification.id" v-if="classification")

          input(type="hidden", name="provider[provider_classifications_attributes][][_destroy]", :value="classification._destroy" v-if="classification")

        template(v-if="errors.provider_classifications")
          .row.error
            | {{ $t('.classifications.error') }}

        .row.mt-2
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
    name: 'newProvider',

    components: {
      AddressFields
    },

    props: {
      redirect: { type: String }
    },

    data () {
      return {
        i18nScope: 'providers.new',
        submitting: false,
        errors:  {},
        errorsAddress: {},
        errorsLegalRepresentative: {},
        errorsLegalRepresentativeAddress: {},

        // form
        provider: {},
        address: {},
        legal_representative_address: {},
        legal_representative: {},
        classificationGroupOptions: null,
        classifications: [],
        classification: {},
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

      types() {
        return [
          { id: 'Individual', text: this.$t('models.provider.attributes.types.individual') },
          { id: 'Company', text: this.$t('models.provider.attributes.types.company') }
        ]
      },


      documentLabel() {
        let type = this.provider.type

        if(type == 'Company') return 'CNPJ'
        return 'CPF'
      },

      providerMask() {
        let type = this.provider.type

        if(type == 'Company') {
          return { mask: '00.000.000/0000-00', options: { reverse: true, clearIfNotMatch: true } }
        } else {
          return { mask: '000.000.000-00', options: { reverse: true, clearIfNotMatch: true } }
        }
      },
    },

    methods: {
      submit() {
        const formData = new FormData(this.$refs.form)
        this.submitting = true

        this.$http.post('/administrator/providers', formData)
          .then((response) => {
            this.$notifications.clear()

            this.errors = {}

            let redirectToRoute = this.redirect ? { path: this.redirect } : { name: 'providers' }
            this.$router.replace(redirectToRoute)
          })
          .catch((err) => {

            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.$notifications.error(this.$t('.notifications.failure'))

            this.errors = this.$i18n.errify(errors, { model: 'provider' })
            this.errorsAddress = this.$i18n.errify(errors, { model: 'address' })
            this.errorsLegalRepresentative = this.$i18n.errify(errors, { model: 'legal_representative' })
            this.errorsLegalRepresentativeAddress = this.$i18n.errify(errors, { model: 'legal_representative.address' })
          })
          .then(() => {
            this.submitting = false
          })
      },

      getClassifications() {
        return this.$http.get('/search/classifications')
          .then((response) => {
            let grouped = _.groupBy(response.data, 'classification_id')
            let headers = grouped["null"]
            let classifications = []

            headers.filter(function(elem) {
              let currentClassification = {
                id: elem.id,
                text: elem.text,
                children: grouped[elem.id]
              }

              classifications.push(currentClassification)
            });

            this.classificationGroupOptions = classifications

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      addClassification: function() {
        let selectedId = $('#classification_name').val()
        let alreadyAdd = false
        let wasDestroyedIndex = -1

        if(selectedId == 0) return

        this.classifications.filter(function(elem, index){
          elem.focus = false

          if(elem.id == selectedId) {
            if(elem._destroy) {
              elem._destroy = false
              wasDestroyedIndex = index
            } else {
              alreadyAdd = true
              elem.focus = true
            }
          }
        });

        if(!alreadyAdd) {
          this.classification.id = selectedId
          this.classification.name = $('#classification_name').select2('data')[0].text
          this.classification._destroy = !!this.classification._destroy

          if (wasDestroyedIndex < 0) this.classifications.unshift(_.clone(this.classification))

          this.classification = {}
        }

        this.classifications = _.sortBy(this.classifications, [function(c) { return c.name; }])
      },

      removeClassification(classification) {
        let currentItem = classification

        this.classifications.filter(function(elem){
          if(elem.id == currentItem.id) {
            elem._destroy = true
          }
        })
      },
    },

    mounted: function() {
      this.getClassifications()
    },
  }

</script>
