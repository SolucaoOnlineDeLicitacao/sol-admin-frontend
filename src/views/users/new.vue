<style scoped lang="scss">
</style>

<template lang="pug">
  .root
    headers(:title="this.$t('.title')")

    .container.user
      form.card(ref="form", method="post", @submit.prevent="submit")

        .row
          .five.columns
            input-field(
              :autofocus="true",
              type="text",
              v-model="user.name",
              name="user[name]",
              :error="errors.name"
            )

          .four.columns
            email-field(
              name="user[email]",
              type="text",
              v-model="user.email",
              :error="errors.email"
            )

          .three.columns
            phone-field(
              name="user[phone]",
              type="text",
              v-model="user.phone",
              :error="errors.phone"
            )

        .row

          .five.columns
            select-ajax-field(
              name="user[cooperative_id]",
              model="user",
              v-model="user.cooperative_id",
              :options="selectedCooperative",
              :placeholder="$t('options.prompt')",
              :error="errors.cooperative",
              url="/search/cooperatives"
            )

          .four.columns
            select-ajax-field(
              name="user[role_id]",
              model="user",
              v-model="user.role_id",
              :options="selectedRole",
              :placeholder="$t('options.prompt')",
              :error="errors.role",
              url="/search/roles"
            )

          .three.columns
            input-field(
              name="user[cpf]",
              type="text",
              placeholder="000.000.000-00",
              v-model="user.cpf",
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
    name: 'newUser',

    props: {
      redirect: { type: String }
    },

    data () {
      return {
        i18nScope: 'users.new',
        submitting: false,
        errors:  {},

        // form
        user: {},
        user_role: {}
      }
    },

    computed: {
      submitText() {
        if (this.submitting) return this.$t('.button.submitting')
        return this.$t('.button.submit')
      },

      selectedRole() {
        let id = this.user && this.user.role_id

        if(typeof id !== 'undefined') {
          return [
            {
              id: this.user.role_id,
              text: this.user.role_title
            }
          ]
        }

        return []
      },

      selectedCooperative() {
        let id = this.user && this.user.cooperative_id

        if(typeof id !== 'undefined') {
          return [
            {
              id: this.user.cooperative_id,
              text: this.user.cooperative_name
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

        this.$http.post('/administrator/users', formData)
          .then((response) => {
            this.$notifications.clear()

            this.errors = {}

            let redirectToRoute = this.redirect ? { path: this.redirect } : { name: 'users' }
            this.$router.replace(redirectToRoute)
          })
          .catch((err) => {

            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.$notifications.error(this.$t('.notifications.failure'))

            this.errors = this.$i18n.errify(errors, { model: 'user' })
          })
          .then(() => {
            this.submitting = false
          })

      }
    }
  }

</script>
