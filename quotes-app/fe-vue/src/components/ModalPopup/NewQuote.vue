<template>
  <button-custom style="margin-left: 5%" @click="dialog = true">
    <img src="../../assets/add.png" id="image-icons" alt="newquote-logo" />
    New Quote
  </button-custom>
  <v-dialog v-model="dialog" width="30%">
    <v-card>
      <v-card-title>
        <span class="text-h5">New Quote</span>
      </v-card-title>
      <Form
        as="v-form"
        :validation-schema="schema"
        @submit="onSubmit"
        style="width: 85%; margin: auto"
      >
        <TextAreaFieldWithValidation name="quote" label="Quote" type="String" />

        <TextFieldWithValidation name="author" label="Author" type="String" />

        <TextFieldWithValidation
          name="tags"
          label="Comma separated tags  eg Motivational,Inspirational"
          type="String"
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
import TextAreaFieldWithValidation from "@/components/CommonComp/TextAreaFieldWithValidation.vue";
import { helpers } from "@/utils/generalHelpers";
import { createQuotes } from "@/apis/protectedRoutes";
import { useUserStore } from "@/stores/userStore";

export default defineComponent({
  name: "NewQuote",
  components: {
    Form,
    TextFieldWithValidation,
    TextAreaFieldWithValidation,
  },
  data() {
    return {
      dialog: false,
      valid: false,
      schema: yup.object({
        quote: yup.string().required().min(4),
        author: yup.string().required(),
        tags: yup
          .string()
          .required()
          .test(
            "test-name",
            "Tags shouldn't contain space!",
            (value: string) => {
              // your logic
              if (!value.includes(" ")) {
                return true;
              }
              return false;
            }
          ),
      }),
    };
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async onSubmit(values: any) {
      const result = await helpers.getConfirmAlert({
        title: "Are you sure ?",
        icon: "info",
        confirmButtonText: "Yes, add it!",
      });
      if (result.isConfirmed) {
        await createQuotes(values);
        const userStore = useUserStore();
        userStore.fetchQuotes();
        this.dialog = false;
      }
    },
  },
});
</script>
