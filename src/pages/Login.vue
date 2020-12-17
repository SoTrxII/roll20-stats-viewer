<template>
  <image-composition>
    <template v-slot:centered>
      <img class="justify-center" src="https://i.imgur.com/BIMU2Dd.png" />

      <v-form ref="form" class="loginForm" v-model="valid" lazy-validation>
        <div v-if="errors.length">
          <p class="error--text" v-for="error in errors" v-bind:key="error">
            {{ error }}
          </p>
        </div>
        <v-text-field
          v-model="email"
          type="email"
          :rules="emailRules"
          label="Roll20 email"
          required
          v-on:keyup.enter="validate"
        ></v-text-field>

        <v-text-field
          v-model="password"
          type="password"
          :rules="passwordRules"
          label="Roll20 Password"
          required
          v-on:keyup.enter="validate"
        ></v-text-field>

        <v-btn
          :disabled="!valid"
          color="lightgray"
          class="mr-4 mt-6"
          @click="validate"
        >
          Validate
        </v-btn>
      </v-form>
    </template>
  </image-composition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ImageComposition from "@/components/ImageComposition.vue";
import { $inject } from "@vanroeybe/vue-inversify-plugin";
import { TYPES } from "@/types";
import { IAuthService } from "@/@types/auth.service";

@Component({
  components: { ImageComposition },
})
export default class Login extends Vue {
  //@ts-ignore
  @$inject(TYPES.AuthService) private authService: IAuthService;
  private emailRules = [
    (v: string) => !!v || "E-mail is required",
    (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
  ];
  private passwordRules = [(v: string) => !!v || "Password is required"];
  private email: string = "";
  private password: string = "";
  private valid: boolean = false;
  private errors: string[] = [];

  async validate() {
    this.errors = [];
    this.$refs.form.validate();
    if (!this.valid) return;
    const creds = {
      email: this.email,
      password: this.password,
    };
    try {
      this.$store.state.isLoading = true;
      this.authService.credentials = creds;
      await this.$store.dispatch("fetchCampaignList");
    } catch (e) {
      this.authService.credentials = {};
      this.errors.push("Invalid credentials, could not connect to Roll20");
      return;
    } finally {
      this.$store.state.isLoading = false;
    }

    this.$router.push({ name: "home" });
  }
}
</script>

<style>
.loginForm {
  min-width: 50vw;
}
</style>
