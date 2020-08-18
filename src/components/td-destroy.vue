<style scoped lang="scss">
</style>

<template lang="pug">
  td(@click="destroyDialog")
    .button
      | {{ $t('btn.destroy') }}

</template>


<script>

  export default {
    props: {
      id: { type: Number },
      title: { type: String },
      body: { type: String }
    },

    data () {
      return {
        i18nScope: 'td-destroy'
      }
    },

    methods: {
      destroyDialog(id) {
        let message = { title: this.title, body: this.body }

        let options = {
          cancelText: this.$t('dialog.back'),
          okText: this.$t('dialog.destroy'),
          customClass: 'dg-delete'
        }

        this.$dialog.confirm(message, options)
          .then((dialog) => {
            this.$emit('success')
          })
          .catch(function (err) {
            console.log(err)
          });
      },

    }
  }

</script>

