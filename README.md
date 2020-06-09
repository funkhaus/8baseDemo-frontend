# 8BaseDemo-frontend

This is a basic demo of how to build a basic 8Base powered application using Nuxt as a frontend.

It will cover user sign up, sign in, create a post with an image, "like" a post.

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

1.  Add a Post using 8Base dashboard
2.  Add a Like using 8Base dashboard, connect to Post

### Note the 8Base API Explorer

SEE https://app.8base.com/api-explorer

## 3. Setup Authentication Profile

1. Go here: https://app.8base.com/app-services/authentication
2. SEE https://www.youtube.com/watch?v=CHIElGa4Hug&feature=youtu.be

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

### 1. Install Nuxt Apollo

SEE https://github.com/nuxt-community/apollo-module#setup

```
npm install --save @nuxtjs/apollo
```

Then:

1.  Add `@nuxtjs/apollo` to `modules` of `nuxt.config.js`
1.  Create `/plugins/apollo-config-default.js`
1.  Get endpoint URL from: https://app.8base.com/settings/general

### 1. Install filestack SDK

SEE https://www.npmjs.com/package/filestack-js

```
npm install --save filestack-js
```

## 2. Create signup route and preview

1. Create Vue template with form at `pages/signup`
1. Run `npm run dev`
1. Go to http://localhost:3000/signup

## 3. Signup a user

Do a GQL Mutation in a method to `userSignUpWithPassword`, then redirect.
This will create a user, be sure to set Auth Profile ID.

## 4. Login a user

1. Use the `userLogin` mutation
1. Set `this.$apolloHelpers.onLogin(token)`
1. Save token to store
1. Redirect to protected route?

## 5. Protected Auth Middleware

1. Create a `middleware/authenticated.js` file
1. Add `middleware: ["authenticated"]` to each page route.

## 6. Create a Post

1. Use `postCreate` GQL mutation, with Filestack ID from `<upload-file>` button.

## 7. Logout

1.  Use `this.$apolloHelpers.onLogout()` in a async method, then redirect.

## 8Base Roles

SEE https://app.8base.com/app-services/roles

The "Custom Filters" are just GQL `filter: {}` objects, so you can mock them in the API Explorer.
