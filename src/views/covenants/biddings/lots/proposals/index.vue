<style scoped lang="scss">
  thead {
    background-color: $brownish-grey;
    color: $white;

    a {
      color: $white;
    }
  }

  h6 {
    font-size: 18px;
    font-weight: 700;
    color: $greyish-brown-two;
  }

  .price-total {
    font-size: 20px;
    letter-spacing: 0.3px;
  }

  .price-container {
    padding: 10px;

    &.refused,
    &.coop_refused {
      background-color: rgba(255, 95, 64, 0.05);
      border: solid 1px #ff5f40;
    }

    &.accepted,
    &.coop_accepted {
      background-color: rgba(126, 211, 33, 0.05);
      border: solid 1px #6ba62a;
    }
  }

</style>

<template lang="pug">
  .root
    headers(:title="this.$t('.title')")
    .container.tool.biddings.u-cf(v-if="isLoading")
      .alert.alert-info
        | {{ $t('.loading') }}

    .container.tool.biddings.u-cf(v-else-if="proposalsCount > 0")
      .card.mb-2.u-cf.u-full-width(v-for="proposal in proposals")
        h4.mb-1.mt-1
          | {{ $t('.proposal.status', { status: $t('models.proposal.attributes.statuses.' + proposal.status) }) }}

        hr.mb-1.mt-1

        h6 {{  $t('models.provider.one') }}

        .row
          .six.columns
            label {{ $t('models.provider.attributes.name') }}
            span.provider-title {{ proposal.provider.name }}

          .six.columns
            label {{ $t('models.provider.attributes.document') }}
            span {{ proposal.provider.document }}

        .row
          .six.columns
            label {{ $t('models.address.attributes.neighborhood') }}
            span {{ proposal.provider.address.neighborhood }}

          .three.columns
            label {{ $t('models.address.attributes.cityName') }}
            span {{ proposal.provider.address.city_name }}

          .three.columns
            label {{ $t('models.address.attributes.cep') }}
            span {{ proposal.provider.address.cep }}

        h6.mt-0 {{ $t('models.legal_representative.one') }}

        .row
          .six.columns
            label {{ $t('models.legal_representative.attributes.name') }}
            span {{ proposal.provider.legal_representative.name }}

          .three.columns
            label {{ $t('models.legal_representative.attributes.rg') }}
            span {{ proposal.provider.legal_representative.rg }}

          .three.columns
            label {{ $t('models.legal_representative.attributes.cpf') }}
            span {{ proposal.provider.legal_representative.cpf }}

        h6.mt-1.mb-1 {{ $t('.proposal.value') }}

        .price-container.mb-2(:class="proposal.status")
          span {{ $t('.proposal.total') }}
          span.ml-1.price-total
            |  {{ $asCurrency(proposal.price_total) }}

          .row.mt-1(v-if="proposal.status == 'coop_refused'")
            strong {{ $t('.proposal.refuse') }}
            |  {{ proposal.comment }}

        table-list
          thead
            tr
              th
                | {{ $t('models.group_item.attributes.itemName') }}

              th
                | {{ $t('models.group_item.attributes.quantity') }}

              th
                | {{ $t('models.lot_group_item_lot_proposal.attributes.price') }}

          tbody(v-if="proposal.lot_group_item_lot_proposals")
            tr(v-for="lot_group_item_lot_proposal in proposal.lot_group_item_lot_proposals")
              td(width="50%")
                | {{ lot_group_item_lot_proposal.lot_group_item.item_short_name }}

              td(width="20%")
                | {{ $asNumber(lot_group_item_lot_proposal.lot_group_item.quantity, { precision: 2 }) }}

              td(width="30%")
                |  {{ $asCurrency(lot_group_item_lot_proposal.price) }}

                |  / {{ lot_group_item_lot_proposal.lot_group_item.item_unit }}

        .row(v-if="proposal.status == 'coop_refused'")
          .button.button-danger.button-cancel-refuse-proposal(@click="toggleCancelRefuseOverlay(proposal)")
            | {{ $t('.button.cancelRefuse') }}

          .button.button-success.u-pull-right.button-confirm-refuse-proposal(@click="confirmRefuse(proposal)")
            | {{ $t('.button.confirmRefuse') }}

        .row(v-else-if="proposal.status == 'coop_accepted'")
          .button.button-danger.button-reprove-proposal(@click="toggleReproveProposalOverlay(proposal)")
            | {{ $t('.button.reproveProposal') }}

          .button.button-success.u-pull-right.button-approve-proposal(@click="confirmAccept(proposal)")
            | {{ $t('.button.confirmAccept') }}

    .container.tool.biddings.u-cf(v-else)
      .alert.alert-info
        | {{ $t('.empty') }}

    .row
      .twelve.columns
        paginator(
          v-model="page",
          :first="firstPageLink",
          :prev="prevPageLink",
          :next="nextPageLink",
          :last="lastPageLink",
          v-if="proposalsCount"
        )

    modal-wnd(v-if="showCancelRefuseOverlay", :footer="false", @close="showCancelRefuseOverlay = false")
      .refuse-container
        h4.mt-2.text-center {{ $t('.cancelRefuseOverlay.title') }}
        hr.mt-0.mb-2.o-container

        .alert.alert-info {{ $t('.cancelRefuseOverlay.alert') }}

        textarea-field.mt-2(
          v-model="comment",
          name="comment",
          :label="$t('.cancelRefuseOverlay.label')",
          :error="errors.comment"
        )

        .mt-2
          .button.button-primary.u-pull-right(@click="failProposal(proposal)")
            | {{ $t('.cancelRefuseOverlay.button') }}

    modal-wnd(v-if="showReproveProposalOverlay", :footer="false", @close="showReproveProposalOverlay = false")
      .refuse-container
        h4.mt-2.text-center {{ $t('.reproveProposalOverlay.title') }}
        hr.mt-0.mb-2.o-container

        .alert.alert-info {{ $t('.reproveProposalOverlay.alert') }}

        textarea-field.mt-2(
          v-model="comment",
          name="comment",
          :label="$t('.reproveProposalOverlay.label')",
          :error="errors.comment"
        )

        .mt-2
          .button.button-primary.u-pull-right(@click="failProposal(proposal)")
            | {{ $t('.reproveProposalOverlay.button') }}

