<style scoped lang="scss">
  .dashboard-container {
    margin-top: 20px;

    h2 {
      font-size: 20px;
      letter-spacing: 0.3px;
      color: $greyish-brown-two;
    }
  }

  .card-icon {
    color: $white;
    text-align: center;
    height: 90px;
    line-height: 86px;
    border-radius: 2px;
  }

  .card-text-title {
    font-size: 25px;
    font-weight: 500;
    letter-spacing: 0.4px;
    color: $greyish-brown-two;
  }

  .card {
    &.blue {
      .card-icon {
        background-color: $sky-blue;
      }
    }

    &.green {
      .card-icon {
        background-color: $turquoise-blue;
      }
    }

    &.orange {
      .card-icon {
        background-color: $peach;
      }
    }
  }

</style>

<template lang="pug">
  .root
    headers(title='Dashboard' classes='')
    ll-map(:markers="markers" :classes='loadingClasses', @boundsChanged="updateBounds")

    .container.tool.home.mb-2
      .row.dashboard-container
        .columns.six
          .card
            h2 {{ $t('.features.title') }}

            .card.slim.blue.u-full-width.row.mb-2

              .card-icon.columns.three
                i.fa.fa-3x.fa-users

              .card-text.columns.nine
                .card-text-title
                  strong(v-if="loadedDashboard")
                    | {{ dashboard.cooperatives_total }}
                  strong(v-else)
                    i.fa.fa-spinner.fa-pulse.fa-fw.fa-1x
                .card-text-description
                  | {{ $t('.features.cooperatives_total') }}

            .card.slim.green.u-full-width.row.mb-2

              .card-icon.columns.three
                i.fa.fa-3x.fa-building

              .card-text.columns.nine
                .card-text-title
                  strong(v-if="loadedDashboard")
                    | {{ dashboard.providers_total }}
                  strong(v-else)
                    i.fa.fa-spinner.fa-pulse.fa-fw.fa-1x
                .card-text-description
                  | {{ $t('.features.providers_total') }}

            .card.slim.orange.u-full-width.row

              .card-icon.columns.three
                i.fa.fa-3x.fa-shopping-cart

              .card-text.columns.nine
                .card-text-title
                  strong(v-if="loadedDashboard")
                    | {{ dashboard.ongoing_licitations_total }}
                  strong(v-else)
                    i.fa.fa-spinner.fa-pulse.fa-fw.fa-1x
                .card-text-description
                  | {{ $t('.features.ongoing_licitations_total') }}

        .columns.six
          .card
            h2
              router-link.router-link(:to=" { name: 'notifications' }")
                | {{ $t('.notifications.title') }}

            template(v-if="notificationsCount > 0")
              .row(v-for="(notification) in notifications")
                notification-list-item(:notification="notification")
            template(v-else)
              | {{ $t('.notifications.empty') }}

</template>


<script>

  export default {
    name: 'home',
    data () {
      return {
        i18nScope: 'home',
        markers: null,
        dashboard: null,
        loadedDashboard: false,
        notifications: null,
        notificationsCount: null,
        loadingClasses: 'loading-map',
        bounds: {},
        params: {}
      }
    },

    computed: {
      normalizedBounds() {
        let bounds = this.bounds

        if(!bounds || !bounds._northEast || !bounds._southWest) return this.defaultBounds

        return {
          bounds: {
            north: bounds._northEast.lat,
            east: bounds._northEast.lng,
            south: bounds._southWest.lat,
            west: bounds._southWest.lng,
          }
        }
      },

      defaultBounds() {
        return {
          bounds: {
            north: -11.30192133529738,
            east: -36.338825225830085,
            south: -13.341123466494878,
            west: -44.221515655517585
          }
        }
      }
    },

    methods: {
      assignMarkers() {
        this.markers = this.dashboard.markers
      },

      updateBounds(aBounds) {
        this.bounds = aBounds
      },

      fetchDashboard() {
        let params = Object.assign({}, this.params, this.normalizedBounds);

        return this.$http.get('/administrator/dashboard', { params: params })
          .then((response) => {
            this.dashboard = response.data

            this.notifications = this.dashboard.notifications
            this.notificationsCount = this.notifications.length

            this.assignMarkers()

            this.loadingClasses = ''

            this.loadedDashboard = true
          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      }
    },

    created: function () {
      this.fetchDashboard()
    },

    watch: {
      normalizedBounds() {
        this.fetchDashboard()
      }
    }
  }
</script>
