<style scoped lang="scss">

.title {
  margin-top: 20px;
}

.provider {
  .row {
    margin-bottom: 10px;
  }
}

</style>


<template lang="pug">
.root(v-if="provider")
  headers(:title='provider.name')

  .container.provider
    .card
      .row
        .twelve.columns
          span.mr-0-5 {{ $t('.status.title') }}
          template(v-if="provider.blocked")
            span.danger-text
              | {{ $t('.status.blocked') }}
          template(v-else)
            span.success-text
              | {{ $t('.status.unblocked') }}

          hr.mt-1.mb-1

      .row
        .twelve.columns
          h4.title {{ $t('.title') }}

      .row
        .six.columns
          label {{ $t('models.provider.attributes.name') }}
          span {{ provider.name }}

        .six.columns
          label {{ $t('models.provider.attributes.document') }}
          span {{ provider.document }}

      template(v-if="address")
        .row
          .twelve.columns
            h4.title {{ $t('models.address.one') }}

        .row
          .eight.columns
            label {{ $t('models.address.attributes.address') }}
            span {{ address.address }}

          .four.columns
            label {{ $t('models.address.attributes.number') }}
            span {{ address.number }}

        .row
          .six.columns
            label {{ $t('models.address.attributes.neighborhood') }}
            span {{ address.neighborhood }}

          .three.columns
            label {{ $t('models.address.attributes.cityName') }}
            span {{ address.city_name }}

          .three.columns
            label {{ $t('models.address.attributes.cep') }}
            span {{ address.cep }}

        .row
          .six.columns
            label {{ $t('models.address.attributes.complement') }}
            span {{ address.complement || $t('messages.not_informed') }}

          .six.columns
            label {{ $t('models.address.attributes.referencePoint') }}
            span {{ address.reference_point }}

    .card.mt-2(v-if="legal_representative")
      .row
        .twelve.columns
          h4.mt-0.title {{ $t('models.legal_representative.one') }}

      .row
        .eight.columns
          label {{ $t('models.legal_representative.attributes.name') }}
          span {{ legal_representative.name }}

        .four.columns
          label {{ $t('models.legal_representative.attributes.nationality') }}
          span {{ legal_representative.nationality }}

      .row
        .three.columns
          label {{ $t('models.legal_representative.attributes.civilState') }}
          span {{ $t('models.legal_representative.attributes.civil_states.' + legal_representative.civil_state) }}

        .three.columns
          label {{ $t('models.legal_representative.attributes.rg') }}
          span {{ legal_representative.rg }}

        .three.columns
          label {{ $t('models.legal_representative.attributes.cpf') }}
          span {{ legal_representative.cpf }}

        .three.columns
          label {{ $t('models.legal_representative.attributes.validUntil') }}
          span {{ legal_representative.valid_until }}

      template(v-if="legal_representative_address")
        .row
          .twelve.columns
            h5.title {{ $t('models.address.one') }}

        .row
          .eight.columns
            label {{ $t('models.address.attributes.address') }}
            span {{ legal_representative_address.address }}

          .four.columns
            label {{ $t('models.address.attributes.number') }}
            span {{ legal_representative_address.number }}

        .row
          .six.columns
            label {{ $t('models.address.attributes.neighborhood') }}
            span {{ legal_representative_address.neighborhood }}

          .three.columns
            label {{ $t('models.address.attributes.cityName') }}
            span {{ legal_representative_address.city_name }}

          .three.columns
            label {{ $t('models.address.attributes.cep') }}
            span {{ legal_representative_address.cep }}

        .row
          .six.columns
            label {{ $t('models.address.attributes.complement') }}
            span {{ legal_representative_address.complement || $t('messages.not_informed') }}

          .six.columns
            label {{ $t('models.address.attributes.referencePoint') }}
            span {{ legal_representative_address.reference_point }}

    .card.mt-2.mb-2

      .row
        .twelve.columns
          h4.mt-0.title {{ $t('.classifications.title') }}

      ul(v-for="provider_classification in provider_classifications")
        li
          | {{ provider_classification.name }}

    .card.mt-2.mb-2
      .row
        .twelve.columns
          h4.mt-0.title {{ $t('.attachments.title') }}
        ul.mb-0(v-if="provider.attachments.length > 0")
          li(v-for="attachment in provider.attachments")
            a.mb-1(:href="attachmentPath(attachment)", target="_blank")
              span.attachment-name {{ attachment.filename }}
        .row(v-else)
          | {{ $t('.attachments.empty') }}

    .card.mt-2.mb-2
      h4.mt-0.title
        | {{ $t('.events.title') }}

        .u-pull-right
          template(v-if="provider.blocked")
            .button(@click="showUnblockProviderOverlay = true")
              | {{ $t('.events.button.unblock') }}
          template(v-else)
            .button(@click="showBlockProviderOverlay = true")
              | {{ $t('.events.button.block') }}

      .row.mb-0(v-if="provider.event_provider_accesses.length > 0")
        .columns.twelve(v-for="event in provider.event_provider_accesses")
          div
            | {{ $t('.events.message', { type: eventType(event), date: $l('time.formats.micro', event["created_at"]), comment: event["data"]["comment"] }) }}
          router-link.router-link(:to="{ name: 'admin', params: { id: event.creator_id } }")
            | {{ $t('.events.done_by', { name: event.creator_name || 'Admin' }) }}

          hr.mt-1.mb-1

      .row(v-else)
        | {{ $t('.events.empty') }}

  modal-wnd(v-if="showBlockProviderOverlay", :footer="false", @close="showBlockProviderOverlay = false")
    .refuse-container
      h4.mt-2.text-center {{ $t('.overlay.block.title') }}
      hr.mt-0.mb-2.o-container

      .alert.alert-info
        | {{ $t('.overlay.block.alert') }}

      textarea-field.mt-2(
        v-model="comment",
        name="comment",
        :label="$t('.overlay.block.label')",
        :error="errors.comment"
      )

      .mt-2
        .button.button-primary.u-pull-right(@click="blockProvider()")
          template(v-if="blocking")
            i.fa.fa-spin.fa-spinner
          template(v-else)
            | {{ $t('.overlay.block.submit') }}

  modal-wnd(v-if="showUnblockProviderOverlay", :footer="false", @close="showUnblockProviderOverlay = false")
    .refuse-container
      h4.mt-2.text-center {{ $t('.overlay.unblock.title') }}
      hr.mt-0.mb-2.o-container

      .alert.alert-info
        | {{ $t('.overlay.unblock.alert') }}

      textarea-field.mt-2(
        v-model="comment",
        name="comment",
        :label="$t('.overlay.unblock.label')",
        :error="errors.comment"
      )

      .mt-2
        .button.button-primary.u-pull-right(@click="unblockProvider()")
          template(v-if="blocking")
            i.fa.fa-spin.fa-spinner
          template(v-else)
            | {{ $t('.overlay.unblock.submit') }}

