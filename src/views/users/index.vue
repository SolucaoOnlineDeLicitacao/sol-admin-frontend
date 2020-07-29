<style scoped lang="scss">
</style>


<template lang="pug">
  .root
    headers(:title="this.$t('.title')")

    .container
      .row.mb-4
        .four.columns
          router-link.u-full-width.button.button-primary.router-link(:to="{ name: 'users' }")
            | {{ this.$t('.tabs.users') }}

        .four.columns
          router-link.u-full-width.button.router-link(:to="{ name: 'suppliers' }")
            | {{ this.$t('.tabs.suppliers') }}

        .four.columns
          router-link.u-full-width.button.router-link(:to="{ name: 'admins' }")
            | {{ this.$t('.tabs.admins') }}

    .container.tool.users.u-cf(v-if="users")
      .card
        span
          | {{ this.$t('.list.title') }}

        router-link.button.button-primary.u-pull-right.router-link(:to="{ name: 'newUser' }" v-if="$ability.canManage('User')")
          | {{ this.$t('.button.new') }}

      filter-bar(:placeholder="$t('.search.placeholder')", @filter="filter")

      table-list
        table-header(resourceClass='User')
          th.sort-link(@click="sort('name')")
            | {{ $t('models.user.attributes.name') }}

            i.fa(:class="sortClass" v-if="this.sortParam === 'name'")

          th.sort-link(@click="sort('cpf')")
            | {{ $t('models.user.attributes.cpf') }}

            i.fa(:class="sortClass" v-if="this.sortParam === 'cpf'")

          th
            | {{ $t('models.user.attributes.cooperativeName') }}

          th
            | {{ $t('models.user.attributes.email') }}

        tbody(v-if="usersCount")
          tr(v-for="user in users")
            td
              router-link.router-link(:to="{ name: 'user', params: { id: user.id } }")
                | {{ user.name }}
            td
              router-link.router-link(:to="{ name: 'user', params: { id: user.id } }")
                | {{ user.cpf }}
            td
              router-link.router-link(:to="{ name: 'user', params: { id: user.id } }")
                | {{ user.cooperative_name }}

            td
              router-link.router-link(:to="{ name: 'user', params: { id: user.id } }")
                | {{ user.email }}

            template(v-if="$ability.canManage('User')")
              td
                router-link.button.router-link(:to="{ name: 'editUser', params: { id: user.id } }")
                  | {{ $t('btn.edit') }}
              td-destroy(:id="user.id", :title="$t('.destroy.title')", :body="$t('.destroy.body')", @success="destroy(user.id)")

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
            v-if="usersCount"
          )

</template>

<script>
  import parseLinkHeaders from 'parse-link-header'

  export default {
    name: 'users',
    data () {
      return {
        i18nScope: 'users.index',

        // resource
        users: null,
        usersCount: null,
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

        return this.$http.get('/administrator/users', { params })
          .then((response) => {
            this.users = response.data
            this.usersCount = this.users.length

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

        this.$router.push({ name: 'users', query: data });
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
        return this.$http.delete('/administrator/users/' + id)
          .then((_response) => {
            let idx = this.users.findIndex(p => p.id === id)
            this.users.splice(idx, 1)
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
