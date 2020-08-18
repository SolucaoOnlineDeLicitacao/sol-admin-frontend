<style scoped lang="scss">
 // .action {
 //    width: 25%;
 //  }

 //  .filter-bar {
 //    padding: 10px 20px;
 //    background-color: $greyish-brown;

 //    form,
 //    .input-field,
 //    button {
 //      margin-bottom: 0;
 //    }

 //  }

 //  thead {
 //    background-color: $brownish-grey;
 //    color: $white;

 //    a {
 //      color: $white;
 //    }
 //  }

 //  table {
 //    td,
 //    th {
 //      padding: 20px;

 //      a {
 //        text-decoration: none;
 //        color: inherit;
 //      }
 //    }

 //    tbody {
 //      background-color: $white;
 //    }

 //  }

 //  .sort-link {
 //    text-decoration: none;
 //    cursor: pointer;

 //    > .fa {
 //      margin-left: 4px;
 //    }
 //  }

 //  .search-field {
 //    position: relative;

 //    > .fa {
 //      cursor: pointer;
 //      position: absolute;
 //      right: 10px;
 //      top: 12px;
 //    }
 //  }

</style>


<template lang="pug">
  .root
    headers(:title="this.$t('.title')")

    .container.tool.providers.u-cf(v-if="providers")
      .card
        span
          | {{ $t('.list.title') }}

        router-link.button.button-primary.u-pull-right.router-link(:to="{ name: 'newProvider' }" v-if="$ability.canManage('Provider')")
          | {{ $t('.button.new') }}

      filter-bar(:placeholder="$t('.search.placeholder')", @filter="filter")

      table-list
        table-header(resourceClass='Provider')
          th.sort-link(@click="sort('name')")
            | {{ $t('models.provider.attributes.name') }}

            i.fa(:class="sortClass" v-if="this.sortParam === 'name'")

          th.sort-link(@click="sort('document')")
            | {{ $t('models.provider.attributes.document') }}

            i.fa(:class="sortClass" v-if="this.sortParam === 'document'")

          th
            | {{ $t('models.provider.attributes.city') }}

        tbody(v-if="providersCount")
          tr(v-for="provider in providers")
            td
              router-link.router-link(:to="{ name: 'provider', params: { id: provider.id } }")
                template(v-if="provider.blocked")
                  i.fa.fa-ban
                | {{ provider.name }}
            td
              router-link.router-link(:to="{ name: 'provider', params: { id: provider.id } }")
                | {{ provider.document }}
            td
              router-link.router-link(:to="{ name: 'provider', params: { id: provider.id } }")
                | {{ provider.address.city_name }}

            template(v-if="$ability.canManage('Provider')")
              td
                router-link.button.router-link(:to="{ name: 'editProvider', params: { id: provider.id } }")
                  | {{ $t('btn.edit') }}

              td-destroy(:id="provider.id", :title="$t('.destroy.title')", :body="$t('.destroy.body')", @success="destroy(provider.id)")

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
            v-if="providersCount"
          )

</template>

<script>
  import parseLinkHeaders from 'parse-link-header'

  export default {
    name: 'providers',
    data () {
      return {
        i18nScope: 'providers.index',

        // resource
        providers: null,
        providersCount: null,
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

        return this.$http.get('/administrator/providers', { params })
          .then((response) => {
            this.providers = response.data
            this.providersCount = this.providers.length

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

        this.$router.push({ name: 'providers', query: data });
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
        return this.$http.delete('/administrator/providers/' + id)
          .then((_response) => {
            let idx = this.providers.findIndex(p => p.id === id)
            this.providers.splice(idx, 1)
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
