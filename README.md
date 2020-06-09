# 8BaseDemo-frontend

This is a basic demo of how to build a basic 8Base powered application using Nuxt as a frontend.

## Requirements

1. Will need more than the Free Tier of 8Base to use good Auth.

## Install

1. Install Nuxt
2. Install Nuxt Apollo
3. Install filestack

## 1. Config Nuxt Apollo

Get endpoint URL from: https://app.8base.com/settings/general

## 2. Setup data model in 8Base:

Go to: https://app.8base.com/data

1.  New table > Posts
2.  Add fields (caption, image)
3.  New table > Likes

    1. Drag Posts onto empty field
    2. Rename field to Posts(not Posts)

### Add mock data

1.  Add a Post using 8Base dashboard
2.  Add a Like using 8Base dashboard, connect to Post

### Note the 8Base API Explorer

SEE https://app.8base.com/api-explorer

## 3. Setup Authentication Profile

1. Go here: https://app.8base.com/app-services/authentication
2. SEE https://www.youtube.com/watch?v=CHIElGa4Hug&feature=youtu.be

Note the `Auth Profile ID`, you will need it for the GQL Query.

## 4. Signup a user

Do a GQL Mutation to `userSignUpWithPassword`.
This will create a user, be sure to set Auth Profile ID.

## 5. Login a user

1. Use the `userLogin` mutation
1. Set `this.$apolloHelpers.onLogin(token)`
1. Save token to store
1. Redirect to protected route?

## 6. Protected Auth Middleware

1. Create a `middleware/authenticated.js` file
1. Add `middleware: ["authenticated"]` to each page route.

## 7. Create a Post

1. Use `postCreate` GQL mutation, with Filestack ID from `<upload-file>` button.

## 8. Logout

1.  Use `this.$apolloHelpers.onLogout()` in a async method.

## 8Base Roles

SEE https://app.8base.com/app-services/roles

The "Custom Filters" are just GQL `filter: {}` objects, so you can mock them in the API Explorer.
