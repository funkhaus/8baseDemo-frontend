# 8BaseDemo-frontend

This is a basic demo of how to build a basic 8Base powered application using Nuxt as a frontend.

Too many demo app's skip over the REAL things you will need to do. This demo hopefully is a complete example of a basic working app.

It does the following:

1.  Setup 8Base backend
1.  Code for sign up, sign in and logout
1.  Create data on the backend
1.  Upload an image
1.  Persist store data between reloads
1.  Write custom functions on the backend server

Please see the corresponding [backend codebase here](https://github.com/funkhaus/8baseDemo-backend).

## Requirements

1. Will need more than the Free Tier of 8Base to use good Auth.

## 1. Setup data model in 8Base:

Go to: https://app.8base.com/data

1.  New table > Posts
2.  Add fields (caption, image)
3.  New table > Likes

    1. Drag Posts onto empty field
    2. Rename field to Posts(not Posts)

## 2. Add mock data

Go to: https://app.8base.com/data, use the "Data" tab to manually make some Posts and Likes.

1.  Add a Post using 8Base dashboard
2.  Add a Like using 8Base dashboard, connect to Post

### Note the 8Base API Explorer

SEE https://app.8base.com/api-explorer

## 3. Setup Authentication Profile

1. Go here: https://app.8base.com/app-services/authentication
2. SEE https://www.youtube.com/watch?v=CHIElGa4Hug&feature=youtu.be
3. For the `Auth0 Database Name` field, the free version of Auth0 doesn't have that feature. You can just enter `Username-Password-Authentication` though, and it will work.
4. In Auth0 Dashboard go to `Applications > Your App > Show Advanced Settings > Grant Types` and make sure `password` is ticked.

Note the `Auth Profile ID`, you will need it for the GQL Query.

## The Code

Here we install Nuxt and start writing code

### 1. Install Nuxt

SEE https://nuxtjs.org/guide/installation#starting-from-scratch

```
npm install --save nuxt
```

Then:

1. Make `package.json`
1. Make `nuxt.config.js`
1. Make `store/index.vue`

### 2. Install dotenv

```
npm install --save-dev @nuxtjs/dotenv
```

Then:

1. Add `@nuxtjs/dotenv` to the `buildModules` section of `nuxt.config.js`
1. Duplicate `example.env` and setup your `.env` file.
1. Get `BASE_ENDPOINT` URL from: https://app.8base.com/settings/general
1. Get `AUTH_PROFILE_ID` from https://app.8base.com/app-services/authentication

### 3. Install Nuxt Apollo

SEE https://github.com/nuxt-community/apollo-module#setup

```
npm install --save @nuxtjs/apollo
```

Then:

1.  Add `@nuxtjs/apollo` to `modules` of `nuxt.config.js`
1.  Create `/plugins/apollo-config-default.js`

### 4. Install filestack SDK

SEE https://www.npmjs.com/package/filestack-js
SEE https://filestack.github.io/filestack-js/

```
npm install --save filestack-js
```

## 2. Create signup route and preview

1. Create Vue template with form at `pages/signup`
1. Run `npm run dev`
1. Go to http://localhost:3000/signup

## 3. Signup a user

1. Create `/store/index.js`
1. Create action for `USER_SIGNUP`
1. Create `gql/mutations/UserSignup.gql`. Use the `userSignUpWithPassword` mutation.

## 4. Login a user

1. Create a `USER_LOGIN`
1. Create `gql/mutations/UserLogin.gql`. Use the `userLogin` mutation.
1. Set `this.$apolloHelpers.onLogin(token)`.
1. Save token to store, helps for the refresh token later.
1. Get user and save to store, see next step.
1. Redirect to protected route?

## 5. Get user data

1. Create a `USER_GET` action.
1. Create `gql/queries/User.gql`. Use the `User` query.

## 6. Protected Auth Middleware

1. Create a `middleware/authenticated.js` file
1. Add `middleware: ["authenticated"]` to each page route you want to be protected.

TIP Now would be a good time to persist your user data.
SEE https://www.npmjs.com/package/nuxt-vuex-localstorage

NOTE If you use `nuxt-vuex-localstorage` keep in mind that the server will not have access to your browsers local storage, so be on the look out for node mismatch SSR errors. Best to avoid this using `nuxtServerInit` hook for required data and use of `<client-only>`. Another good idea is to use route params for data required to make SSR requests.

## 7. Create a Post

1. Create a form on `/pages/home.vue`
1. Add `<button-upload>` component, capture `uploadedAll` event.
1. Use `postCreate` GQL mutation on form submit. Use emitted Filestack `fileId` from `<button-upload>` component.
   1. Note the `create` relationship syntax in GQL. There is also `connect` and `reconnect`.
      1. `create` creates the image while also creating the post.
      1. `connect` would connect to an image that already existed in 8Base somewhere.
      1. `reconnect` would be used if you could connect multiple images to a post, and you wanted to RESET all connections.
1. The `refecthQueries` feature is useful for a basic alternative to a websocket subscription.

## 8. List user's posts

1.  Make a smart query, using the `postsList` GQL query.
    1. Note the `orderBy` parameter in the query.
1.  Be sure to use the `update()` function to return what you need.
1.  Note the use of `$apollo.loading` in your templates.

## 9. Logout

1.  Use `this.$apolloHelpers.onLogout()` in a async store action, useful to clear store too.
1.  Then redirect to login page.

## 8Base Roles

SEE https://app.8base.com/app-services/roles

The "Custom Filters" are just GQL `filter: {}` objects, so you can mock them in the API Explorer.

## Do it better

Some `devDependencies` for better developer experience:

```
eslint
eslint-plugin-vue
prettier
prettier-eslint
sass-loader
```

Use this to make your Vuex data work between reloads!
SEE https://www.npmjs.com/package/nuxt-vuex-localstorage

Use lodash `_get()` a lot!
SEE https://www.npmjs.com/package/lodash
