<style scoped lang="scss">
  .content {
    padding: 12px;
    color: $metallic-blue;
  }

  .logo-container {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .logo {
    max-height: 100px;
    margin-top: 50px;
  }

  input {
    border: solid 1px $dark-grey-blue !important;
  }

  .button {
    &.button-primary {
      background-color: $dark-grey-blue !important;
    }
  }

  .login-container {
    padding: 0 30px;
  }

</style>

<template lang="pug">
  .tool.login.container
    .content.text-center.logo-container

      img(src="@/assets/images/logo.png" class="logo")
      div {{ $t('.heading') }}

    .row
      .columns.four.offset-by-four
        .content
          .card
            form.login.mb-0(ref="form", method="post", @submit.prevent="submit")
              input(type="hidden", name="grant_type", value="password")

              .row
                .twelve.columns
                  input-field(
                    :autofocus="true",
                    type="email",
                    v-model="username",
                    name="username",
                    :label="$t('.fields.username.label')",
                    :placeholder="$t('.fields.username.placeholder')"
                  )
              .row
                .twelve.columns
                  input-field(
                    type="password",
                    v-model="password",
                    name="password",
                    :label="$t('.fields.password.label')",
                    :placeholder="$t('.fields.password.placeholder')"
                  )
              .row
                .twelve.columns
                  button.button.button-primary.u-full-width.mb-0(
                    type="submit",
                    :disabled="submitting"
                  )
                    | {{ submitText }}

                  .button.mb-0.mt-1.u-full-width(@click="passwordOverlay = true")
                    | {{ $t('.button.forgot_password') }}

    modal-wnd(v-if="passwordOverlay", @close="passwordOverlay = false", confirmButtonClass="button-success", @confirm="submitForgotPassword")
      .password-container
        h4.mt-2 {{ $t('.button.forgot_password') }}
        hr.mt-0.mb-2.o-container

        .alert.alert-info {{ $t('.forgot_password_instructions') }}

        form.mb-0(ref="formPassword", method="post", @submit.prevent="submitForgotPassword")

          input-field(
            type="text",
            v-model="email",
            name="admin[email]",
            label="E-mail",
            :error="errors.admin"
          )

</template>

<script>
  export default {
    props: {
      redirect: { type: String } // default para rota "home"
    },

    data() {
      return {
        // i18n
        i18nScope: 'login',

        submitting: false,
        submittingForgotPassword: false,
        passwordOverlay: false,
        email: null,
        errors: {},

        // form
        username: null,
        password: null
      }
    },

    computed: {
      submitText() {
        if (this.submitting) return this.$t('.button.submitting')
        return this.$t('.button.submit')
      }
    },

    methods: {
      submit() {
        const formData = new FormData(this.$refs.form)
        this.submitting = true

        this.$http.post('/oauth/token', formData)
          .then((response) => {
            // sample:
            // {
            //   "access_token":"d7aa18c41da868b443ceb0333e83d264fb410fd75f0c4ad1c67bd39d35ea5447",
            //   "token_type":"bearer",
            //   "scope":"user",
            //   "created_at":1532281807
            // }

            this.$notifications.clear()

            // autentica o usuário no client
            app.auth.login({ user: response.data.user, token: response.data.access_token })

            let redirectToRoute = this.redirect ? { path: this.redirect } : { name: 'home' }
            this.$router.replace(redirectToRoute)
          })
          .catch((err) => {
            this.$notifications.error(this.$t('.notifications.login.failure'))

            let code = _.dig(err, 'response', 'data', 'code')
          })
          .then(() => {
            // finally
            this.submitting = false
          })
      },


      submitForgotPassword() {
        const formData = new FormData(this.$refs.formPassword)
        this.submittingForgotPassword = true

        this.$http.post('/administrator/password', formData)
          .then((response) => {
            this.$notifications.clear()

            this.errors = {}
            this.passwordOverlay = false

            this.$notifications.info(this.$t('.notifications.password.success'))

          }).catch((err) => {
            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.errors = this.$i18n.errify(errors, { model: 'admin' })

            this.$notifications.error(this.$t('.notifications.password.failure'))
          })
          .then(() => {
            this.submittingForgotPassword = false
          })
      },

    }
  }
</script>
