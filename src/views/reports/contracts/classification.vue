<style scoped lang="scss">

  .chart {
    height: 350px;
  }

  .card-header {
    padding: 10px 20px;
    margin: -20px -20px 0;
    border-bottom: solid 1px #c4c4c4;
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
          router-link.u-full-width.button.router-link(:to="{ name: 'biddingStatusReport' }")
            | {{ $t('.tabs.status') }}

        .three.columns
          router-link.u-full-width.button.button-primary.router-link(:to="{ name: 'contractClassificationReport' }")
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
            | {{ this.$t('.button.download') }}

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
                  | {{ this.contractTotal }}

              .columns.six
                h6.mb-1 {{ $t('.dashboard.value') }}
                strong
                  | {{ $asCurrency(this.priceTotal) }}


      .row.card-group(v-for="results in groupedResults")
        .columns.four(v-for="result in results")
          .card.mb-2
            .card-header
              h6.mb-0 {{ result.label }}
            .card-body
              label {{ $t('.card.total') }}
              span {{ result.data.countable }}

              label.mt-1 {{ $t('.card.value') }}
              span
                | {{ $asCurrency(result.data.price_total) }}



</template>

<script>
  export default {
    name: 'contractClassificationReport',

    data () {
      return {
        i18nScope: 'reports.contracts.classification',
        downloading: false,
        loaded: false,
        results: [],
        priceTotal: 0,
        contractTotal: 0,
        chartData: [],
        chartOptions: {},
        groupedResults: []
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
    },

    methods: {
      fetch() {
        let params = this.params

        return this.$http.get('/administrator/reports/contracts', { params })
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
        let params = { report: { report_type: "contracts" } }

        this.downloading = true

        return this.$http.post('/administrator/reports/', params)
          .then((response) => {

            this.downloading = false

            this.$router.replace({ name: 'reports', params: { type: 'contracts' } })
          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },


      initChart() {
        let data = []
        let labels = []
        let that = this

        this.results.filter(function(elem){
          labels.push(elem.label)
          data.push(elem.data.countable)

          that.priceTotal += parseFloat(elem.data.price_total)
          that.contractTotal += elem.data.countable
        });

        this.chartData = {
          labels: labels,
          datasets: [{ data: data, backgroundColor: '#0275d8' }]
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
