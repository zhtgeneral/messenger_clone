import { Channel, Members } from "pusher-js";
import { pusherClient } from "../libs/pusher";
import useActiveList from "./useActiveList";
import React from "react";
import { useSession } from "next-auth/react";

/**
 * This function lets zustand keep track of present members in prescence channels.
 * 
 * @requires AuthContext needs to wrap this hook
 * @requires pusherClient needs to be created and send auth request to correct location.
 * @requires pusherServer needs to be able to sign the auth token at the correct location.
 * 
 * `PusherClient` subscribes to presence channels using the name `presence-messenger`
 * and marks an activeChannel using `useState`.
 * 
 * If an active channel exists, it listen to the events
 * `pusher:subscription_succeeded`, `pusher:member_added`, `pusher:member_removed`
 * and saves a copy so the app can keep track of active members.
 * 
 * @link https://pusher.com/docs/channels/using_channels/presence-channels/
 * 
 * Then unsubscribe from prescence when leaving the app.
 */
export default function useActiveChannel() {
  const { set, add, remove } = useActiveList();
  const session = useSession();

  const [activeChannel, setActiveChannel] = React.useState<Channel | null>(null);
  
  React.useEffect(() => {
    if (!session?.data?.user?.email) {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-messenger");
        setActiveChannel(null);
      }
      return; 
    }

    let channel = activeChannel;
    if (!channel) {
      channel = pusherClient.subscribe('presence-messenger');
      setActiveChannel(channel);
    }
    channel.bind('pusher:subscription_succeeded', initPrescenceMembers);
    channel.bind('pusher:member_added', addPrescenceMember);
    channel.bind('pusher:member_removed', removePrescenceMember);

    function initPrescenceMembers(members: Members) {
      const initialMembers: string[] = [];
      members.each((member: Record<string, any>) => initialMembers.push(member.id));
      set(initialMembers);
    }
    function addPrescenceMember(member: Record<string, any>) {
      add(member.id);
    }
    function removePrescenceMember(member: Record<string, any>) {
      remove(member.id)
    }
    
    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-messenger');
        setActiveChannel(null);
      }
    }
  }, [activeChannel, set, add, remove, session]);  
}