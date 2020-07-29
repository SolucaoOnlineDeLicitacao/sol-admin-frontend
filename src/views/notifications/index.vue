<template lang="pug">
  .root
    headers(:title="this.$t('.title')")

    .container
      switch-field.u-pull-right(
        name="unreads",
        v-model="unreads",
        :label="this.$t('.unread')"
      )
    .container.tool.notifications.u-cf
      template(v-if="notificationsCount")
        .row(v-for="(notification) in notifications")
          notification-list-item(:notification="notification")
      template(v-else)
        .text-center
          | {{ $t('.empty') }}

      .row.mb-3
        .twelve.columns
          paginator(
            v-model="page",
            :first="firstPageLink",
            :prev="prevPageLink",
            :next="nextPageLink",
            :last="lastPageLink",
            v-if="notificationsCount"
          )

</template>

<script>
  import parseLinkHeaders from 'parse-link-header'

  export default {
    name: 'notifications',
    data () {
      return {
        i18nScope: 'notifications.index',

        // resource
        unreads: false,
        notifications: null,
        notificationsCount: null,

        tabs: [
          {
            route: { name: 'home' },
            icon: 'fa-map',
            text: 'Mapa',
            active: false,
          },

          {
            route: { name: 'notifications' },
            icon: 'fa-envelope',
            text: 'Notificações',
            active: true,
          }
        ],

        showOverlay: false,
        overlayNotification: {},

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
        let filterParams = this.unreads ? { unreads: this.unreads } : {}
        let params = Object.assign({}, this.params, filterParams);

        return this.$http.get('/administrator/notifications', { params })
          .then((response) => {
            this.notifications = response.data
            this.notificationsCount = this.notifications.length

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

        this.$router.push({ name: 'notifications', query: data });

        this.fetch()
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
        this.fetch()
      }
    },

    created: function () {
      this.$emit('tabChanged', this.tabs)
      this.$emit('navbarTitleChanged', 'Notificações')

      this.init();
    },

    watch: {
      fetchParams() {
        this.fetch()
      },

      unreads() {
        this.fetch()
      },

      page() {
        this.params = Object.assign({}, this.params, { page: this.page });
        this.updateRoute()
      }
    }
  }

</script>
