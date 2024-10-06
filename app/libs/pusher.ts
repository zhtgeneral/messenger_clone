import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

/**
 * Here is how Pusher works:
 * 
 * When the app is loaded, it loads `ActiveStatus` as context which loads `useActiveChannel`.
 * 
 * In `useActiveChannel`, PusherClient subscribes to `prescence-messenger`
 * and in doing so it calls `POST` to `/api/pusher/auth`.
 * 
 * The API endpoint recieves the socket id and channel name
 * and authorizes the channel for a user, checking if the user is authenticated.
 * 
 * * Essentially, doing this gets the effect of marking the user 'online'.
 * 
 * ```mermaid
 * sequenceDiagram
    participant App as ActiveStatus
    participant PC as PusherClient
    participant api as /api/pusher/auth
    participant NA as NextAuth
    participant PS as PusherServer
    Note left of App: App calls ActiveStatus on render
    App->>PC: subscribe('presence-messenger')
    PC->>api: POST
    api->>NA: get session 
    NA-->>api: return user
    alt user exists
        api->>PS: authorizeChannel(socketId, 'presence-messenger', userEmail)
        api-->>PC: 200 response
    else no user
        api-->>PC: 401 response
    end
  ```
 * 
 */

/**
 * Pusher server object that triggers events.
 * @requires PUSHER_APP_ID from env
 * @requires NEXT_PUBLIC_PUSHER_APP_KEY from env
 * @requires PUSHER_SECRET from env
 * 
 * This link descibes how to use Pusher channels.
 * @link https://pusher.com/docs/channels/server_api/overview/
 * 
 */
export const pusherServer = new PusherServer({
  appId  : process.env.PUSHER_APP_ID!,
  key    : process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret : process.env.PUSHER_SECRET!,
  cluster: 'us3',
  useTLS : true
})

/**
 * Pusher client object that recieves events.
 * @requires NEXT_PUBLIC_PUSHER_APP_KEY from env
 * 
 * This link descibes how to use Pusher Client.
 * @link https://pusher.com/docs/channels/getting_started/react-native/
 * 
 * Next time use react-native-websockets instead of pusher-js
 * 
 */
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, 
  {
    channelAuthorization: {
      endpoint: '/api/pusher/auth',
      transport: 'ajax' 
    },
    cluster: 'us3'
  }
)