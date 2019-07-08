<style scoped lang="scss">

.title {
  margin-top: 20px;
}

.group {
  .row {
    margin-bottom: 10px;
  }
}

</style>


<template lang="pug">
.root(v-if="group")
  headers(:title='group.name')

  .container.group
    .card
      h5.mb-0.u-cf.u-full-width
        | {{ this.$t('.general.title') }}
        router-link.button.router-link.u-pull-right(:to="{ name: 'editGroup', params: { covenant_id: this.covenantId, id: group.id } }" v-if="$ability.canManage('Covenant')")
          | {{ $t('.general.edit') }}
      hr.mt-0

      .row
        .nine.columns
          label {{ $t('models.group.attributes.name') }}
          span {{ group.name }}

        .three.columns
          label {{ $t('models.group.attributes.group_items_count') }}
          span {{ group.group_items_count }}

    .card.mt-3
      .row
        table.u-full-width
          thead
            tr
              th
                | {{ $t('models.group_item.attributes.itemName') }}

              th
                | {{ $t('.table.available_quantity') }}

              th
                | {{ $t('models.group_item.attributes.estimated_cost') }}

          tbody(v-if="group_items")
            tr(v-for="group_item in group_items")
              td(width="50%")
                router-link.router-link(:to="{ name: 'item', params: { id: group_item.item_id } }")
                  | {{ group_item.item_name }}

              td(width="30%")
                | {{ $asNumber(group_item.available_quantity, { precision: 0 }) }} / {{ $asNumber(group_item.quantity, { precision: 0 }) }}
                | {{ group_item.item_unit }}(s)

              td(width="20%")
                | {{ $asCurrency(group_item.estimated_cost) }}

</template>


<script>
  import view from '@/view.vue'

  export default {
    name: 'group',
    data () {
      return {
        i18nScope: 'groups.show',
        lol: null,
        group: null,
        group_items: null,
        params: null,
      }
    },

    methods: {
      getGroup() {
        return this.$http.get('/administrator/covenants/' + this.covenantId + '/groups/' + this.$route.params.id)
          .then((response) => {
            this.group = response.data
            this.group_items = response.data.group_items || []

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      parseRoute() {
        let params = {}

        params.id = this.$params.asInteger(this.$route.params.id)

        this.covenantId = this.$params.asInteger(this.$route.params.covenant_id)

        this.params = params
      }

    },

    created: function () {
      this.parseRoute()
      this.getGroup()
    }
  }

</script>
