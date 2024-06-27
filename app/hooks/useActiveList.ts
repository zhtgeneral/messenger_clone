import {create} from 'zustand'

// as usual the docs are here https://docs.pmnd.rs/zustand/getting-started/introduction

interface ActiveListStore {
  members: string[],
  add    : (id : string  ) => void,
  remove : (id : string  ) => void,
  set    : (ids: string[]) => void
}

const useActiveList = create<ActiveListStore>((set) => ({
  members: [],
  add    : (id)  => set((state) => ({members: [...state.members, id]})),
  remove : (id)  => set((state) => ({members: state.members.filter((memberId) => memberId != id)})),
  set    : (ids) => set({members: ids})
}))

export default useActiveList