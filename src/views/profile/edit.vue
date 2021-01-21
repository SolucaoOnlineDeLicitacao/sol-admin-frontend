<style scoped lang="scss">
  .avatar {
    display: block;
    margin-left: auto;
    margin-right: auto;

    height: 60px;
    width: 60px;
    border-radius: 100%;
    border: solid 1px #dadada;
  }

  .avatar-loading {
    background-color: #dadada;

    i {
      padding: 23px;
    }
  }

  .input-file {
    display: none;
  }
</style>

<template lang="pug">
  .mt-2.container
    .card
      form.mb-0(ref="form", method="patch", @submit.prevent="submit")

        .row
          .columns.six
            label
              | {{ $t('models.admin.attributes.name') }}
            div.mb-1
              | {{ admin.name }}

            label
              | {{ $t('models.admin.attributes.email') }}
            div.mb-1
              | {{ admin.username }}

          .columns.six
            input-field(
              type="password",
              v-model="admin.password",
              name="admin[password]",
              :error="errors.password"
            )

            input-field(
              type="password",
              v-model="admin.password_confirmation",
              name="admin[password_confirmation]",
              :error="errors.password_confirmation"
            )

            select-field(
              name="admin[locale]",
              v-model="locale",
              :options="locales",
              :error="errors.locale",
              :label="$t('.languages')"
            )

        .row
          button.mb-0.button-primary.u-pull-right(
            type="submit",
            :disabled="submitting"
          )
            | {{ submitText }}
</template>


<script>
  export default {
    name: 'editProfile',
    data () {
      return {
        i18nScope: 'profile.edit',

        errors: {},

        submitting: false,
        admin: null,
        params: null,

        locales: [
          { id: 'es-PY', text: this.$t('profile.edit.locale.spanish') },
          { id: 'en-US', text: this.$t('profile.edit.locale.english') },
          { id: 'pt-BR', text: this.$t('profile.edit.locale.portuguese') },
          { id: 'fr-FR', text: this.$t('profile.edit.locale.french') }
        ],
        locale: app.auth.user.locale
      }
    },

    computed: {
      submitText() {
        if (this.submitting) return this.$t('.button.submitting')
        return this.$t('.button.submit')
      },
    },

    methods: {
      loadUser() {
        this.admin = this.$auth.user
      },

      submit() {
        const formData = new FormData(this.$refs.form)
        this.submitting = true

        this.$http.patch('/administrator/profile', formData)
          .then((response) => {
            this.errors = {}

            this.$auth.setUser(response.data.admin)

            // nesse momento atualizamos o locale
            app.store.set('locale', this.locale)
            app.i18n.locale = this.locale

            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.success'))

            this.$router.replace({ name: "home" })
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
    },

    created: function () {
      this.loadUser()
      this.$emit('navbarTitleChanged', this.$t('title'))
    }
  }

</script>
