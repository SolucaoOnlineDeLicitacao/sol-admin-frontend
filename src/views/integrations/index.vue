<style scoped lang="scss">

  .card {
    .template {
      .row {
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    form {
      margin-bottom: 0;
    }

    h4 {
      .status {
        cursor: help;
        color: gray;

        &.success {
          color: $fern-green;
        }

        &.in_progress {
          color: $sky-blue;
        }

        &.fail {
          color: $pale-red;
        }

        .fa,
        .small {
          margin-left: 10px;
          font-size: 50%;
        }
      }
    }

    .label-fa {
      > .fa {
        margin-left: 10px;
      }
    }
  }

  .log-row {
    white-space: pre;
    overflow: scroll;
  }

  .token {
    word-break: break-all;
  }

</style>

<template lang="pug">
  .root
    headers(:title="this.$t('.title')")
    .container.tool.integrations.u-cf(v-if="integrations")
      .row.mb-2(v-for="lineIntegrations in groupedIntegrations")
        .six.columns(v-for="(integration, index) in lineIntegrations")
          .card
            h4
              | {{ $t('models.' + integration.type + '.one') }}
              .status.u-pull-right(:class="integration.status" @click="toggleModal(integration)")
                i.fa(:class="statusIcon(integration.status)" :title="integrationStatus(integration.status)")
                span.small {{ integrationStatus(integration.status) }}

            form(ref="form", method="post", @submit.prevent="submit(integration)" v-if="editing[integration.type]")

              .row
                .twelve.columns
                  input-field(
                    :autofocus="true",
                    type="text",
                    v-model="integration.endpoint_url",
                    name="integration[endpoint_url]",
                    :error="errors[integration.type].endpoint_url"
                  )

              .row
                .twelve.columns
                  input-field(
                    type="text",
                    v-model="integration.token",
                    name="integration[token]",
                    :error="errors[integration.type].token"
                  )

              .row
                .twelve.columns
                  input-field(
                    type="text",
                    v-model="integration.schedule",
                    name="integration[schedule]",
                    :error="errors[integration.type].schedule"
                  )

              .row
                .six.columns
                  .button(@click="toggleEdit(integration.type)")
                    | Cancelar
                .six.columns
                  button.u-pull-right.button-primary(
                    type="submit",
                    :disabled="submitting[integration.type]"
                  )
                    | {{ submitText(integration) }}

            .template(v-else)
              .row
                label {{ $t('models.integration.attributes.endpointUrl') }}
                | {{ integration.endpoint_url }}

              .row(@click="toggleToken(integration)")
                label.label-fa
                  | {{ $t('models.integration.attributes.token') }}
                  i.fa.fa-eye(v-if="!showToken[integration.type]")
                  i.fa.fa-eye-slash(v-if="showToken[integration.type]")

                span.token(v-if="showToken[integration.type]")
                  | {{ integration.token }}
                span(v-else)
                  | ********

              .row
                label {{ $t('models.integration.attributes.schedule') }}
                | {{ integration.schedule }}

              .row(v-if="$ability.canManageIntegration()")
                .columns.six
                  .button(@click="toggleEdit(integration.type)")
                    | Editar

                .columns.six
                  form(ref="formForce", method="post", @submit.prevent="submitForce(integration)")
                    button.button-primary.u-pull-right(
                      type="submit",
                      :disabled="importing[integration.type]"
                    )
                      | {{ importText(integration) }}

    modal-wnd(v-if="showModal", :footer="false", @close="showModal = false")
      h5.modal-heading(slot="header")
        | Detalhes da importação -
        |  {{ $t('models.' + this.modalIntegration.type + '.one') }}

      hr.mt-0.mb-1

      .row.mb-2
        label Última importação:
        | {{ this.modalIntegration.last_importation || 'Não informado' }}

      .row
        label Log da importação:
        .log-row
          | {{ this.modalIntegration.log || 'Sem informações' }}

</template>

<script>

  export default {
    name: 'integrations',
    data () {
      return {
        i18nScope: 'integrations.index',

        showModal: false,
        modalIntegration: null,

        // resource
        integrations: null,
        integrationsCount: null,

        showToken: {
          'cooperative': false,
          'item': false,
          'covenant': false
        },

        submitting: {
          'cooperative': false,
          'item': false,
          'covenant': false
        },

        importing: {
          'cooperative': false,
          'item': false,
          'covenant': false
        },

        errors:  {
          'cooperative': {},
          'item': {},
          'covenant': {}
        },

        editing: {
          'cooperative': false,
          'item': false,
          'covenant': false
        }
      }
    },

    computed: {
      groupedIntegrations() {
        let grouped = [];
        let index = -1;
        for (let i = 0; i < this.integrations.length; i++) {
          if (i % 2 == 0) {
            index++;
            grouped[index] = [];
          }

          grouped[index].push(this.integrations[i]);
        }

        return grouped;
      }
    },

    methods: {
      importText(aIntegration) {
        if (this.importing[aIntegration.type]) return this.$t('.button.importing')
        return this.$t('.button.import')
      },

      submitText(aIntegration) {
        if (this.submitting[aIntegration.type]) return this.$t('.button.submitting')
        return this.$t('.button.submit')
      },

      toggleModal(integration) {
        this.modalIntegration = integration
        this.showModal = true
      },

      toggleEdit(type) {
        this.errors[type] = {}

        this.editing[type] = !this.editing[type]
      },

      toggleToken(aIntegration) {
        this.showToken[aIntegration.type] = !this.showToken[aIntegration.type]
      },

      integrationStatus(status) {
        return this.$t('models.integration.attributes.statuses.' + status)
      },

      statusIcon(status) {
        if(status == 'success') {
          return 'fa-check'
        } else if (status == 'fail') {
          return 'fa-exclamation-triangle'
        } else if (status == 'queued') {
          return 'fa-box'
        }

        return 'fa-spinner fa-spin'
      },

      fetch() {
        return this.$http.get('/administrator/configurations')
          .then((response) => {
            this.integrations = response.data
            this.integrationsCount = this.integrations.length

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      submitForce(aIntegration) {

        this.importing[aIntegration.type] = true

        this.$http.post('/administrator/configurations/' + aIntegration.id + '/import')
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.' + aIntegration.type + '.import.success'))

            aIntegration.status = response.data.status
          })
          .catch((err) => {
            this.$notifications.clear()
            this.$notifications.error(this.$t('.notifications.' + aIntegration.type + '.import.failure'))
          })
          .then(() => {
            this.importing[aIntegration.type] = false
          })
      },

      submit(aIntegration) {
        const configuration_params = {
            endpoint_url: aIntegration.endpoint_url,
            token: aIntegration.token,
            schedule: aIntegration.schedule
          }

        const formData = {
          configuration: configuration_params
        }

        this.submitting[aIntegration.type] = true

        this.$http.patch('/administrator/configurations/' + aIntegration.id, formData)
          .then((response) => {
            this.errors[aIntegration.type] = {}

            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.' + aIntegration.type + '.update.success'))

            this.toggleEdit(aIntegration.type)
          })
          .catch((err) => {
            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.$notifications.clear()
            this.$notifications.error(this.$t('.notifications.' + aIntegration.type + '.update.failure'))

            this.errors[aIntegration.type] = this.$i18n.errify(errors, { model: 'integration' })
          })
          .then(() => {
            this.submitting[aIntegration.type] = false
          })

      },

      init() {
        this.fetch()
      }
    },

    created: function () {
      this.init()
    }
  }

</script>
