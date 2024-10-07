import { useEffect, useState } from "react";
import useActiveList from "./useActiveList";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "../libs/pusher";

/**
 * This function lets zustand keep track of authorized users in prescence channels
 * 
 * @requires pusherClient needs to be set up first
 * 
 * It sets the active channel using the name `presence-messenger` (is the name required by Pusher account?)
 * and marks an activeChannel using `useState`.
 * 
 * While an active channel exists,
 * 
 * Add handlers to Pusher so that:
 * 
 * Whenever a subscriber is present, zustand handles all the members.
 * 
 * Whenever a member gets added to prescence, zustand handles adding the member.
 * 
 * Whenever a member gets removed from prescence, zustand handles removing the member.
 * 
 * @link https://pusher.com/docs/channels/using_channels/presence-channels/
 * 
 * Then clear the activeChannel so it can no longer be accessed.
 */
export default function useActiveChannel() {
  const {set, add, remove} = useActiveList();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  
  useEffect(() => {
    let channel = activeChannel;
    if (!channel) {
      channel = pusherClient.subscribe('presence-messenger');
      setActiveChannel(channel);
    }
    channel.bind('pusher:subscription_succeeded', (members: Members) => {
      const initialMembers: string[] = [];
      members.each((member: Record<string, any>) => initialMembers.push(member.id))
      set(initialMembers);
    })

    channel.bind('pusher:member_added', (member: Record<string, any>) => add(member.id));
    channel.bind('pusher:member_removed', (member: Record<string, any>) => remove(member.id));
    
    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-messenger');
        setActiveChannel(null);
      }
    }
  }, [activeChannel, set, add, remove]);
}