<style scoped lang="scss">

  .button-fail {
    position: absolute;
    right: 20px;
    bottom: 0;
  }

 .badge {
    &.draft,
    &.closed,
    &.waiting {
      background-color: $greyish-brown;
    }

    &.ongoing {
      background-color: $cerulean;
    }

    &.canceled,
    &.failure {
      background-color: $danger-color;
    }

    &.suspended,
    &.under_review {
      background-color: $peach;
    }

    &.approved,
    &.finnished,
    &.accepted {
      background-color: $apple-green;
    }
  }
</style>

<template lang="pug">
  .root(v-if="bidding")
    headers(:title='bidding.title')
    .container.bidding
      .card
        .row
          .eight.columns
            h5.mb-0 {{ this.$t('.general.title') }}
            hr.mt-0

            .row.mb-1
              label {{ $t('models.bidding.attributes.description') }}
              span {{ bidding.description }}

            .row.mb-1
              label {{ $t('models.cooperative.one') }}
              span {{ bidding.cooperative.name }}

            .row.mb-1
              label {{ $t('models.bidding.attributes.covenant') }}
              span {{ bidding.covenant_name }}

            .row.mb-1
              label {{ $t('models.bidding.attributes.kind') }}
              span {{ $t('models.bidding.attributes.kinds.' + bidding.kind) }}

            .row.mb-1
              label {{ $t('models.bidding.attributes.deadline') }}
              span {{ bidding.deadline }}

            .row.mb-1
              label {{ $t('models.bidding.attributes.status') }}
              span.badge(:class="bidding.status")
                | {{ $t('models.bidding.attributes.statuses.' + bidding.status) }}

          .four.columns
            h5.mb-0 {{ this.$t('.actions.title') }}
            hr.mt-0

            .button-container
              .cancel-container(v-if="bidding.cancel_comment && !bidding.comment_response && $ability.canManage('Bidding')")

                .button.button-primary.u-full-width(@click="toggleCancelOverlay(bidding)")
                  | {{ $t('.button.cancelRequest') }}

                hr.mb-2.mt-1

              router-link.router-link.button.u-full-width.button-bidding-lots(:to="{ name: 'lots', params: { covenant_id: bidding.covenant_id, bidding_id: bidding.id  } }")
                | {{ $t('.button.details') }}

              router-link.router-link.button.u-full-width(:to="{ name: 'contracts', params: { bidding_id: bidding.id } }")
                | {{ $t('.button.contracts') }}

              template(v-if="bidding.edict_pdf")
                a.button.u-full-width(:href="biddingEdictPath", download, target="_blank")
                  | {{ $t('.button.edict') }}

              template(v-if="bidding.minute_pdf")
                a.button.u-full-width(:href="biddingAtaPath", download, target="_blank")
                  | {{ $t('.button.minute') }}

              template(v-if="bidding.kind == 'global' && showProposals")
                hr.mb-2.mt-1

                router-link.router-link.button.u-full-width(:to="{ name: 'globalProposals', params: { covenant_id: bidding.covenant_id, bidding_id: bidding.id  } }")
                  | {{ $t('.button.proposals') }}

              hr.mb-2.mt-1(v-if="bidding.status != 'finnished' && bidding.status != 'canceled'  && bidding.status != 'failure'")

              template(v-if="bidding.status == 'waiting' && $ability.canManage('Bidding')")
                .button.button-primary.u-full-width(@click="approveBidding(bidding)")
                  | {{ $t('.button.approve') }}

                .button.button-secondary.u-full-width(@click="showRefuseOverlay = true")
                  | {{ $t('.button.refuse') }}

              .button.button-primary.u-full-width(v-if="bidding.status == 'approved' && $ability.canManage('Bidding')" @click="startBidding(bidding)")
                | {{ $t('.button.start') }}

              .button.button-primary.u-full-width(v-else-if="bidding.status == 'ongoing' && $ability.canManage('Bidding')" @click="reviewBidding(bidding)")
                | {{ $t('.button.review') }}

              .button.button-primary.u-full-width(v-else-if="bidding.status == 'draw' && $ability.canManage('Bidding')" @click="forceReviewBidding(bidding)")
                | {{ $t('.button.draw') }}
        .row
          .four.columns.offset-by-eight(v-if="!isReviewer")
            .button.button-danger.u-full-width(v-if="canFailure" @click="showFailureOverlay = true")
              | {{ $t('.button.failure') }}

    modal-wnd(v-if="showCancelOverlay", :footer="false", @close="showCancelOverlay = false")
      .cancel-container(v-if="cancelOverlayItem")
        h4.mt-2.text-center {{ $t('.cancelOverlay.title') }}
        hr.mt-0.mb-2.o-container

        .alert.alert-warning {{ $t('.cancelOverlay.alert') }}

        .row
          .columns.four
            label.mt-2
              | {{ $t('models.bidding.attributes.title') }}:
            span
              | {{ this.cancelOverlayItem.title }}

          .columns.eight
            label.mt-2
              | {{ $t('.cancelOverlay.reason') }}
            span
              | {{ this.cancelOverlayItem.cancel_comment }}


        textarea-field.mt-2(
          v-model="comment",
          name="comment",
          :label="$t('.cancelOverlay.label')",
          :error="errors.comment_response"
        )

        .mt-2
          .button.button-danger.u-pull-left(@click="approveCancel(cancelOverlayItem.id, cancelOverlayItem.event_id)")
            | {{ $t('.cancelOverlay.button.approve') }}

          .button.button-primary.u-pull-right(@click="reproveCancel(cancelOverlayItem.id, cancelOverlayItem.event_id)")
            | {{ $t('.cancelOverlay.button.reprove') }}

    modal-wnd(v-if="showRefuseOverlay", :footer="false", @close="showRefuseOverlay = false")
      .refuse-container
        h4.mt-2.text-center {{ $t('.refuseOverlay.title') }}
        hr.mt-0.mb-2.o-container

        .alert.alert-info {{ $t('.refuseOverlay.alert') }}

        textarea-field.mt-2(
          v-model="comment",
          name="comment",
          :label="$t('.refuseOverlay.label')",
          :error="errors.comment"
        )

        .mt-2
          .button.button-primary.u-pull-right(@click="reproveBidding()")
            | {{ $t('.refuseOverlay.button') }}

    modal-wnd(v-if="showFailureOverlay", :footer="false", @close="showFailureOverlay = false")
      .refuse-container
        h4.mt-2.text-center {{ $t('.failureOverlay.title') }}
        hr.mt-0.mb-2.o-container

        .alert.alert-info {{ $t('.failureOverlay.alert') }}

        textarea-field.mt-2(
          v-model="comment",
          name="comment",
          :label="$t('.failureOverlay.label')",
          :error="errors.comment"
        )

        .mt-2
          .button.button-primary.u-pull-right(@click="failBidding()")
            | {{ $t('.failureOverlay.button') }}

