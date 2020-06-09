<template lang="html">
  <main>
    You are now logged in! {{ $store.state.user.email }}
    <button @click="logout">Logout</button>

    <!-- This should be made into another component -->
    <section>
      <h3>Create a Post</h3>

      <button-upload @uploaded-all="uploadedAll" :accept="['.jpeg', '.jpg']">
        Upload file
      </button-upload>

      <p v-if="image.fileId">
        {{ image }}
      </p>

      <form @submit.prevent="onSubmit">
        <textarea v-model="caption" placeholder="Enter caption" />

        <p>
          <button v-if="!loading" type="submit">
            Create Post
          </button>
          <span v-else>Submitting</span>
        </p>
      </form>
    </section>

    <!-- This should be made into another component -->
    <section v-if="!$apollo.loading && posts.length" class="section-posts">
      <div v-for="post in posts">
        <img :src="post.image.downloadUrl" />
        <p v-text="post.caption" />
      </div>
    </section>
  </main>
</template>

<script>
// Components
import buttonUpload from "~/components/button-upload";

// GQL
import POST_CREATE from "~/gql/mutations/PostCreate";
import USER_POSTS from "~/gql/queries/UserPosts";

export default {
  components: {
    buttonUpload
  },
  data() {
    return {
      image: {},
      caption: "",
      loading: false
    };
  },
  middleware: ["authenticated"],
  methods: {
    async logout() {
      await this.$store.dispatch("USER_LOGOUT");
      this.$router.push("/login");
    },
    uploadedAll(files) {
      this.image = files[0];
    },
    async onSubmit() {
      // Don't allow double submit
      if (this.loading) {
        return;
      }

      this.loading = true;

      try {
        // Add post and image to 8Base
        const res = await this.$apollo.mutate({
          mutation: POST_CREATE,
          variables: {
            caption: this.caption,
            fileId: this.image.fileId,
            filename: this.image.filename
          },
          refetchQueries: ["UserPosts"] // This will refresh the UserPosts query from below
        });
      } catch (e) {
        console.log("Post create error", e);
      }

      this.loading = false;
    }
  },
  apollo: {
    // Apollo "Smart Query" to get the users posts
    posts: {
      query: USER_POSTS,
      variables() {
        return {
          email: this.$store.state.user.email
        };
      },
      update(data) {
        // Return just the data we need from Server
        let output = [];
        if (data.postsList) {
          return data.postsList.items;
        }
        return output;
      }
    }
  }
};
</script>

<style lang="css" scoped>
.section-posts {
    max-width: 400px;
}
.section-posts img {
    width: 100%;
    height: auto;
}
</style>
