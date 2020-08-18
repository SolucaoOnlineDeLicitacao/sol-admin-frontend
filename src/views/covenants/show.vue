<style scoped lang="scss">

.title {
  margin-top: 20px;
}

.covenant {
  .row {
    margin-bottom: 10px;
  }
}

</style>


<template lang="pug">
.root(v-if="covenant")
  headers(:title='covenant.number')

  .container.covenant
    .card
      h5.mb-0 {{ $t('.general.title') }}
      hr.mt-0

      .row
        .three.columns
          label {{ $t('models.covenant.attributes.number') }}
          span {{ covenant.number }}

        .nine.columns
          label {{ $t('models.covenant.attributes.name') }}
          span {{ covenant.name }}

      .row
        .three.columns
          label {{ $t('models.covenant.attributes.cityId') }}
          span {{ covenant.city_text }}

        .three.columns
          label {{ $t('models.covenant.attributes.estimatedCost') }}
          span(v-if="covenant.estimated_cost") {{ $asCurrency(parseFloat(covenant.estimated_cost)) }}

        .two.columns
          label {{ $t('models.covenant.attributes.signatureDate') }}
          span {{ covenant.signature_date }}

        .two.columns
          label {{ $t('models.covenant.attributes.validityDate') }}
          span {{ covenant.validity_date }}

        .two.columns
          label {{ $t('models.covenant.attributes.status') }}
          span {{ $t('models.covenant.attributes.statuses.' + covenant.status) }}

      .row
        .six.columns
          label {{ $t('models.covenant.attributes.cooperative') }}
          span {{ covenant.cooperative_name }}

        .six.columns
          label {{ $t('models.covenant.attributes.adminName') }}
          router-link.router-link(:to="{ name: 'admin', params: { id: covenant.admin_id } }")

            | {{ covenant.admin_name }}


    .card.mt-3
      h4.mb-0 {{ $t('.work_plan.title') }}
      .row(v-if="groupsCount")
        table.u-full-width
          thead
            tr
              th
                | {{ $t('models.group.attributes.name') }}

              th
                | {{ $t('models.group.attributes.group_items_count') }}

              th(colspan="2" v-if="$ability.canManage('Covenant')")

          tbody(v-if="groups")
            tr(v-for="group in groups")
              td(width="60%")
                router-link.router-link(:to="{ name: 'group', params: { covenant_id: covenant.id, id: group.id } }")
                  | {{ group.name }}

              td(width="20%")
                | {{ group.group_items_count }}

              template(v-if="$ability.canManage('Covenant')")
                td
                  router-link.button.router-link(:to="{ name: 'editGroup', params: { covenant_id: covenant.id, id: group.id } }")
                    | {{ $t('btn.edit') }}

                td-destroy(:id="group.id", :title="$t('.destroy.title')", :body="$t('.destroy.body')", @success="destroy(group.id)")

      .row(v-else)
          | {{ $t('.work_plan.groups.empty') }}

      .row
        router-link.button.button-primary.u-pull-right.router-link(:to="{ name: 'newGroup', params: { covenant_id: covenant.id } }" v-if="$ability.canManage('Covenant')")
          | {{ $t('.work_plan.groups.button.new') }}


</template>


<script>
  import view from '@/view.vue'

  export default {
    name: 'covenant',
    data () {
      return {
        i18nScope: 'covenants.show',
        lol: null,
        covenant: null,
        groups: null,
        groupsCount: 0,
        params: null,
      }
    },

    methods: {
      getCovenant() {
        return this.$http.get('/administrator/covenants/' + this.params.id)
          .then((response) => {
            this.covenant = response.data
            this.groups = response.data.groups
            this.groupsCount = this.groups.length

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      destroy(id) {
        return this.$http.delete('/administrator/covenants/' + this.covenant.id + '/groups/' + id)
          .then((_response) => {
            let idx = this.groups.findIndex(p => p.id === id)
            this.groups.splice(idx, 1)
            this.groupsCount = this.groups.length

            this.$notifications.info(this.$t('.notifications.destroy.success', { id }))
          })
          .catch((_err) => {
            this.$notifications.error(this.$t('.notifications.destroy.failure', { id }))
          })
      },

      parseRoute() {
        let params = {}

        params.id = this.$params.asInteger(this.$route.params.id)

        this.params = params
      }

    },

    created: function () {
      this.parseRoute()
      this.getCovenant()
    }
  }

</script>
