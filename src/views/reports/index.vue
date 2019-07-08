<style scoped lang="scss">

  .title {
    margin-top: 20px;
  }

  .container {
    > .row {
      margin-bottom: 10px;
    }
  }

  h4 {
    font-size: 20px;
    letter-spacing: 0.3px;
    color: $greyish-brown-two;
  }

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

  .report-status {
    .success {
      color: $apple-green;
    }

    .error {
      color: $pale-red;
    }

    .processing,
    .waiting {
      color: $sky-blue;
    }

  }
</style>

<template lang="pug">
  .root
    headers(:title="this.$t('.title')")

    .container
      .row.mb-1
        .three.columns
          router-link.u-full-width.button.router-link(:to="{ name: 'biddingStatusReport' }")
            | {{ this.$t('.tabs.status') }}

        .three.columns
          router-link.u-full-width.button.router-link(:to="{ name: 'contractClassificationReport' }")
            | {{ this.$t('.tabs.contracts') }}

        .three.columns
          router-link.u-full-width.button.router-link(:to="{ name: 'generalReports' }")
            | {{ this.$t('.tabs.index') }}

        .three.columns
          router-link.button.u-full-width.button-primary.router-link(:to="{ name: 'reports' }")
            | {{ $t('.tabs.reports') }}

      hr

    .container
      .row
        .columns.four
          select-field(
            name="reportType",
            v-model="reportType",
            :options="reportKeys",
            include-prompt=true,
            :label="$t('.filter.label')"
          )

      table.u-full-width
        thead
          tr
            th
              | {{ $t('.table.status') }}
            th
              | {{ $t('.table.type') }}
            th
              | {{ $t('.table.date') }}
            th
              | {{ $t('.table.file') }}

        tbody(v-if="reportsCount")
          tr(v-for="report in reports")
            td.report-status
              span(:class="report.status", v-if="report.status == 'waiting'")
                i.fa.fa-box

              span(:class="report.status", v-else-if="report.status == 'processing'")
                i.fa.fa-spin.fa-spinner

              span(:class="report.status", v-else-if="report.status == 'error'")
                i.fa.fa-times

              span(:class="report.status", v-else-if="report.status == 'success'")
                i.fa.fa-check
              span.ml-1 {{ $t('models.report.attributes.statuses.' + report.status) }}
            td
              span {{ $t('models.report.attributes.types.' + report.report_type) }}
            td
              span {{ $l('time.formats.micro', report.created_at) }}
            td
              template(v-if="report.url")
                .button.mb-0(@click="fetchReport(report)")
                  | {{ $t('.button.fetch') }}
        tbody(v-else)
          tr
            td(colspan='4')
              | {{ $t('.table.empty') }}

      .row.mb-3
        .twelve.columns
          paginator(
            v-model="page",
            :first="firstPageLink",
            :prev="prevPageLink",
            :next="nextPageLink",
            :last="lastPageLink",
            v-if="reportsCount"
          )

</template>

<script>
  import blobDownloader from '@/components/blob-downloader'
  import parseLinkHeaders from 'parse-link-header'

  export default {
    name: 'reports',

    data () {
      return {
        i18nScope: 'reports.index',
        downloading: false,
        loaded: false,
        reports: {},
        reportsCount: null,
        reportType: '',
        params: {},

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

      downloadText() {
        if (this.downloading) return this.$t('.button.downloading')
        return this.$t('.button.download')
      },

      reportKeys() {
        return [
          { id: 'biddings', text: this.$t('models.report.attributes.types.biddings') },
          { id: 'contracts', text: this.$t('models.report.attributes.types.contracts') },
          { id: 'time', text: this.$t('models.report.attributes.types.time') },
          { id: 'items', text: this.$t('models.report.attributes.types.items') },
          { id: 'suppliers_biddings', text: this.$t('models.report.attributes.types.suppliers_biddings') },
          { id: 'suppliers_contracts', text: this.$t('models.report.attributes.types.suppliers_contracts') }
        ]
      }
    },

    methods: {
      fetch() {
        let params = this.params

        return this.$http.get('/administrator/reports', { params })
          .then((response) => {
            this.reports  = response.data
            this.reportsCount = this.reports.length
            this.updatePagination(response)

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      fetchReport(report) {
        let params = { responseType: 'blob' }

        return this.$http.get('/administrator/reports/' + report.id + '/download', params)
          .then((response) => {
            this.download(response, report.url)
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

      parseRoute() {
        this.reportType = this.$params.asString(this.$route.params.type)
      },

      updateRoute() {
        let data = Object.assign({}, this.$route.query, this.params);

        this.$router.push({ name: 'reports', query: data });
      },

    },

    mounted: function() {
      this.parseRoute()
      this.download = blobDownloader.download
    },

    watch: {
      fetchParams() {
        this.fetch()
      },

      reportType() {
        this.params = Object.assign({}, this.params, { report_type: this.reportType });
        this.updateRoute()
      },

      page() {
        this.params = Object.assign({}, this.params, { page: this.page });
        this.updateRoute()
      }

    }
  }

</script>