</template>

<script>
  import parseLinkHeaders from 'parse-link-header'

  export default {
    name: 'proposals',
    data () {
      return {
        i18nScope: 'covenants.biddings.lots.proposals.index',

        // resource
        proposals: null,
        proposal: null,
        proposalsCount: null,
        params: {},
        isLoading: true,

        // modals
        showCancelRefuseOverlay: false,
        showReproveProposalOverlay: false,
        comment: '',
        errors: {},

        //search
        search: '',
        searching: false,

        // pagination
        page:          1,
        firstPageLink: '',
        prevPageLink:  '',
        nextPageLink:  '',
        lastPageLink:  '',
        totalPages:    1,
      }
    },

    computed: {
      fetchParams() {
        return this.params
      },

      sortClass() {
        return (this.orderParam === 'asc') ? 'fa-caret-down' : 'fa-caret-up'
      }
    },

    methods: {
      fetch() {
        let params = this.params

        this.isLoading = true

        return this.$http.get('/administrator/covenants/' + this.covenantId + '/biddings/' + this.biddingId + '/lots/' + this.lotId + '/lot_proposals', { params })
          .then((response) => {

            this.isLoading = false

            this.proposals = response.data
            this.proposalsCount = this.proposals.length

            this.updatePagination(response)

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      toggleCancelRefuseOverlay(proposal) {
        this.proposal = proposal
        this.showCancelRefuseOverlay = true
      },

      toggleReproveProposalOverlay(proposal) {
        this.proposal = proposal
        this.showReproveProposalOverlay = true
      },

      confirmAccept(proposal) {
        this.$http.patch('/administrator/lot_proposals/' + proposal.id + '/accept')
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.accept.success'))

            proposal.status = 'accepted'
          })
          .catch((err) => {
            this.$notifications.error(this.$t('.notifications.accept.failure'))
          })
      },

      confirmRefuse(proposal) {
        this.$http.patch('/administrator/lot_proposals/' + proposal.id + '/refuse')
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.refuse.success'))

            proposal.status = 'refused'
          })
          .catch((err) => {
            this.$notifications.error(this.$t('.notifications.refuse.failure'))
          })
      },

      failProposal() {
        let params = { comment: this.comment }

        this.$http.patch('/administrator/lot_proposals/' + this.proposal.id + '/fail', params)
          .then((response) => {
            this.$notifications.clear()
            this.$notifications.info(this.$t('.notifications.fail.success'))

            this.comment = ''
            this.showCancelRefuseOverlay = false
            this.showReproveProposalOverlay = false

            this.fetch()
          })
          .catch((err) => {
            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.errors = this.$i18n.errify(errors, { model: 'bidding' })

            this.$notifications.error(this.$t('.notifications.fail.failure'))
          })
      },

      updatePagination(aResponse) {
        this.page = aResponse.headers['x-page']
        this.totalPages = aResponse.headers['x-total']
        let links = parseLinkHeaders(aResponse.headers.link) || {}

        this.firstPageLink = _.dig(links, 'first', 'page')
        this.prevPageLink = _.dig(links, 'prev', 'page')
        this.nextPageLink = _.dig(links, 'next', 'page')
        this.lastPageLink = _.dig(links, 'last', 'page')
      },

      fetchSearch() {
        this.params = { search: this.search }

        this.updateRoute()
      },

      updateRoute() {
        let data = Object.assign({}, this.$route.query, this.params);

        this.$router.replace({ name: 'proposals', query: data });
      },

      parseRoute() {
        this.covenantId = this.$params.asInteger(this.$route.params.covenant_id)
        this.biddingId = this.$params.asInteger(this.$route.params.bidding_id)
        this.lotId = this.$params.asInteger(this.$route.params.lot_id)
      },

      init() {
        this.parseRoute()
        this.params = this.$route.query
      }
    },

    created: function () {
      this.init();
    },

    watch: {
      fetchParams() {
        this.fetch()
      },

      page() {
        this.params = Object.assign({}, this.params, { page: this.page });
        this.updateRoute()
      }
    }
  }

</script>
