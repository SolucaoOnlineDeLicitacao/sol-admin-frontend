<script>
  import { HorizontalBar } from 'vue-chartjs'

  export default {
    name: 'horizontal-bar-chart',

    extends: HorizontalBar,

    props: {
      chartdata: { type: Object, default: null },
      options: { type: Object, default: null }
    },

    mounted () {
      this.renderChart(this.chartdata, this.options)
    }
  }
</script>
