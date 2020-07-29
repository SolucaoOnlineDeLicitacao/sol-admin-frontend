<style scoped lang="scss">
</style>


<template lang="pug">
  .root
    headers(:title="this.$t('.title')")

    .container.tool.cooperatives.u-cf(v-if="cooperatives")
      .card
        span
          | {{ this.$t('.list.title') }}

        router-link.button.button-primary.u-pull-right.router-link(:to="{ name: 'newCooperative' }" v-if="$ability.canManage('Cooperative')")
          | {{ this.$t('.button.new') }}

      filter-bar(:placeholder="$t('.search.placeholder')", @filter="filter")

      table-list
        table-header(resourceClass='Cooperative')
          th.sort-link(@click="sort('name')")
            | {{ $t('models.cooperative.attributes.name') }}

            i.fa(:class="sortClass" v-if="this.sortParam === 'name'")

          th.sort-link(@click="sort('cnpj')")
            | {{ $t('models.cooperative.attributes.cnpj') }}

            i.fa(:class="sortClass" v-if="this.sortParam === 'cnpj'")

          th
            | {{ $t('models.cooperative.attributes.city') }}

        tbody(v-if="cooperativesCount")
          tr(v-for="cooperative in cooperatives")
            td
              router-link.router-link(:to="{ name: 'cooperative', params: { id: cooperative.id } }")
                | {{ cooperative.name }}
            td
              router-link.router-link(:to="{ name: 'cooperative', params: { id: cooperative.id } }")
                | {{ cooperative.cnpj }}
            td
              router-link.router-link(:to="{ name: 'cooperative', params: { id: cooperative.id } }")
                | {{ cooperative.address.city_name }}

            template(v-if="$ability.canManage('Cooperative')")
              td
                router-link.button.router-link(:to="{ name: 'editCooperative', params: { id: cooperative.id } }")
                  | {{ $t('btn.edit') }}

              td-destroy(:id="cooperative.id", :title="$t('.destroy.title')", :body="$t('.destroy.body')", @success="destroy(cooperative.id)")

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
            v-if="cooperativesCount"
          )

</template>

<script>
  import parseLinkHeaders from 'parse-link-header'

  export default {
    name: 'cooperatives',
    data () {
      return {
        i18nScope: 'cooperatives.index',

        // resource
        cooperatives: null,
        cooperativesCount: null,
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
      }
    },

    methods: {
      fetch() {
        let params = this.params

        return this.$http.get('/administrator/cooperatives', { params })
          .then((response) => {
            this.cooperatives = response.data
            this.cooperativesCount = this.cooperatives.length

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

        this.$router.push({ name: 'cooperatives', query: data });
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

      destroy(id) {
        return this.$http.delete('/administrator/cooperatives/' + id)
          .then((_response) => {
            let idx = this.cooperatives.findIndex(p => p.id === id)
            this.cooperatives.splice(idx, 1)
            this.$notifications.info(this.$t('.notifications.destroy.success', { id }))
          })
          .catch((_err) => {
            this.$notifications.error(this.$t('.notifications.destroy.failure', { id }))
          })
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
