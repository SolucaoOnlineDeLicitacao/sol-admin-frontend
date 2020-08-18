<style scoped lang="scss">

  thead {
    background-color: $brownish-grey;
    color: $white;

    a {
      color: $white;
    }
  }

  .badge {
    &.waiting_signature {
      background-color: $greyish-brown;
    }

    &.signed {
      background-color: $cerulean;
    }

    &.refused {
      background-color: $danger-color;
    }

    &.partial_execution,
    &.total_inexecution {
      background-color: $peach;
    }

    &.completed {
      background-color: $apple-green;
    }
  }


</style>


<template lang="pug">
  .root
    headers(:title="this.$t('.title', { bidding: biddingTitle })")
    .container
      filter-bar(:placeholder="$t('.search.placeholder')", :defaultClass="false", @filter="filter")

    .container.tool.contracts.u-cf(v-if="contracts")
      table-list
        thead
          tr
            th
              | {{ $t('models.contract.one') }}

            th
              | {{ $t('models.contract.attributes.bidding_title') }}

            th
              | {{ $t('models.contract.attributes.provider_title') }}

            th
              | {{ $t('models.contract.attributes.price_total') }}

            th
              | {{ $t('models.contract.attributes.status') }}

        tbody(v-if="contractsCount")
          tr(v-for="contract in contracts")
            td
              router-link.router-link(:to="{ name: 'contract', params: { id: contract.id } }")
                | {{ contract.title }}
            td
              router-link.router-link(:to="{ name: 'contract', params: { id: contract.id } }")
                | {{ contract.bidding_title }}

            td
              router-link.router-link(:to="{ name: 'contract', params: { id: contract.id } }")
                | {{ contract.provider_title }}

            td
              router-link.router-link(:to="{ name: 'contract', params: { id: contract.id } }")
                | {{ $asCurrency(contract.price_total) }}

            td
              router-link.router-link(:to="{ name: 'contract', params: { id: contract.id } }")
                span.badge(:class="contract.status")
                  | {{ $t('models.contract.attributes.statuses.' + contract.status) }}


        tbody(v-else)
          tr
            td.text-center(colspan='5')
              | {{ $t('.empty') }}

      .row
        .twelve.columns
          paginator(
            v-model="page",
            :first="firstPageLink",
            :prev="prevPageLink",
            :next="nextPageLink",
            :last="lastPageLink",
            v-if="contractsCount"
          )
</template>

<script>
  import parseLinkHeaders from 'parse-link-header'

  export default {
    name: 'contracts',
    data () {
      return {
        i18nScope: 'biddings.contracts.index',

        // resource
        contracts: null,
        contractsCount: null,
        biddingId: null,
        params: {},

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
      biddingTitle() {
        if(this.contracts && this.contracts[0]) {
          return this.contracts[0].bidding_title
        }

        return ''
      },

      fetchParams() {
        return this.params
      }
    },

    methods: {
      fetch() {
        let params = this.params

        return this.$http.get('/administrator/biddings/' + this.biddingId + '/contracts/', { params })
          .then((response) => {
            this.contracts = response.data
            this.contractsCount = this.contracts.length

            this.updatePagination(response)

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      filter(aSearch) {
        this.search = aSearch
        this.fetchSearch()
      },

      fetchSearch() {
        this.params = { search: this.search }

        this.updateRoute()
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

      updateRoute() {
        let data = Object.assign({}, this.$route.query, this.params);

        this.$router.push({ name: 'contracts', query: data });
      },

      init() {
        this.parseRoute()
        this.params = this.$route.query
      },

      parseRoute() {
        this.biddingId = this.$params.asInteger(this.$route.params.bidding_id)
      },
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
