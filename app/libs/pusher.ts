// boilerplate-ass code from https://dashboard.pusher.com/apps/1821447/getting_started
// dumbass pusher doesn't support new version of react for pusher-websocket-react-native
// and pusher-js will be deprecated for react

import PusherServer from 'pusher'
import PusherClient from 'pusher-js'


// why this pusher? this one triggers events https://pusher.com/docs/channels/server_api/overview/
export const pusherServer = new PusherServer({
  appId  : process.env.PUSHER_APP_ID!,
  key    : process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret : process.env.PUSHER_SECRET!,
  cluster: 'us3',
  useTLS : true
})

// why this pusher? this ones accepts events. Next time use react-native-websockets instead of pusher-js
// https://pusher.com/docs/channels/getting_started/react-native/
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
    cluster: 'us3'
  }
)