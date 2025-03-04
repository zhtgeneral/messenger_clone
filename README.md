# Messaging web app 💬🗨️

### What it does

This web app allows users to create conversations and send messages and images in realtime.

This project is end-to-end tested and tests mobile and desktop scenarios.

The UI is responsive for mobile and desktops.

### Details

This page explains how Pusher works more in detail [here](/app/libs/pusher.md).

### How to recreate

#### Third party steps

NextJS, React, Tailwind CSS:

- `npx create-next-app@latest`
- Select App router, Tailwind, Typescript

Prisma:

- `npm install prisma typescript tsx @types/node --save-dev`
- `npx prisma init` (creates schema)
- `npx prisma generate` (creates local types)
- `npx prisma db push` (pushes remote changes)
- get database url from Mongodb:
  - Create project
  - Create cluster
  - Get Connection String
  - Copy and paste database url into environment variable
- Set `provider = "mongodb"` in schema
- Create database schema ([example](/prisma/schema.prisma))

NextAuth:

- `npm install next-auth`
- `npm install @next-auth/prisma-adapter`
- create authOptions ([example](./app/libs/authOptions.ts))
  - setup Prisma adapter
  - setup Providers:
    - setup Github provider in Github:
      - settings
      - devloper settings
      - OAuth apps
      - New OAuth app
      - Fill info (use `localhost:3000` as homepage and Authorization callback URL)
      - Copy and paste `Client ID` and `Client Secret` into environment variables
    - setup Google provider in Google cloud platform:
      - Create new project
      - Select Google Auth Platform
      - Configure project
        - Fill App information, Audience, Contact Information, Finish
      - Select Clients from sidebar
      - Create client
        - Select `http://localhost:3000/api/auth/callback/google` for Authorized redirect URIs (need to change when in prod)
      - Copy and paste `Client ID` and `Client secret` into environment variables
    - setup credentials and authorize callback function
  - Add domains into `next.config.mjs`:
    - `avatars.githubusercontent.com`
    - `lh3.googleusercontent.com`
  - (optional) setup hashing secret
- Create handler for GET and POST using `authOptions` at `/api/auth/[...nextauth]` ([example](./app/api/auth/[...nextauth]/route.ts))
  - Use encyption as needed `npm install bcrypt`
- Wrap app in `<SessionProvider>` ([example](./app/context/AuthContext.tsx))
- Login using `getServerSession(authOptions)` ([example](./app/actions/getSession.ts))

Pusher:

- `npm install pusher-js` (PusherClient for recieving events)
- `npm install pusher` (PusherServer for triggering events)
- get app keys from Pusher dashboard:
  - Select Channels
  - Create app
  - Go to App Settings
    - Activate Enable authorized connections
  - Goto App keys
    - Copy and paste `app_id`, `key`, `secret`, `cluster` into environment variables.
- Create PusherServer and PusherClient instances using app secrets ([example](./app/libs/pusher.ts))
- Setup Prescence Channels using PusherClient ([example](./app/hooks/useActiveChannel.ts)):
  - Create a prescence channel by using subscribing to `prescence-<name>`
  - Bind on `pusher:subscription_suceeded` and update global store of members
  - Bind on `pusher:member_added` and update global store of members
  - Bind on `pusher:member_removed` and update global store of members
  - On cleanup unsubscribe from `prescence-<name>` 
    - Note useEffect and useState can prevent duplicates
  - Call this as context only when the user exists ([example](./app/context/PresenceContext.tsx))
- Setup Authorized channels using PusherServer (required for prescence channels):
  - Setup `channelAuthorization endpoint` (for example) `/api/pusher/auth`
  - Create a POST method
    - Check for session using next auth
    - Call authorizeChannel with `socketId`, `channel`, and `data: { user_id: <id> }` ([example](./app/api/pusher/auth/route.ts))
- Listen to events using PusherClient ([example](./app/conversations/components/ConversationList.tsx), [example](./app/conversations/[conversationId]/components/Body.tsx)):
  - subscribe to a channel (gets access to certain resources)
  - bind to events using event names (listens to events)
  - on cleanup unsubscribe and unbind
    - Note useEffect is good for this
- Send events using PusherServer ([example](./app/api/conversations/route.ts), [example](./app/api/conversations/[conversationId]/seen/route.ts), [example](./app/api/conversations/[conversationId]/route.ts), [example](./app/api/messages/route.ts))
  - trigger on a channel name with an event and data

Zustand:

- `npm install zustand`
- Create useActiveList to store global states ([example](./app/hooks/useActiveList.ts))

Cypress

- `npm install cypress --save-dev`
- `npx cypress open` (to open in dev mode)
- `npx cypress run` (to run tests)
- Setup helper functions ([example](./cypress/support/commands.ts)):
  - Go to `cypress/support/commands.ts`
  - declare global
    - namespace Cypress
      - Extend Interface `Chainable<Subject = any>`
      - Put helper function signatures in this interface
  - Use `Cypress.Commands.add()` to add helper functions
  - Use `Cypress.wrap(null).then(() => asyncFunction())` to use async functions within cypress
  - (Optional) change timeout in `cypress.config.ts` ([example](./cypress.config.ts))

Cloudinary:

- `npm install next-cloudinary`
- get Cloudinary Upload Preset from Cloudinary Dashboard
  - Settings
  - Click Upload presets
  - Add Upload Preset
    - select unsigned
  - copy and paste `cloud name` and `upload preset name` into environment variables
- Add domains in to `next.config.mjs`:
  - `res.cloudinary.com`
- Use `<CldUploadButton>` for image uploads

#### The rest of the implementation

REST API:

- create endpoints as needed

Front end:

- `npm install clsx` for conditional rendering of styles
- `npm install date-fns` to format dates
- `npm install lodash` for type maniuplation
- create features as needed
- use React icons as needed
