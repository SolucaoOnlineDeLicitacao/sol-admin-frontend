<style scoped lang="scss">

  thead {
    background-color: $brownish-grey;
    color: $white;

    a {
      color: $white;
    }
  }

  .badge {
    &.draft {
      background-color: $greyish-brown;
    }

    &.canceled,
    &.failure {
      background-color: $danger-color;
    }

    &.accepted {
      background-color: $apple-green;
    }

    &.desert {
      background-color: $peach;
    }
  }

  ul {
    list-style-type: none;
    list-style: none;
  }


</style>

<template lang="pug">
  .root
    headers(:title="this.$t('.title')")

    .container.tool.biddings.u-cf(v-if="lots")
      .card.mb-2.u-cf.u-full-width(v-for="lot in lots")
        .row
          .columns.eight
            .row.mb-1
              label {{ $t('models.lot.attributes.name') }}
              span.lot-name {{ lot.title }}

            .row.mb-1
              label {{ $t('.lot_group_items_count') }}
              span {{ lot.lot_group_items_count }}

            .row.mb-1
              label {{ $t('models.lot.attributes.status') }}
              span.badge(:class="lot.status")
                | {{ $t('models.lot.attributes.statuses.' + lot.status) }}

          .columns.four.text-center(v-if="showProposals(lot)")
            router-link.router-link.button.mt-4.button-show-proposals(:to="{ name: 'proposals', params: { covenant_id: covenantId, bidding_id: biddingId, lot_id: lot.id  } }")
              | {{ $t('.button.details') }}

        .row.mt-2

          table-list
            thead
              tr
                th
                  | {{ $t('models.group_item.attributes.itemName') }}

                th
                  | {{ $t('models.group_item.attributes.quantity') }}

            tbody(v-if="lot.lot_group_items")
              tr(v-for="lot_group_item in lot.lot_group_items")
                td(width="70%")
                  | {{ lot_group_item.item_short_name }}

                td(width="30%")
                  | {{ $asNumber(lot_group_item.quantity, { precision: 2 }) }}
                  | {{ lot_group_item.item_unit }}

        .row.mt-2(v-if="lot && lot.attachments.length > 0")
          h5.mt-1.mb-1 {{ $t('.files') }}

          hr.mt-0.mb-2

          .container
            ul.mb-0
              li.row(v-for="attachment in lot.attachments")
                a.input-file.mb-1(:href="attachmentPath(attachment)", target="_blank")
                  i.fa.fa-download.mr-1.u-pull-left
                  span.attachment-name.u-pull-left {{ attachment.filename }}

      .row
        .twelve.columns
          paginator(
            v-model="page",
            :first="firstPageLink",
            :prev="prevPageLink",
            :next="nextPageLink",
            :last="lastPageLink",
            v-if="lotsCount"
          )

</template>

<script>
  import parseLinkHeaders from 'parse-link-header'

  export default {
    name: 'lots',
    data () {
      return {
        i18nScope: 'covenants.biddings.lots.index',

        // resource
        lots: null,
        lotsCount: null,
        params: {},

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
    },

    methods: {
      showProposals(lot) {
        let bidding_status = lot.bidding_status
        return this.biddingNotOngoingOrDraw(bidding_status) && this.lotNotDesert(lot) && this.biddingNotGlobal(lot.bidding_kind)
      },

      biddingNotOngoingOrDraw(status) {
        return status != "ongoing" && status != "draw"
      },

      biddingNotGlobal(status) {
        return status != 'global'
      },

      lotNotDesert(lot) {
        return lot.status != 'desert'
      },

      attachmentPath(attachment) {
        if(typeof attachment === 'undefined') return
        return app.secrets.api.host + attachment.url
      },

      fetch() {
        let params = this.params

        return this.$http.get('/administrator/covenants/' + this.covenantId + '/biddings/' + this.biddingId + '/lots', { params })
          .then((response) => {
            this.lots = response.data
            this.lotsCount = this.lots.length

            this.updatePagination(response)

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
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

        this.$router.replace({ name: 'lots', query: data });
      },

      parseRoute() {
        this.covenantId = this.$params.asInteger(this.$route.params.covenant_id)
        this.biddingId = this.$params.asInteger(this.$route.params.bidding_id)
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
