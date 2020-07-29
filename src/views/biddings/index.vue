<style scoped lang="scss">

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

  .bidding-description {
    min-height: 50px;
  }

  .cooperative-name {
    min-height: 70px;
  }

</style>


<template lang="pug">
  .root
    headers(:title="this.$t('.title')")

    .container.tool.biddings.u-cf(v-if="biddings")
      filter-bar(:placeholder="$t('.search.placeholder')", :defaultClass="false", @filter="filter")

      .row.card-group(v-for="lineBiddings in groupedBiddings")
        .columns.four(v-for="bidding in lineBiddings")
          .card.bidding-card.mb-2
            .row
              span.title.bidding-title {{ bidding.title }}

            hr.mt-1.mb-1.o-container

            .row.mb-1
              label {{ $t('models.bidding.attributes.description') }}
              .bidding-description {{ bidding.description }}

            .row.mb-1
              label {{ $t('models.cooperative.one') }}
              .cooperative-name {{ bidding.cooperative.name }}

            .row.mb-1
              label {{ $t('models.bidding.attributes.status') }}
              span.badge(:class="bidding.status")
                | {{ $t('models.bidding.attributes.statuses.' + bidding.status) }}

            .row
              hr.mb-2.mt-2

              router-link.router-link.button.u-full-width.mb-0(:to="{ name: 'bidding', params: { id: bidding.id }}")
                | {{ $t('.details') }}

      .row
        .twelve.columns
          paginator(
            v-model="page",
            :first="firstPageLink",
            :prev="prevPageLink",
            :next="nextPageLink",
            :last="lastPageLink",
            v-if="biddingsCount"
          )

</template>

<script>
  import parseLinkHeaders from 'parse-link-header'

  export default {
    name: 'allBiddings',
    data () {
      return {
        i18nScope: 'covenants.biddings.index',

        // resource
        biddings: null,
        biddingsCount: null,
        params: {},

        //search
        search: '',
        searching: false,

        // sort
        sortParam: 'name',
        orderParam: 'asc',

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
      },

      groupedBiddings() {
        let grouped = [];
        let index = -1;
        for (let i = 0; i < this.biddings.length; i++) {
          if (i % 3 == 0) {
            index++;
            grouped[index] = [];
          }

          grouped[index].push(this.biddings[i]);
        }

        return grouped;
      }

    },

    methods: {
      fetch() {
        let params = this.params

        return this.$http.get('/administrator/biddings', { params })
          .then((response) => {
            this.biddings = response.data
            this.biddingsCount = this.biddings.length

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

      filter(aSearch) {
        this.search = aSearch
        this.fetchSearch()
      },

      fetchSearch() {
        this.params = { search: this.search }

        this.updateRoute()
      },

      updateRoute() {
        let data = Object.assign({}, this.$route.query, this.params);

        this.$router.push({ name: 'allBiddings', query: data });
      },

      sort(aSort) {
        if(aSort === this.sortParam) {
          this.orderParam = this.orderParam==='asc' ? 'desc' : 'asc';
        }

        this.sortParam = aSort;

        let sortParams = { sort_column: this.sortParam, sort_direction: this.orderParam }

        this.params = Object.assign({}, this.params, sortParams);

        this.updateRoute()
      },

      init() {
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
