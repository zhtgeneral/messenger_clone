import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

/**
 * Pusher server object that signs auth token for Pusher client.
 * @requires PUSHER_APP_ID from env
 * @requires PUSHER_SECRET from env
 * @requires NEXT_PUBLIC_PUSHER_APP_KEY from env
 * 
 * This link descibes how to use Pusher for authorizing channels.
 * @link https://pusher.com/docs/channels/server_api/overview/
 * @link [details](./pusher.md)
 */
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: 'us3',
  useTLS : true
})

/**
 * Pusher client object that interacts with channels.
 * @requires NEXT_PUBLIC_PUSHER_APP_KEY from env
 * 
 * This link descibes how to use Pusher Client for presence channels.
 * @link https://pusher.com/docs/channels/using_channels/presence-channels/
 * @link [details](./pusher.md)
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