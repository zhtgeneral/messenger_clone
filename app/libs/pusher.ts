/**
 * Shows how to get instances of Pusher
 * @link https://dashboard.pusher.com/apps/1821447/getting_started
 */

import PusherServer from 'pusher'
import PusherClient from 'pusher-js'


/**
 * Pusher server object that triggers events.
 * 
 * This link descibes how to use Pusher channels.
 * @link https://pusher.com/docs/channels/server_api/overview/
 * 
 * @requires PUSHER_APP_ID from env
 * @requires NEXT_PUBLIC_PUSHER_APP_KEY from env
 * @requires PUSHER_SECRET from env
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
 * 
 * This link descibes how to use Pusher Client.
 * @link https://pusher.com/docs/channels/getting_started/react-native/
 * 
 * Next time use react-native-websockets instead of pusher-js
 * 
 * @requires NEXT_PUBLIC_PUSHER_APP_KEY from env
 */
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
    channelAuthorization: {
      endpoint: '/api/pusher/auth', 
      transport: 'ajax' // leaving out is ok too
    },
    cluster: 'us3'
  }
)