</template>


<script>
  export default {
    name: 'provider',
    data () {
      return {
        i18nScope: 'providers.show',
        provider: null,
        address: null,
        legal_representative: null,
        legal_representative_address: null,
        provider_classifications: null,
        params: null,

        showUnblockProviderOverlay: false,
        showBlockProviderOverlay: false,
        errors: {},
        comment: '',
        blocking: false,
      }
    },

    methods: {
      attachmentPath(attachment) {
        if(typeof attachment === 'undefined') return
        return app.secrets.api.host + attachment.url
      },

      getProvider() {
        return this.$http.get('/administrator/providers/' + this.params.id)
          .then((response) => {
            this.provider = response.data
            this.address = this.provider.address
            this.legal_representative = this.provider.legal_representative
            this.legal_representative_address = this.provider.legal_representative.address
            this.provider_classifications = this.provider.provider_classifications

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      blockProvider() {
        this.blocking = true

        let params = { comment: this.comment }

        this.$http.post('/administrator/providers/' + this.params.id + '/block', params)
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.block.success'))

            this.errors = {}
            this.comment = ''
            this.showBlockProviderOverlay = false

            this.getProvider()
          })
          .catch((err) => {
            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.$notifications.error(this.$t('.notifications.block.failure'))
            this.errors = this.$i18n.errify(errors, { model: 'provider' })
          })
          .then(() => {
            this.blocking = false
          })
      },

      unblockProvider() {
        this.blocking = true

        let params = { comment: this.comment }

        this.$http.post('/administrator/providers/' + this.params.id + '/unblock', params)
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.unblock.success'))

            this.errors = {}
            this.comment = ''
            this.showUnblockProviderOverlay = false

            this.getProvider()
          })
          .catch((err) => {
            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.$notifications.error(this.$t('.notifications.unblock.failure'))
            this.errors = this.$i18n.errify(errors, { model: 'provider' })
          })
          .then(() => {
            this.blocking = false
          })
      },

      eventType(event) {
        if(event['data']['blocked'] == 1) return this.$t('.events.status.blocked')
        return this.$t('.events.status.unblocked')
      },

      parseRoute() {
        let params = {}

        params.id = this.$params.asInteger(this.$route.params.id)

        this.params = params
      }

    },

    created: function () {
      this.parseRoute()
      this.getProvider()
    }
  }

</script>
