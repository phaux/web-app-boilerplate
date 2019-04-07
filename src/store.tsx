import { flow, Instance, types } from "mobx-state-tree"
import { createContext, FunctionalComponent, h } from "preact"
import { useContext, useState } from "preact/hooks/src"
import { createInjector, InjectorProps } from "./hoc-utils"

const cmp = <T, U>(fn: (x: T) => U) => (a: T, b: T): number => (fn(a) > fn(b) ? 1 : -1)

const User = types.model({
  email: types.string,
  gender: types.enumeration(["male", "female"]),
  id: types.identifier,
  name: types.model({
    first: types.string,
    last: types.string,
  }),
  picture: types.model({
    large: types.string,
  }),
})

const Store = types
  .model({
    users: types.array(User),
    usersOrder: types.enumeration(["name", "id"]),
  })
  .views(self => ({
    getSortedUsers() {
      if (self.usersOrder === "name") return self.users.slice().sort(cmp(x => x.name.first))
      if (self.usersOrder === "id") return self.users.slice().sort(cmp(x => x.id))
      throw Error(`Unknown ordering ${self.usersOrder}`)
    },
  }))
  .actions(self => ({
    addUser: flow<unknown, []>(function*() {
      const data = yield fetch("https://randomuser.me/api?results=1")
        .then(res => res.json())
        .then(data => data.results.map((user: any) => ({ ...user, id: user.login.username })))
      self.users.push(...data)
    }),
    deleteUser(id: string) {
      const user = self.users.find(u => u.id === id)
      if (user != null) self.users.remove(user)
    },
    loadUsers: flow<unknown, []>(function*() {
      const data = yield fetch(`https://randomuser.me/api?seed=${12321}&results=12`)
        .then(res => res.json())
        .then(data => data.results.map((user: any) => ({ ...user, id: user.login.username })))
      self.users.replace(data)
    }),
    setUsersOrder(order: "name" | "id") {
      self.usersOrder = order
    },
  }))

export type StoreType = Instance<typeof Store>

/** @deprecated it's better to use store via context */
export const store = Store.create({
  usersOrder: "name",
})

const StoreContext = createContext(store)

export const StoreProvider: FunctionalComponent = props => {
  const [store] = useState(() => Store.create({ usersOrder: "name" }))
  return <StoreContext.Provider value={store} children={props.children} />
}

export const withStore = createInjector("store", StoreContext)
export type WithStore = InjectorProps<typeof withStore>
export const useStore = () => useContext(StoreContext)
