<style scoped lang="scss">
</style>


<template lang="pug">
  .root
    headers(:title="this.$t('.title')")

    .container.tool.covenants.u-cf(v-if="covenants")
      .card
        span
          | {{ $t('.list.title') }}

        router-link.button.button-primary.u-pull-right.router-link(:to="{ name: 'newCovenant' }" v-if="$ability.canManage('Covenant')")
          | {{ $t('.button.new') }}

      filter-bar(:placeholder="$t('.search.placeholder')", @filter="filter")

      table-list
        table-header(resourceClass='Covenant')
          th.sort-link(@click="sort('number')")
            | {{ $t('models.covenant.attributes.number') }}

            i.fa(:class="sortClass" v-if="this.sortParam === 'number'")

          th.sort-link(@click="sort('name')")
            | {{ $t('models.covenant.attributes.name') }}

            i.fa(:class="sortClass" v-if="this.sortParam === 'name'")

          th
            | {{ $t('models.covenant.attributes.cooperativeId') }}

          th
            | {{ $t('models.covenant.attributes.adminId') }}

        tbody(v-if="covenantsCount")
          tr(v-for="covenant in covenants")
            td
              router-link.router-link(:to="{ name: 'covenant', params: { id: covenant.id } }")
                | {{ covenant.number }}
            td
              router-link.router-link(:to="{ name: 'covenant', params: { id: covenant.id } }")
                | {{ covenant.name }}
            td
              router-link.router-link(:to="{ name: 'covenant', params: { id: covenant.id } }")
                | {{ covenant.cooperative_name }} - {{ covenant.cooperative_address_city_name }}

            td
              router-link.router-link(:to="{ name: 'covenant', params: { id: covenant.id } }")
                | {{ covenant.admin_name }}

            template(v-if="$ability.canManage('Covenant')")
              td
                router-link.button.router-link(:to="{ name: 'editCovenant', params: { id: covenant.id } }")
                  | {{ $t('btn.edit') }}

              td-destroy(:id="covenant.id", :title="$t('.destroy.title')", :body="$t('.destroy.body')", @success="destroy(covenant.id)")

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
            v-if="covenantsCount"
          )

</template>

<script>
  import parseLinkHeaders from 'parse-link-header'

  export default {
    name: 'covenants',
    data () {
      return {
        i18nScope: 'covenants.index',

        // resource
        covenants: null,
        covenantsCount: null,
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

        return this.$http.get('/administrator/covenants', { params })
          .then((response) => {
            this.covenants = response.data
            this.covenantsCount = this.covenants.length

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

        this.$router.replace({ name: 'covenants', query: data });
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
        return this.$http.delete('/administrator/covenants/' + id)
          .then((_response) => {
            let idx = this.covenants.findIndex(p => p.id === id)
            this.covenants.splice(idx, 1)
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
