<style scoped lang="scss">

</style>


<template lang="pug">
  .root
    headers(:title="this.$t('.title')")

    .container.item
      form.card(ref="form", method="post", @submit.prevent="submit")

        .row
          .two.columns
            input-field(
              :autofocus="true",
              type="number",
              v-model="item.code",
              name="item[code]",
              :error="errors.code",
              required="true"
            )

          .seven.columns
            input-field(
              type="text",
              v-model="item.title",
              name="item[title]",
              :error="errors.title",
              required="true"
            )

          .three.columns(v-if="units")
            select-field(
              name="item[unit_id]",
              model="item",
              v-model="item.unit_id",
              :options="computedUnits",
              :placeholder="$t('options.prompt')",
              :error="errors.unit",
              required="true",
              :includePrompt="true",
            )

        .row
          .six.columns(v-if="this.classificationGroupOptions")
            select-field(
              name="item[classification_id]",
              model="item",
              v-model="item.classification_id",
              :options="this.classificationGroupOptions",
              :placeholder="$t('options.prompt')",
              :error="errors['item.classification_id']"
              :hideSearch="false",
              :includePrompt="true",
              required="true"
            )

          .six.columns(v-if="this.classificationChildrenOptions")
            select-field-empty(
              name="item[children_classification_id]",
              model="item",
              v-model="item.children_classification_id",
              :options="this.classificationChildrenOptions",
              :placeholder="$t('options.prompt')",
              :error="errors['item.children_classification']"
              :includePrompt="true",
              :hideSearch="false"
            )

        .row
          .twelve.columns
            textarea-field(
              type="text",
              v-model="item.description",
              name="item[description]",
              :error="errors.description",
              required="true"
            )

        .row
          .twelve.columns
            button.button-primary(
              type="submit",
              :disabled="submitting"
            )
              | {{ submitText }}

</template>


<script>
  export default {
    name: 'editItem',

    props: {
      redirect: { type: String }
    },

    data () {
      return {
        i18nScope: 'items.edit',
        submitting: false,
        errors:  {},

        units: null,
        classificationChildrenOptions: null,
        classificationGroupOptions: null,

        // form
        item: {},
      }
    },

    computed: {
      submitText() {
        if (this.submitting) return this.$t('.button.submitting')
        return this.$t('.button.submit')
      },

      computedUnits() {
        return this.units.map(function(elem) {
          elem.text = elem.name
          delete elem['name']
          return elem
        });
      }
    },

    methods: {
      getUnits() {
        return this.$http.get('/administrator/units')
          .then((response) => {
            this.units = response.data

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      getClassifications() {
        return this.$http.get('/search/classifications')
          .then((response) => {
            let grouped = _.groupBy(response.data, 'classification_id')
            let headers = grouped["null"]
            let classifications = []

            headers.filter(function(elem) {
              let currentClassification = {
                id: elem.id,
                text: elem.text,
                children: grouped[elem.id]
              }

              classifications.push(currentClassification)
            });

            this.classificationGroupOptions = classifications
          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },

      getChildrenClassifications() {
        let params = { classification_id: this.item.classification_id }

        return this.$http.get('/search/classifications', { params })
          .then((response) => {
            response.data.unshift({ id: 0, text: this.$t('options.prompt') })
            this.classificationChildrenOptions = response.data

          }).catch((_err) => {
            this.error = _err
            console.error(_err)
          })
      },


      submit() {
        const formData = new FormData(this.$refs.form)
        this.submitting = true

        this.$http.patch('/administrator/items/' + this.params.id, formData)
          .then((response) => {
            this.$notifications.clear()
            this.errors = {}

            let redirectToRoute = this.redirect ? { path: this.redirect } : { name: 'items' }
            this.$router.replace(redirectToRoute)
          })
          .catch((err) => {
            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.$notifications.error(this.$t('.notifications.failure'))
            this.errors = this.$i18n.errify(errors, { model: 'item' })
          })
          .then(() => {
            this.submitting = false
          })

      },

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


    watch: {
      'item.classification_id': function(_val) {
        this.getChildrenClassifications()
      }
    },

    mounted: function() {
      this.getClassifications()
      this.getUnits()
    },

    created: function () {
      this.parseRoute()
      this.getItem()
    }
  }

</script>
