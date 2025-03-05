# Here is how Pusher works:
  
The app loads the context `ActiveStatus` and calls the hook `useActiveChannel` ([context](/app/context/PresenceContext.tsx), [hook](/app/hooks/useActiveChannel.ts)).

If the user is logged in, `PusherClient` subscribes to `"presence-messenger"` and in doing so asks for an auth token at `/api/pusher/auth` ([api route](/app/api/pusher/auth/route.ts), [client object](/app/libs/pusher.ts)).

`PusherServer` signs the request for `PusherClient` and passes the data for the user only if the user is logged in. If the user is not logged in, `PusherClient`'s auth token recieves a 403 `Forbidden` response and the presence channel is not created.

From here, the presence channel must listen to `pusher:subscription_succeeded`, `pusher:member_added`, `pusher:member_removed` so the app has a copy of the present members. Now, the app can get a copy of the members with the hook `useActiveList` ([hook](/app/hooks/useActiveList.ts)).
  
```mermaid
sequenceDiagram
participant App as App
    participant Hook as useActiveChannel
    participant NA as NextAuth
    participant PC as PusherClient
    participant api as /api/pusher/auth
    participant PS as PusherServer
    App->>Hook: 
    Hook->>NA: get session 
    NA-->>Hook: return user
    alt user exists
        Hook->>PC: subscribe('presence-messenger')
        PC->>api: POST
        api->>NA: get session 
        NA-->>api: return user
        api->>PS: authorizeChannel
        PS-->>api: return authResponse
        api-->>PC: 200 response OK. <br/> Auth token is signed
        PC-->>Hook: zustand keeps a copy of present members
        Hook-->>App: App gets <br/> presence channels
    else no user
        Hook-->>App: App continues <br/> without presence channels
    end
```

### Notice

If the user has not logged in, `PusherClient` won't subscribe to `"presence-messenger"`. Now if somehow `PusherClient` subscribes incorrectly from the frontend, the requested auth token will NOT get signed by `PusherServer` because of backend validation. For example:

```mermaid
sequenceDiagram
participant App as App
    participant Hook as useActiveChannel
    participant NA as NextAuth
    participant PC as PusherClient
    participant api as /api/pusher/auth
    participant PS as PusherServer
    App->>Hook: 
    Hook->>NA: get session 
    NA-->>Hook: return incorrect user
    Note left of Hook: user exists in error
    Hook->>PC: subscribe('presence-messenger')
    PC->>api: POST
    api->>NA: get session 
    NA-->>api: return null
    Note left of NA: no user
    api-->>PC: 403 response Forbidden. <br/> Auth token is not signed
    PC-->>Hook: present members remains empty
    Hook-->>App: App continues <br/> without presence channels
```
