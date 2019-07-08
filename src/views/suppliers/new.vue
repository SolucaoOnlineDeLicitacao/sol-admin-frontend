<style scoped lang="scss">
</style>


<template lang="pug">
  .root
    headers(:title="this.$t('.title')")

    .container.supplier
      form.card(ref="form", method="post", @submit.prevent="submit")

        .row
          .five.columns
            input-field(
              :autofocus="true",
              type="text",
              v-model="supplier.name",
              name="supplier[name]",
              :error="errors.name"
            )

          .four.columns
            email-field(
              name="supplier[email]",
              type="text",
              v-model="supplier.email",
              :error="errors.email"
            )

          .three.columns
            phone-field(
              name="supplier[phone]",
              type="text",
              v-model="supplier.phone",
              :error="errors.phone"
            )

        .row

          .five.columns
            select-ajax-field(
              name="supplier[provider_id]",
              model="supplier",
              v-model="supplier.provider_id",
              :options="selectedProvider",
              placeholder="Selecione uma opção",
              :error="errors.provider",
              url="/search/providers"
            )

          .three.columns
            input-field(
              name="supplier[cpf]",
              type="text",
              placeholder="000.000.000-00",
              v-model="supplier.cpf",
              mask="000.000.000-00",
              :error="errors.cpf"
            )

        .row
          .twelve.columns
            button.button-primary(
              type="submit",
              :disabled="submitting"
            )
              | {{ submitText }}

</template>


<script>

  export default {
    name: 'newSupplier',

    props: {
      redirect: { type: String }
    },

    data () {
      return {
        i18nScope: 'suppliers.new',
        submitting: false,
        errors:  {},

        // form
        supplier: {},
        supplier_role: {}
      }
    },

    computed: {
      submitText() {
        if (this.submitting) return this.$t('.button.submitting')
        return this.$t('.button.submit')
      },

      selectedProvider() {
        let id = this.supplier && this.supplier.provider_id

        if(typeof id !== 'undefined') {
          return [
            {
              id: this.supplier.provider_id,
              text: this.supplier.provider_name
            }
          ]
        }

        return []
      }

    },

    methods: {
      submit() {
        const formData = new FormData(this.$refs.form)
        this.submitting = true

        this.$http.post('/administrator/suppliers', formData)
          .then((response) => {
            this.$notifications.clear()

            this.errors = {}

            let redirectToRoute = this.redirect ? { path: this.redirect } : { name: 'suppliers' }
            this.$router.replace(redirectToRoute)
          })
          .catch((err) => {

            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.$notifications.error(this.$t('.notifications.failure'))

            this.errors = this.$i18n.errify(errors, { model: 'supplier' })
          })
          .then(() => {
            this.submitting = false
          })

      }
    }
  }

</script>
