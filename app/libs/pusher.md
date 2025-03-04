# Here is how Pusher works:
  
Only when the user is logged in, the app loads the context `ActiveStatus` and calls the hook `useActiveChannel` ([context](/app/components/ActiveStatus.tsx), [hook](/app/hooks/useActiveChannel.ts)).

In the hook, `PusherClient` subscribes to `"prescence-messenger"` and in doing so asks for an auth token at `/api/pusher/auth` ([api route](/app/api/pusher/auth/route.ts)).

`PusherServer` signs the request for `PusherClient` and passes the data for the user only if the user is logged in (hence the requirement that the context cannot be called at root layout). If the user is not logged in, `PusherClient`'s auth token recieves a 403 `Forbidden` response and the presence channel is not created.

From here, the presence channel must listen to `pusher:subscription_succeeded`, `pusher:member_added`, `pusher:member_removed` so the app has a copy of the present members. Now, the app can get a copy of the members with the hook `useActiveList` ([hook](/app/hooks/useActiveList.ts)).
  
```mermaid
sequenceDiagram
    participant App as ActiveStatus
    participant PC as PusherClient
    participant api as /api/pusher/auth
    participant NA as NextAuth
    participant PS as PusherServer
    Note left of App: If ActiveContext is called <br/> after the user logs in
    App->>PC: subscribe('presence-messenger')
    PC->>api: POST
    api->>NA: get session 
    NA-->>api: return user
    api->>PS: authorizeChannel(socketId, 'presence-messenger', userEmail)
    PS-->>api: return authResponse
    api-->>PC: 200 response OK. <br/> Auth token is signed
    PC-->>App: app continues with presence
```

### Caution

If the `ActiveContext` is called at the root layout before the user has logged in, `PusherClient`'s auth token will NOT get signed by `PusherServer`. The app will remain the same but continue without presence channels. To mitigate this, there is a check for the current user in the hook ([here](/app//hooks/useActiveChannel.ts)).

```mermaid
sequenceDiagram
    participant App as ActiveStatus
    participant PC as PusherClient
    participant api as /api/pusher/auth
    participant NA as NextAuth
    Note left of App: If ActiveContext is called <br/> before the user logs in
    App->>PC: subscribe('presence-messenger')
    PC->>api: POST
    api->>NA: get session 
    NA-->>api: return null
    api-->>PC: 403 response Forbidden. <br/> Auth token is not signed
    PC-->>App: app continues without presence
```