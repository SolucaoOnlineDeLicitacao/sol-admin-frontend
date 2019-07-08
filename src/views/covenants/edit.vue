<style scoped lang="scss">
</style>


<template lang="pug">
  .root
    headers(:title="this.$t('.title')")

    .container.covenant
      form.card(ref="form", method="post", @submit.prevent="submit")

        .row
          .twelve.columns
            h4.title {{ $t('.general.title') }}

        .row
          .three.columns
            input-field(
              type="text",
              v-model="covenant.number",
              name="covenant[number]",
              :error="errors.number"
            )

          .nine.columns
            input-field(
              :autofocus="true",
              type="text",
              v-model="covenant.name",
              name="covenant[name]",
              :error="errors.name"
            )

        .row
          .three.columns
            select-ajax-field(
              name="covenant[city_id]",
              model="covenant",
              v-model="covenant.city_id",
              :options="selectedCity",
              :placeholder="$t('options.prompt')",
              :error="errors.city",
              url="/search/cities"
            )

          .three.columns
            input-field(
              :autofocus="true",
              type="text",
              v-model="covenant.estimated_cost",
              name="covenant[estimated_cost]",
              :error="errors.estimated_cost",
              mask="999999999999,99"
            )

          .two.columns
            input-field(
              :autofocus="true",
              type="text",
              v-model="covenant.signature_date",
              name="covenant[signature_date]",
              :error="errors.signature_date",
              mask="00/00/0000",
              placeholder="DD/MM/YYYY"
            )

          .two.columns
            input-field(
              :autofocus="true",
              type="text",
              v-model="covenant.validity_date",
              name="covenant[validity_date]",
              :error="errors.validity_date",
              mask="00/00/0000",
              placeholder="DD/MM/YYYY"
            )

          .two.columns
            select-field(
              name="covenant[status]",
              model="covenant",
              v-model="covenant.status",
              :options="covenantStatuses",
              :placeholder="$t('options.prompt')",
              :error="errors.status"
            )


        .row
          .six.columns
            select-ajax-field(
              name="covenant[cooperative_id]",
              model="covenant",
              v-model="covenant.cooperative_id",
              :options="selectedCooperative",
              :placeholder="$t('options.prompt')",
              :error="errors.cooperative",
              url="/search/cooperatives"
            )

          .six.columns
            select-ajax-field(
              name="covenant[admin_id]",
              model="covenant",
              v-model="covenant.admin_id",
              :options="selectedUser",
              :placeholder="$t('options.prompt')",
              :error="errors.admin",
              url="/search/admins"
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
    name: 'editCovenant',

    props: {
      redirect: { type: String }
    },

    data () {
      return {
        i18nScope: 'covenants.edit',
        submitting: false,
        errors:  {},

        // form
        covenant: {}
      }
    },

    computed: {
      submitText() {
        if (this.submitting) return this.$t('.button.submitting')
        return this.$t('.button.submit')
      },

      covenantStatuses() {
        return [
          { id: 'waiting', text: this.$t('models.covenant.attributes.statuses.waiting') },
          { id: 'running', text: this.$t('models.covenant.attributes.statuses.running') },
          { id: 'completed', text: this.$t('models.covenant.attributes.statuses.completed') },
          { id: 'canceled', text: this.$t('models.covenant.attributes.statuses.canceled') }
        ]
      },


      selectedCity() {
        let id = this.covenant && this.covenant.city_id

        if(typeof id !== 'undefined') {
          return [
            {
              id: this.covenant.city_id,
              text: this.covenant.city_text
            }
          ]
        }

        return []
      },

      selectedCooperative() {
        let id = this.covenant && this.covenant.cooperative_id

        if(typeof id !== 'undefined') {
          return [
            {
              id: this.covenant.cooperative_id,
              text: this.covenant.cooperative_name
            }
          ]
        }

        return []
      },

      selectedUser() {
        let id = this.covenant && this.covenant.admin_id

        if(typeof id !== 'undefined') {
          return [
            {
              id: this.covenant.admin_id,
              text: this.covenant.admin_name
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

        this.$http.patch('/administrator/covenants/' + this.params.id, formData)
          .then((response) => {
            this.$notifications.clear()

            this.errors = {}

            let redirectToRoute = this.redirect ? { path: this.redirect } : { name: 'covenants' }
            this.$router.replace(redirectToRoute)
          })
          .catch((err) => {

            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.$notifications.error(this.$t('.notifications.failure'))

            this.errors = this.$i18n.errify(errors, { model: 'covenant' })

          })
          .then(() => {
            this.submitting = false
          })

      },

      getCovenant() {

        return this.$http.get('/administrator/covenants/' + this.params.id)
          .then((response) => {
            this.covenant = response.data

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
      this.getCovenant()
    }
  }

</script>
