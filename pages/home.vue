<template lang="html">
  <main class="page-home">
    You are now logged in! {{ $store.state.user.email }}
    <br />
    <button @click="logout">Logout</button>
  </main>
</template>

<script>
export default {
  methods: {
    async logout() {
      await this.$store.dispatch("USER_LOGOUT");
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="css" scoped></style>
