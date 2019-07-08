<style scoped lang="scss">
</style>

<template lang="pug">
  .root
    headers(:title="this.$t('.title')")

    .container.admin
      form.card(ref="form", method="post", @submit.prevent="submit")

        .row
          .five.columns
            input-field(
              :autofocus="true",
              type="text",
              v-model="admin.name",
              name="admin[name]",
              :error="errors.name"
            )

          .four.columns
            email-field(
              name="admin[email]",
              type="text",
              v-model="admin.email",
              :error="errors.email"
            )


          .three.columns
            select-field(
              name="admin[role]",
              v-model="admin.role",
              :options="roles",
              :placeholder="$t('options.prompt')",
              :error="errors.role"
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
    name: 'editAdmin',

    props: {
      redirect: { type: String }
    },

    data () {
      return {
        i18nScope: 'admins.edit',
        submitting: false,
        errors:  {},

        // form
        admin: {},
        admin_role: {},
      }
    },

    computed: {
      submitText() {
        if (this.submitting) return this.$t('.button.submitting')
        return this.$t('.button.submit')
      },

      roles() {
        return [
          { id: 'viewer', text: this.$t('models.admin.attributes.roles.viewer') },
          { id: 'reviewer', text: this.$t('models.admin.attributes.roles.reviewer') },
          { id: 'general', text: this.$t('models.admin.attributes.roles.general') },
        ]
      },

    },

    methods: {
      submit() {
        const formData = new FormData(this.$refs.form)
        this.submitting = true

        this.$http.patch('/administrator/admins/' + this.params.id, formData)
          .then((response) => {
            this.$notifications.clear()
            this.errors = {}

            let redirectToRoute = this.redirect ? { path: this.redirect } : { name: 'admins' }
            this.$router.replace(redirectToRoute)
          })
          .catch((err) => {
            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.$notifications.error(this.$t('.notifications.failure'))
            this.errors = this.$i18n.errify(errors, { model: 'admin' })
          })
          .then(() => {
            this.submitting = false
          })

      },

      getAdmin() {
        return this.$http.get('/administrator/admins/' + this.params.id)
          .then((response) => {
            this.admin = response.data
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
