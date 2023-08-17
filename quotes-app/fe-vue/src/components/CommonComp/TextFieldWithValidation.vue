<template>
  <v-text-field
    v-model="value"
    @blur="handleBlur"
    :label="label"
    :error-messages="errors"
    :type="type"
    autocomplete="off"
  />
</template>

<!-- eslint-disable vue/no-setup-props-destructure -->
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
    author: {
      type: String,
      required: false,
      default: "",
    },
    userName: {
      type: String,
      required: false,
      default: "",
    },
    email: {
      type: String,
      required: false,
      default: "",
    },
  },
  setup(props) {
    const { value, handleBlur, errors } = useField(props.name);

    if (props.author) value.value = props.author;
    if (props.userName) value.value = props.userName;
    if (props.email) value.value = props.email;

    return { value, handleBlur, errors };
  },
});
</script>
