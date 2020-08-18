<style scoped lang="scss">
</style>

<template lang="pug">
  .root
    headers(:title="this.$t('.title')")

    .container
      .row.mb-4
        .four.columns
          router-link.u-full-width.button.router-link(:to="{ name: 'users' }")
            | {{ $t('users.index.tabs.users') }}

        .four.columns
          router-link.u-full-width.button.button-primary.router-link(:to="{ name: 'suppliers' }")
            | {{ $t('users.index.tabs.suppliers') }}

        .four.columns
          router-link.u-full-width.button.router-link(:to="{ name: 'admins' }")
            | {{ $t('users.index.tabs.admins') }}

    .container.tool.suppliers.u-cf(v-if="suppliers")
      .card
        span
          | {{ $t('.list.title') }}

        router-link.button.button-primary.u-pull-right.router-link(:to="{ name: 'newSupplier' }" v-if="$ability.canManage('Supplier')")
          | {{ $t('.button.new') }}

      filter-bar(:placeholder="$t('.search.placeholder')", @filter="filter")

      table-list
        table-header(resourceClass='Supplier')
          th.sort-link(@click="sort('name')")
            | {{ $t('models.supplier.attributes.name') }}

            i.fa(:class="sortClass" v-if="this.sortParam === 'name'")

          th.sort-link(@click="sort('cpf')")
            | {{ $t('models.supplier.attributes.cpf') }}

            i.fa(:class="sortClass" v-if="this.sortParam === 'cpf'")

          th.sort-link(@click="sort('email')")
            | {{ $t('models.supplier.attributes.email') }}

            i.fa(:class="sortClass" v-if="this.sortParam === 'email'")

          th
            | {{ $t('models.supplier.attributes.providerName') }}

        tbody(v-if="suppliersCount")
          tr(v-for="supplier in suppliers")
            td
              router-link.router-link(:to="{ name: 'supplier', params: { id: supplier.id } }")
                | {{ supplier.name }}
            td
              router-link.router-link(:to="{ name: 'supplier', params: { id: supplier.id } }")
                | {{ supplier.cpf }}
            td
              router-link.router-link(:to="{ name: 'supplier', params: { id: supplier.id } }")
                | {{ supplier.email }}

            td
              router-link.router-link(:to="{ name: 'supplier', params: { id: supplier.id } }")
                | {{ supplier.provider_name }}

            template(v-if="$ability.canManage('Supplier')")
              td
                router-link.button.router-link(:to="{ name: 'editSupplier', params: { id: supplier.id } }")
                  | {{ $t('btn.edit') }}

              td-destroy(:id="supplier.id", :title="$t('.destroy.title')", :body="$t('.destroy.body')", @success="destroy(supplier.id)")

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
            v-if="suppliersCount"
          )

</template>

<script>
  import parseLinkHeaders from 'parse-link-header'

  export default {
    name: 'suppliers',
    data () {
      return {
        i18nScope: 'suppliers.index',

        // resource
        suppliers: null,
        suppliersCount: null,
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

        return this.$http.get('/administrator/suppliers', { params })
          .then((response) => {
            this.suppliers = response.data
            this.suppliersCount = this.suppliers.length

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

        this.$router.push({ name: 'suppliers', query: data });
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
        return this.$http.delete('/administrator/suppliers/' + id)
          .then((_response) => {
            let idx = this.suppliers.findIndex(p => p.id === id)
            this.suppliers.splice(idx, 1)
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
