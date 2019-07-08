<style scoped lang="scss">

  .card {
    min-height: 220px;
    position: relative;
  }

  .card-header {
    padding: 10px 20px;
    margin: -20px -20px 0;
    border-bottom: solid 1px #c4c4c4;
  }

  .card-body {
    margin-top: 10px;
  }

  .card-footer {
    padding-bottom: 20px;
    margin-left: -20px;
    margin-right: -20px;
    position: absolute;
    bottom: 0;
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
          router-link.u-full-width.button.router-link(:to="{ name: 'contractClassificationReport' }")
            | {{ $t('.tabs.contracts') }}

        .three.columns
          router-link.u-full-width.button.button-primary.router-link(:to="{ name: 'generalReports' }")
            | {{ $t('.tabs.index') }}

        .three.columns
          router-link.button.u-full-width.router-link(:to="{ name: 'reports' }")
            | {{ $t('.tabs.reports') }}

      hr

    .container
      .row(v-for="reportList in reports")
        .three.columns(v-for="report in reportList")
          .card
            .card-header
              h6.mb-0 {{ $t(".keys." + report.key) }}

            .card-body
              span {{ $t(".descriptions." + report.key) }}

            .card-footer.text-center.u-full-width
              .button.mb-0(@click="generateReport(report)")
                template(v-if="downloading")
                  i.fa.fa-spin.fa-spinner
                template(v-else)
                  | {{ $t('.button.download') }}
</template>

<script>

  export default {
    name: 'generalReports',

    data () {
      return {
        i18nScope: 'reports.index',
        downloading: false,
        loaded: false,
      }
    },

    computed: {
      reports() {
        return [
          [
            { key: 'time' },
            { key: 'items' },
            { key: 'suppliers_biddings' },
            { key: 'suppliers_contracts' }
          ]
        ]
      }
    },

    methods: {

      generateReport(report) {
        let params = { report: { report_type: report.key } }

        this.downloading = true

        return this.$http.post('/administrator/reports/', params)
          .then((response) => {

            this.downloading = false

            this.$router.replace({ name: 'reports', params: { type: report.key } })
          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

    },
  }

</script>
