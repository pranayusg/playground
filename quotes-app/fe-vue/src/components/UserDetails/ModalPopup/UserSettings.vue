<template>
  <button-custom @click="dialog = true">
    <img
      src="../../../assets/settings.png"
      id="image-icons"
      alt="settings-img"
    />
    Settings
  </button-custom>
  <v-dialog v-model="dialog" width="30%">
    <v-card>
      <v-card-title>
        <span class="text-h5">Settings</span>
      </v-card-title>
      <Form
        as="v-form"
        :validation-schema="schema"
        @submit="onSubmit"
        style="width: 85%; margin: auto"
      >
        <!-- <Field name="name" type="text" v-slot="{ field, errors }">
          <v-text-field
            v-bind="field"
            label="Username"
            :error-messages="errors"
            :value="userDetails.userName"
          />
        </Field>

      <TextFieldWithValidation
          name="email"
          label="Email"
          type="email"
          :email="userDetails.email"
        /> -->

        <TextFieldWithValidation
          name="name"
          label="User Name"
          type="String"
          :userName="userName"
        />

        <TextFieldWithValidation
          name="password"
          label="New Password"
          type="password"
        />

        <TextFieldWithValidation
          name="passwordConfirm"
          label="Confirm Password"
          type="password"
        />

        <v-card-actions style="float: right">
          <v-btn color="primary" @click="dialog = false">Close</v-btn>
          <v-btn color="primary" type="submit"> Create </v-btn>
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
import { helpers } from "@/utils/generalHelpers";
import { auth } from "@/utils/authHelpers";
import { getUserDetails, updateUser } from "@/apis/protectedRoutes";

export default defineComponent({
  name: "UserSettings",
  components: {
    Form,
    TextFieldWithValidation,
  },
  data() {
    return {
      dialog: false,
      valid: false,
      email: "",
      schema: yup.object({
        name: yup.string().required(),
        password: yup.string().min(6).required(),
        passwordConfirm: yup
          .string()
          .oneOf([yup.ref("password")], "Passwords must match")
          .required()
          .label("Password confirmation"),
      }),
    };
  },
  computed: {
    userName() {
      return auth.getUsername() ?? "";
    },
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async onSubmit(values: any) {
      const payload = {
        userName: values.name,
        email: this.email,
        password: values.password,
      };
      const result = await helpers.getConfirmAlert({
        title: "Are you sure you want to update your details?",
        icon: "info",
        confirmButtonText: "Yes, update it!",
      });

      if (result.isConfirmed) {
        await updateUser(payload);

        sessionStorage.setItem("username", payload.userName);
        // const userStore = useUserStore();
        // userStore.loginUser(userData);
        this.$emit("onUserNameUpdate");
        this.dialog = false;
      }
    },
    async fetchUserDetails() {
      const userDetails = await getUserDetails();
      if (userDetails.id) {
        this.email = userDetails.email;
      }
    },
  },
  created() {
    this.fetchUserDetails();
  },
});
</script>
