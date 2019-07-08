<style scoped lang="scss">
  table {
    td,
    th {
      padding: 20px;

      a {
        text-decoration: none;
        color: inherit;
      }
    }

    tbody {
      background-color: $white;
    }
  }
</style>


<template lang="pug">
  table.u-full-width
    slot

</template>


<script>

  export default {
    data () {
      return {
        i18nScope: 'table-header'
      }
    },
  }

</script>

