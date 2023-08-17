<template>
  <v-textarea
    v-model="value"
    @blur="handleBlur"
    :label="label"
    :error-messages="errors"
    :type="type"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useField } from "vee-validate";

export default defineComponent({
  name: "TextFieldWithValidation",
  props: {
    name: {
      type: String,
      requird: true,
      default: "",
    },
    type: {
      type: String,
      requird: true,
    },
    label: {
      type: String,
      required: true,
    },
    quote: {
      type: String,
      required: false,
      default: "",
    },
  },
  setup(props) {
    const { value, handleBlur, errors } = useField(props.name);

    if (props.quote)
      // eslint-disable-next-line vue/no-setup-props-destructure
      value.value = props.quote;

    return { value, handleBlur, errors };
  },
});
</script>
