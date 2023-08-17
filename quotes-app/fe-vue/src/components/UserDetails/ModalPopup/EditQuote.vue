<template>
  <img
    src="../../../assets/edit.png"
    id="card-icons"
    alt="logo"
    @click="dialog = true"
  />
  <v-dialog v-model="dialog" width="30%">
    <v-card>
      <v-card-title>
        <span class="text-h5">Edit Quote</span>
      </v-card-title>
      <Form
        as="v-form"
        :validation-schema="schema"
        @submit="onSubmit"
        style="width: 85%; margin: auto"
      >
        <TextAreaFieldWithValidation
          name="quote"
          label="Quote"
          type="String"
          :quote="quote"
        />

        <TextFieldWithValidation
          name="author"
          label="Author"
          type="String"
          :author="author"
        />

        <v-card-actions style="float: right">
          <v-btn color="primary" @click="dialog = false">Close</v-btn>
          <v-btn color="primary" type="submit"> Edit </v-btn>
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
import { editQuote } from "@/apis/protectedRoutes";
import { useUserStore } from "@/stores/userStore";

export default defineComponent({
  name: "EditQuote",
  props: {
    quoteId: {
      type: String,
      requird: true,
    },
    quote: {
      type: String,
      requird: true,
    },
    author: {
      type: String,
      requird: true,
    },
    tags: {
      type: String,
      requird: true,
    },
  },
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
      }),
    };
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async onSubmit(values: any) {
      const result = await helpers.getConfirmAlert({
        title: "Are you sure you want to Edit?",
        icon: "info",
        confirmButtonText: "Yes, edit it!",
      });
      if (result.isConfirmed) {
        values.id = this.quoteId;
        values.tags = this.tags;

        await editQuote(values);
        const userStore = useUserStore();
        userStore.fetchQuotes();
        this.dialog = false;
      }
    },
  },
});
</script>
