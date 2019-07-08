<style scoped lang="scss">
  .action {
    width: 25%;
  }

  thead {
    background-color: $brownish-grey;
    color: $white;

    a {
      color: $white;
    }
  }

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

  .sort-link {
    text-decoration: none;
    cursor: pointer;

    > .fa {
      margin-left: 4px;
    }
  }

  .search-field {
    position: relative;

    > .fa {
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 12px;
    }
  }
</style>


<template lang="pug">
  thead
    tr
      slot

      th.action(colspan="2" v-if="$ability.canManage(resourceClass)")
        | Ações

</template>


<script>

  export default {
    props: {
      resourceClass: { type: String }
    },

    data () {
      return {
        i18nScope: 'table-header'
      }
    },

    computed: {
    },

    methods: {
    }
  }

</script>

