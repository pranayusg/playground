<template>
  <button-custom @click="dialog = true"
    ><img src="../../assets/sign-in.png" id="image-icons" alt="signin-logo" />
    Signin
  </button-custom>
  <v-dialog v-model="dialog" width="30%">
    <v-card>
      <v-card-title>
        <span class="text-h5">Sign In</span>
      </v-card-title>
      <Form
        as="v-form"
        :validation-schema="schema"
        @submit="onSubmit"
        style="width: 80%; margin: auto"
      >
        <!-- This method uses Higher-order component API to validate vuetify inputs -->
        <!-- <Field name="name" v-slot="{ field, errors }">
          <v-text-field v-bind="field" label="Name" :error-messages="errors" />
        </Field> -->

        <TextFieldWithValidation name="email" label="Email" type="email" />

        <!-- This uses a custom component with the composition API -->
        <TextFieldWithValidation
          name="password"
          label="Password"
          type="password"
        />

        <!-- This uses a custom component with the composition API
        <TextFieldWithValidation
          name="passwordConfirm"
          label="Password Confirmation"
          type="password"
        /> -->

        <v-card-actions style="float: right">
          <v-btn color="primary" @click="dialog = false">Close</v-btn>
          <v-btn color="primary" type="submit"> SignIn </v-btn>
        </v-card-actions>
      </Form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Form } from "vee-validate";
import * as yup from "yup";
import TextFieldWithValidation from "@/components/CommonComp/TextFieldWithValidation.vue";
import { login } from "@/apis/openRoutes";
import { helpers } from "@/utils/generalHelpers";
import { useUserStore } from "@/stores/userStore";

export default defineComponent({
  name: "SignIn",
  components: {
    Form,
    TextFieldWithValidation,
  },
  data() {
    return {
      dialog: false,
      valid: false,
      schema: yup.object({
        email: yup.string().email().required().label("E-mail"),
        password: yup.string().min(6).required(),
      }),
    };
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async onSubmit(values: any) {
      const userData = await login({
        username: values.email,
        password: values.password,
      });
      if (userData.username) {
        const userStore = useUserStore();
        userStore.loginUser(userData);

        this.dialog = false;
      } else {
        await helpers.getInvalidLoginAlert({
          title: "Invalid Credentials!!",
          icon: "error",
        });
      }
    },
  },
});
</script>
