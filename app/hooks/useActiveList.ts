import { create } from 'zustand'

interface ActiveListStore {
  members: string[],
  add: (id : string) => void,
  remove: (id : string) => void,
  set: (ids: string[]) => void
}

/**
 * This store keeps track of the global state of members.
 * 
 * A member is added if they are subscribed to Presence Channels using Pusher.
 * 
 * A member is removed if the window of the app is closed.
 * 
 * @link https://docs.pmnd.rs/zustand/getting-started/introduction
 * 
 */
const useActiveList = create<ActiveListStore>((set) => ({
  members: [],
  add: (id) => set((state) => ({members: [...state.members, id]})),
  remove: (id) => set((state) => ({members: state.members.filter((memberId) => memberId != id)})),
  set: (ids) => set({members: ids})
}));

export default useActiveList;