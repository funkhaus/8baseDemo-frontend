// GQL
import USER_SIGNUP from "~/gql/mutations/UserSignup";
import USER_LOGIN from "~/gql/mutations/UserLogin";
import USER_GET from "~/gql/queries/User";

// Set default state
export const state = () => ({
  user: {},
  tokens: {}
});

// Define mutations
export const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_TOKENS(state, tokens) {
    state.tokens = tokens;
  }
};

// Define actions
export const actions = {
  async USER_SIGNUP({ commit }, creds) {
    const apollo = this.app.apolloProvider.defaultClient;

    try {
      var res = await apollo.mutate({
        mutation: USER_SIGNUP,
        variables: {
          email: creds.email,
          password: creds.password,
          authProfileId: process.env.AUTH_PROFILE_ID
        }
      });
    } catch (e) {
      console.log("Sign up error", e);
      throw e;
      return false;
    }

    return res.data;
  },

  async USER_LOGIN({ commit, dispatch }, creds) {
    const apollo = this.app.apolloProvider.defaultClient;

    try {
      var res = await apollo.mutate({
        mutation: USER_LOGIN,
        variables: {
          email: creds.email,
          password: creds.password,
          authProfileId: process.env.AUTH_PROFILE_ID
        }
      });
    } catch (e) {
      console.log("Login error", e);
      throw e;
      return false;
    }

    // Set tokens so Apollo is autheticated for future requests. Save to store for refresh token use later.
    const auth = res.data.userLogin.auth;
    commit("SET_TOKENS", {
      refreshToken: auth.refreshToken,
      token: auth.idToken
    });
    await this.$apolloHelpers.onLogin(auth.idToken);

    // Now get and save user to store
    const user = await dispatch("USER_GET", creds.email);
    commit("SET_USER", user);

    return user;
  },

  async USER_GET({ commit }, email) {
    const apollo = this.app.apolloProvider.defaultClient;

    try {
      var res = await apollo.mutate({
        mutation: USER_GET,
        variables: {
          email: email
        }
      });
    } catch (e) {
      console.log("User get error", e);
      throw e;
    }

    return res.data.user;
  },

  async USER_LOGOUT({ commit }) {
    await this.$apolloHelpers.onLogout();
    commit("SET_TOKENS", {});
    commit("SET_USER", {});
  }
};
