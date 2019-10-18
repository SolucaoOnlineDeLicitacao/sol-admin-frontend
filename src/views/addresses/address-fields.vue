<template lang="pug">
  .addresses-fields
    input(type="hidden", :name="prefix + '[address_attributes][id]'", :value="address.id" v-if="address")

    .row
      .eight.columns
        input-field(
          type="text",
          v-model="address.address",
          model="address",
          :name="prefix + '[address_attributes][address]'",
          :error="errors[errorPrefix + 'address.address']"
        )

      .two.columns
        input-field(
          type="text",
          model="address",
          v-model="address.number",
          :name="prefix + '[address_attributes][number]'",
          :error="errors[errorPrefix + 'address.number']"
        )

      .two.columns
        input-field(
          type="text",
          model="address",
          v-model="address.cep",
          :name="prefix + '[address_attributes][cep]'",
          :error="errors[errorPrefix + 'address.cep']",
          placeholder="00000-000",
          mask="00000-000"
        )
    .row
      .three.columns
        input-field(
          type="text",
          model="address",
          v-model="address.neighborhood",
          :name="prefix + '[address_attributes][neighborhood]'",
          :error="errors[errorPrefix + 'address.neighborhood']"
        )

      .three.columns
        select-ajax-field(
          :name="prefix + '[address_attributes][city_id]'",
          model="address",
          v-model="address.city_id",
          :options="selectedCity",
          :placeholder="$t('options.prompt')",
          :error="errors[errorPrefix + 'address.city']",
          url="/search/cities"
        )

      .three.columns
        input-field(
          type="text",
          model="address",
          v-model="address.latitude",
          :name="prefix + '[address_attributes][latitude]'",
          :error="errors[errorPrefix + 'address.latitude']",
          placeholder="00.00000000",
          :mask="{ mask: 'M99.00000000' }"
        )

      .three.columns
        input-field(
          type="text",
          model="address",
          v-model="address.longitude",
          :name="prefix + '[address_attributes][longitude]'",
          :error="errors[errorPrefix + 'address.longitude']",
          placeholder="00.00000000",
          :mask="{ mask: 'M99.00000000' }"
        )

    .row
      .six.columns
        input-field(
          type="text",
          model="address",
          v-model="address.complement",
          :name="prefix + '[address_attributes][complement]'",
          :error="errors[errorPrefix + 'address.complement']"
        )

      .six.columns
        input-field(
          type="text",
          model="address",
          v-model="address.reference_point",
          :name="prefix + '[address_attributes][reference_point]'",
          :error="errors[errorPrefix + 'address.reference_point']"
        )
</template>

<script>
  export default {
    props: {
      address: { Object, default: () => [] },
      errors: Object,
      errorPrefix: { String, default: '' },
      prefix: String
    },

    data() {
      return {
        defaultI18nScope: 'address.address-fields'
      }
    },

    computed: {
      selectedCity() {
        let id = this.address && this.address.city_id

        if(typeof id !== 'undefined') {
          return [
            {
              id: this.address.city_id,
              text: this.address.city_name
            }
          ]
        }

        return []
      }
    }
  }
</script>
