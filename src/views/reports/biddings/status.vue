<style scoped lang="scss">

  .chart {
    height: 350px;
  }

  .card-header {
    padding: 10px 20px;
    margin: -20px -20px 0;
    border-bottom: solid 1px #c4c4c4;

    &.draft,
    &.closed,
    &.draw,
    &.waiting {
      color: $greyish-brown;
    }

    &.ongoing {
      color: $cerulean;
    }

    &.canceled,
    &.failure {
      color: $danger-color;
    }

    &.suspended,
    &.under_review {
      color: $peach;
    }

    &.approved,
    &.finnished,
    &.accepted {
      color: $apple-green;
    }
  }

  .card-body {
    margin-top: 10px;
  }

  h6 {
    font-size: 18px;
  }
</style>

<template lang="pug">
  .root
    headers(:title="this.$t('.title')")

    .container
      .row.mb-1
        .three.columns
          router-link.u-full-width.button.button-primary.router-link(:to="{ name: 'biddingStatusReport' }")
            | {{ $t('.tabs.status') }}

        .three.columns
          router-link.u-full-width.button.router-link(:to="{ name: 'contractClassificationReport' }")
            | {{ $t('.tabs.contracts') }}

        .three.columns
          router-link.u-full-width.button.router-link(:to="{ name: 'generalReports' }")
            | {{ $t('.tabs.index') }}

        .three.columns
          router-link.button.u-full-width.router-link(:to="{ name: 'reports' }")
            | {{ $t('.tabs.reports') }}

      hr

    .container
      .row
        h4
          | {{ $t('.report_name') }}
          .button.button-primary.u-pull-right(@click="generateReport")
            | {{ $t('.button.download') }}

    .container
      .row
        .card.mb-2
          .card-header
            | {{ $t('.chart.title') }}
          .card-body
            horizontal-bar-chart.chart(v-if="loaded", :chartdata="chartData", :options="chartOptions")

            hr

            .row
              .columns.six
                h6.mb-1 {{ $t('.dashboard.total') }}
                strong
                  | {{ this.biddingTotal }}

              .columns.six
                h6.mb-1 {{ $t('.dashboard.value') }}
                strong
                  | {{ $asCurrency(this.estimatedCostTotal) }}


      .row.card-group(v-for="results in groupedResults")
        .columns.four(v-for="result in results")
          .card.mb-2
            .card-header(:class="result.label")
              h6.mb-0 {{ biddingStatusT(result.label) }}
            .card-body
              label {{ $t('.card.total') }}
              span {{ result.data.countable }}

              label.mt-1 {{ $t('.card.value') }}
              span
                | {{ $asCurrency(result.data.estimated_cost) }}

</template>

<script>
  import variables from '@/assets/styles/variables.scss';

  export default {
    name: 'biddingStatusReport',

    data () {
      return {
        i18nScope: 'reports.biddings.status',
        downloading: false,
        loaded: false,
        results: [],
        reports: {},
        estimatedCostTotal: 0,
        biddingTotal: 0,
        chartData: [],
        chartOptions: {},
        groupedResults: [],
        baseUrl: process.env.BASE_URL
      }
    },

    computed: {
      downloadText() {
        if (this.downloading) return this.$t('.button.downloading')
        return this.$t('.button.download')
      },

      defaultChartOptions() {
        return {
          maintainAspectRatio: false,
          responsive: true,
          animation: { duration: 2000 },
          legend: { display: false },
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      },

      biddingStatusColors() {
        return {
          approved: variables.appleGreen,
          canceled: variables.paleRed,
          closed: variables.greyishBrown,
          draft: variables.greyishBrown,
          failure: variables.paleRed,
          finnished: variables.appleGreen,
          ongoing: variables.cerulean,
          under_review: variables.peach,
          waiting: variables.greyishBrown,
          suspended: variables.peach,
          draw: variables.greyishBrown
        }
      }
    },

    methods: {
      biddingStatusT(status) {
        return this.$t('models.bidding.attributes.statuses.' + status)
      },

      fetch() {
        let params = this.params

        return this.$http.get('/administrator/reports/biddings', { params })
          .then((response) => {
            this.results  = response.data
            this.groupedResults = _.chunk(this.results, 3)

            this.initChart()

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      generateReport() {
        let params = { report: { report_type: "biddings" } }

        this.downloading = true

        return this.$http.post('/administrator/reports/', params)
          .then((response) => {

            this.downloading = false

            this.$router.replace({ name: 'reports', params: { type: 'biddings' } })
          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      initChart() {
        let data = []
        let labels = []
        let colors = []
        let that = this

        this.results.filter(function(elem){
          labels.push(that.biddingStatusT(elem.label))
          data.push(elem.data.countable)
          colors.push(that.biddingStatusColors[elem.label])

          that.estimatedCostTotal += parseFloat(elem.data.estimated_cost)
          that.biddingTotal += elem.data.countable
        });

        this.chartData = {
          labels: labels,
          datasets: [{ data: data, backgroundColor: colors }]
        }

        this.chartOptions = this.defaultChartOptions

        this.loaded = true
      }
    },

    mounted: function() {
      this.fetch()
    }
  }

</script>
