<template lang="html">
  <main>
    <h2>User Login</h2>

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

      <button type="submit" :disabled="this.loading">
        Login
      </button>

      <p v-if="error">
        {{ error }}
        Incorrect email or password.
      </p>
    </form>

    <p>
      Don't have an account? <nuxt-link to="/signup">Signup here</nuxt-link>
    </p>
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

      // Now try to login the user.
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
