<style scoped lang="scss">
</style>

<template lang="pug">
  td(@click="destroyDialog")
    .button
      | Excluir

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
          cancelText: 'Voltar',
          okText: 'Excluir',
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

