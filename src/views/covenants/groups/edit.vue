<style scoped lang="scss">

  h4 {
    font-size: 20px;
    letter-spacing: 0.3px;
    color: $greyish-brown-two;
  }

  .row {
    &.error {
      color: red;
    }
  }

  tr {
    &.focus {
      padding: 15px;
      background-color: rgba(255, 255, 0, 0.3);

    }

    td {
      &:last-child {
        padding-right: 15px;
      }

      .fa {
        cursor: pointer;
      }
    }
  }
</style>

<template lang="pug">
  .root
    headers(:title="this.$t('.title')")
    .container.group
      form.card(ref="form", method="patch", @keydown.enter.prevent="addGroupItem", @submit.prevent="submit")
        .row
          .twelve.columns
            input-field(
              :autofocus="true",
              type="text",
              v-model="group.name",
              name="group[name]",
              :error="errors.name"
            )

        .row
          .twelve.columns
            h4.title {{ $t('.items.title') }}

        .row
          .six.columns
            select-ajax-field(
              name="group_item[item_id]",
              model="group_item",
              v-model="group_item.item_id",
              :options="[]",
              :placeholder="$t('options.prompt')",
              :error="errors.item",
              url="/search/items"
            )

          .two.columns
            input-field(
              :autofocus="true",
              model="group_item",
              type="number",
              v-model="group_item.quantity",
              mask="9999990",
              name="group_item[quantity]"
            )

          .two.columns
            input-field(
              :autofocus="true",
              model="group_item",
              type="text",
              v-model="group_item.estimated_cost",
              name="group_item[estimated_cost]",
              mask="999999999999,99"
            )

          .two.columns
            .button.mt-3.u-full-width(@click="addGroupItem" data="add-button")
              | {{ $t('.add.add') }}

        .row.error.mb-2(v-if="addErrors")
          .twelve.columns
            | {{ $t('.add.error') }}

        .row.error.mb-2(v-if="alreadyAddErrors")
          .twelve.columns
            | {{ $t('.add.already') }}

        table.u-full-width
          thead
            tr
              th(colspan="4")
                | {{ $t('.add.list') }}

          tbody(v-if="group_items")
            tr(v-for="(group_item, index) in group_items" :class="group_item.focus ? 'focus' : ''")
              input(type="hidden", name="group[group_items_attributes][][id]", :value="group_item.id" v-if="group_item")
              input(type="hidden", name="group[group_items_attributes][][_destroy]", :value="!!group_item._destroy" v-if="group_item")

              td(width="55%" v-if="!group_item._destroy")
                | {{ group_item.item_name }}

                input(type="hidden", name="group[group_items_attributes][][item_id]", :value="group_item.item_id" v-if="group_item")

              td(v-if="!group_item._destroy")
                input-field(
                  v-if="group_item",
                  :autofocus="true",
                  model="group_item",
                  type="number",
                  v-model="group_item.quantity",
                  mask="9999990",
                  name="group[group_items_attributes][][quantity]",
                  :error="groupItemErrors[index] && groupItemErrors[index]['quantity']",
                )

              td(v-if="!group_item._destroy")
                input-field(
                  v-if="group_item",
                  :autofocus="true",
                  model="group_item",
                  type="text",
                  v-model="group_item.estimated_cost",
                  name="group[group_items_attributes][][estimated_cost]",
                  :error="groupItemErrors[index] && groupItemErrors[index]['estimated_cost']",
                  mask="999999999999,99"
                )

              td(v-if="!group_item._destroy")
                i.fa.fa-trash(@click="removeGrupItem(group_item)")

            tr(v-if="errors.group_items")
              td(colspan="4")
                .row.error
                  | {{ errors.group_items }}

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
    name: 'editGroup',

    props: {
      redirect: { type: String }
    },

    data () {
      return {
        i18nScope: 'groups.edit',
        submitting: false,
        errors:  {},
        groupItemErrors: {},
        addErrors: false,
        alreadyAddErrors: false,

        covenantId: null,

        // form
        group: {},
        group_items: [],
        group_item: {}
      }
    },

    computed: {
      submitText() {
        if (this.submitting) return this.$t('.button.submitting')
        return this.$t('.button.submit')
      },
    },

    methods: {
      submit() {
        const formData = new FormData(this.$refs.form)
        this.submitting = true

        this.$http.patch('/administrator/covenants/' + this.covenantId + '/groups/' + this.group.id, formData)
          .then((response) => {
            this.$notifications.clear()

            this.errors = {}

            let redirectToRoute = this.redirect ? { path: this.redirect } : { name: 'covenant', params: { id: this.covenantId } }
            this.$router.replace(redirectToRoute)
          })
          .catch((err) => {

            let errors = _.dig(err, 'response', 'data', 'errors') || {}

            this.$notifications.error(this.$t('.notifications.failure'))

            this.errors = this.$i18n.errify(errors, { model: 'group' })

            for(let i = 0; i < errors.group_items_errors.length; i++) {
              this.groupItemErrors[i] = this.$i18n.errify(errors.group_items_errors[i], { model: 'group_item' })
            }
          })
          .then(() => {
            this.submitting = false
          })

      },

      addGroupItem: function() {
        // TODO: refactor
        let currentItem = this.group_item
        let alreadyAdd = false
        let wasDestroyedIndex = -1

          this.alreadyAddErrors = false


        if(this.isBlankGroupItem()) {
          this.addErrors = true
        } else {
          this.group_items.filter(function(elem, index){
            elem.focus = false
            if(elem.item_id == currentItem.item_id) {
              if(elem._destroy) {
                elem._destroy = false
                wasDestroyedIndex = index
              } else {
                alreadyAdd = true
                elem.focus = true
              }
            }
          });

          if(!alreadyAdd) {
            // TODO: get it without jquery
            this.group_item.item_name = $('#group_item_item_id').select2('data')[0].text
            this.group_item._destroy = !!this.group_item._destroy

            if (wasDestroyedIndex >= 0) {
              let id = this.group_items[wasDestroyedIndex].id
              this.group_items[wasDestroyedIndex] = _.clone(this.group_item)
              this.group_items[wasDestroyedIndex].id = id
            } else {
              this.group_items.push(_.clone(this.group_item))
            }

            this.group_item = {}
          }

          this.addErrors = false
          this.alreadyAddErrors = alreadyAdd
        }
      },

      isBlankGroupItem() {
       return (_.isBlank(this.group_item.item_id) || _.isBlank(this.group_item.quantity) || _.isBlank(this.group_item.estimated_cost))
      },

      removeGrupItem(group_item) {
        let currentItem = group_item

        this.group_items.filter(function(elem){
          if(elem.item_id == currentItem.item_id) {
            elem._destroy = true
          }
        })
      },

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
        this.covenantId = this.$params.asInteger(this.$route.params.covenant_id)
      }
    },

    created: function () {
      this.parseRoute()
      this.getGroup()
    }
  }

</script>
