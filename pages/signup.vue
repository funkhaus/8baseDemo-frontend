<template lang="html">
  <main>
    <h2>User Signup</h2>

    <form @submit.prevent="onSubmit">
      <input
        v-model="email"
        placeholder="Email"
        type="email"
        :required="true"
      />

      <input
        v-model="password"
        placeholder="Password"
        type="password"
        :required="true"
      />

      <p v-if="error">
        {{ error }}
        Your password isn't storng enough.
      </p>

      <button type="submit" :disabled="this.loading">
        Signup
      </button>

      <p>
        Already have an account? <nuxt-link to="/login">Login here</nuxt-link>
      </p>
    </form>
  </main>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      error: ""
    };
  },
  methods: {
    async onSubmit() {
      // Reset states
      this.loading = true;
      this.error = "";

      // Credentails
      const credentials = {
        email: this.email,
        password: this.password
      };

      // Signup a user
      try {
        await this.$store.dispatch("USER_SIGNUP", credentials);
      } catch (e) {
        // Set error object
        this.error = e;
        this.loading = false;
        return;
      }

      // Now try to login the user
      try {
        await this.$store.dispatch("USER_LOGIN", credentials);
      } catch (e) {
        this.error = e;
        this.loading = false;
        return;
      }

      // Redirect to user authenticated route
      this.$router.push("/home");
      this.loading = false;
    }
  }
};
</script>

<style lang="css" scoped></style>
