<style scoped lang="scss">
  .filter-bar {
    padding: 10px 20px;

    &.default {
      background-color: $greyish-brown;
    }

    &.custom {
      padding-left: 0;
      padding-right: 0;
    }

    form,
    .input-field,
    button {
      margin-bottom: 0;
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
  .filter-bar(:class="filterClass")
    .row
      form.fiter(ref="form", method="get" action="/" @submit.prevent="filter")
        .search-field.columns(:class="filterSizeClass")
          input-field(
            :autofocus="true",
            type="text",
            v-model="search",
            name="search",
            :placeholder="placeholder",
            :hideLabel='true'
          )
          i.fa.fa-search(@click="filter")

</template>

<script>
  export default {
    props: {
      placeholder: { type: String },
      defaultClass: { type: Boolean, default: true }
    },

    data () {
      return {
        i18nScope: 'filter-bar',
        search: ''
      }
    },

    computed: {
      filterClass() {
        return this.defaultClass ? 'default' : 'custom'
      },

      filterSizeClass() {
        return this.defaultClass ? 'eight' : 'twelve'
      }
    },

    methods: {
      filter(){
        this.$emit('filter', this.search)
      }

    },
  }

</script>

