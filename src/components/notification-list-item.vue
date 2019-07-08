<style scoped lang="scss">
  .list-item {
    cursor: pointer;

    &.read {
      .card {
        background-color: #ecedf4;
      }
    }

    .list-text {
      width: calc(100% - 80px);
    }

    .list-icon {
      width: 70px;
      margin-right: 10px;
      text-align: center;
    }
  }

</style>

<template lang="pug">
  .list-item(v-if="notification", :class="{ read: notification.read_at }")
    .card.u-cf.u-full-width.mb-1
      .list-icon.u-pull-left
        i.fa.fa-2x.fa-envelope(:class="{ 'fa-envelope-open': notification.read_at }")
      .list-text.u-pull-left(@click="clickedNotification(notification)")
        .list-title
          strong {{ notification.title }}
        .mb-1(v-html="notification.body")
        i.small {{ $i18n.fromNow(notification.created_at) }}

</template>

<script>
  export default {
    name: 'NotificationListItem',

    props: {
      notification: { type: Object }
    },

    methods: {
      parseNotificationPath(notification) {
        let action = notification.action

        if((/^(bidding)/i).test(action)) return this.biddingRoute(notification)
        if((/^(proposal\.lot)/i).test(action)) return this.proposalsRoute(notification)
        if((/^(proposal)/i).test(action)) return this.globalProposalsRoute(notification)
        if((/^(contract)/i).test(action)) return this.contractRoute(notification)
      },

      contractRoute(notification) {
        let args = notification.args

        return { name: 'contract', params: { id: notification.notifiable_id, bidding_id: args.bidding_id } }
      },

      biddingRoute(notification) {
        return { name: 'bidding', params: { id: notification.notifiable_id } }
      },

      proposalsRoute(notification) {
        let params = this.proposalsRouteParams(notification)

        return { name: 'proposals', params: params }
      },

      globalProposalsRoute(notification) {
        let params = this.baseProposalParams(notification)

        return { name: 'globalProposals', params: params }
      },

      baseProposalParams(notification) {
        let args = notification.args

        return args && { covenant_id: args.covenant_id, bidding_id: args.bidding_id }
      },

      proposalsRouteParams(notification) {
        let args = notification.args

        return Object.assign(this.baseProposalParams(notification), { lot_id: args.lot_id })
      },

      clickedNotification(notification) {
        let route = this.parseNotificationPath(notification)

        this.markAsRead(notification.id)

        if (route) this.$router.push(route)
      },

      markAsRead(notification_id) {
        this.$http.patch('/administrator/notifications/' + notification_id + '/mark_as_read')
          .then((response) => { console.log('read') })
      },


    }
  }
</script>