</template>

<script>
  import view from '@/view.vue'

  export default {
    name: 'bidding',
    data () {
      return {
        i18nScope: 'covenants.biddings.show',
        lol: null,
        bidding: null,
        params: {},
        comment: '',
        errors: {},
        contractId: null,

        cancelOverlayItem: null,
        showCancelOverlay: false,
        showRefuseOverlay: false,
        showFailureOverlay: false
      }
    },

    computed: {
      showProposals() {
        return this.biddingNotOngoingOrDraw
      },

      biddingNotOngoingOrDraw() {
        let status = this.bidding.status
        return status != "ongoing" && status != "draw"
      },

      biddingAtaPath() {
        return this.bidding && this.$http.host + "/" + this.bidding.minute_pdf
      },

      biddingEdictPath() {
        return this.bidding && this.$http.host + "/" + this.bidding.edict_pdf
      },

      canFailure() {
        return (! _.includes(['finnished', 'canceled', 'failure', 'waiting'], this.bidding.status)) && this.$ability.canManage('Bidding')
      },

      isReviewer() {
        if (this.bidding.user_role === 'reviewer') {
          return true
        } else {
          return false
        }
      }
    },

    methods: {
      getBidding() {
        return this.$http.get('/administrator/biddings/' + this.params.id)
          .then((response) => {
            this.bidding = response.data

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      failBidding() {
        let bidding = this.bidding
        let params = { comment: this.comment }

        this.$http.patch('/administrator/biddings/' + bidding.id + '/fail', params)
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.fail.success'))

            bidding.status = 'failure'
            this.comment = ''
            this.getBidding()

            this.showFailureOverlay = false
          })
          .catch((err) => {
            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.errors = this.$i18n.errify(errors, { model: 'bidding' })

            this.$notifications.error(this.$t('.notifications.fail.failure'))
          })
      },

      approveBidding(bidding) {
        this.$http.patch('/administrator/biddings/' + bidding.id + '/approve')
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.approved.success'))

            this.getBidding()

          })
          .catch((err) => {
            this.$notifications.error(this.$t('.notifications.approved.failure'))
          })
      },

      reproveBidding() {
        let params = { comment: this.comment }

        this.$http.patch('/administrator/biddings/' + this.bidding.id + '/reprove', params)
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.reproved.success'))

            this.bidding.status = 'draft'
            this.comment = ''
            this.showRefuseOverlay = false
          })
          .catch((err) => {
            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.errors = this.$i18n.errify(errors, { model: 'bidding' })

            this.$notifications.error(this.$t('.notifications.reproved.failure'))
          })
      },

      startBidding(bidding) {
        this.$http.patch('/administrator/biddings/' + bidding.id + '/ongoing')
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.ongoing.success'))

            this.getBidding()
          })
          .catch((err) => {
            this.$notifications.error(this.$t('.notifications.ongoing.failure'))
          })
      },

      reviewBidding(bidding) {
        this.$http.patch('/administrator/biddings/' + bidding.id + '/review')
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.review.success'))

            this.getBidding()
          })
          .catch((err) => {
            this.$notifications.error(this.$t('.notifications.review.failure'))
          })
      },

      forceReviewBidding(bidding) {
        this.$http.patch('/administrator/biddings/' + bidding.id + '/force_review')
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.review.success'))

            this.getBidding()
          })
          .catch((err) => {
            this.$notifications.error(this.$t('.notifications.review.failure'))
          })
      },

      approveCancel(bidding_id, id) {
        let params = { comment: this.comment }

        this.$http.patch('/administrator/biddings/' + bidding_id + '/cancellation_requests/' + id + '/approve', params)
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.cancel.approve.success'))

            this.getBidding()

            this.showCancelOverlay = false
          })
          .catch((err) => {
            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.errors = this.$i18n.errify(errors, { model: 'bidding' })

            this.$notifications.error(this.$t('.notifications.cancel.approve.failure'))
          })
      },

      reproveCancel(bidding_id, id) {
        let params = { comment: this.comment }

        this.$http.patch('/administrator/biddings/' + bidding_id + '/cancellation_requests/' + id + '/reprove', params)
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.cancel.reprove.success'))

            this.getBidding()

            this.showCancelOverlay = false
          })
          .catch((err) => {
            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.errors = this.$i18n.errify(errors, { model: 'bidding' })

            this.$notifications.error(this.$t('.notifications.cancel.reprove.failure'))
          })
      },

      toggleCancelOverlay(bidding) {
        this.cancelOverlayItem = bidding
        this.showCancelOverlay = true
      },

      parseRoute() {
        let params = {}

        params.id = this.$params.asInteger(this.$route.params.id)

        this.params = params
      }
    },

    created: function () {
      this.parseRoute()
      this.getBidding()
    }
  }

</script>
