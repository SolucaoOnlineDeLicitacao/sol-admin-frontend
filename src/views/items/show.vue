<style scoped lang="scss">

.title {
  margin-top: 20px;
}

.item {
  .row {
    margin-bottom: 10px;
  }
}

</style>


<template lang="pug">
.root(v-if="item")
  headers(:title='item.title')

  .container.item
    .card
      .row
        .twelve.columns
          h4.title {{ $t('.title') }}

      .row
        .two.columns
          label {{ $t('models.item.attributes.code') }}
          span {{ item.code }}

        .seven.columns
          label {{ $t('models.item.attributes.title') }}
          span {{ item.title }}

        .three.columns
          label {{ $t('models.item.attributes.unit') }}
          span {{ item.unit_name }}

      .row
        .columns
          label {{ $t('models.item.attributes.classificationId') }}
          span {{ item.classification_name }}

      .row
        .twelve.columns
          label {{ $t('models.item.attributes.description') }}
          span {{ item.description }}

</template>


<script>
  export default {
    name: 'item',
    data () {
      return {
        i18nScope: 'items.show',
        item: null,
        params: null,
      }
    },

    methods: {
      getItem() {
        return this.$http.get('/administrator/items/' + this.params.id)
          .then((response) => {
            this.item = response.data

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
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
      this.getItem()
    }
  }

</script>
