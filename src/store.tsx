import { flow, types } from "mobx-state-tree"

const User = types
  .model({
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
      if (self.usersOrder === "name") {
        return self.users.slice().sort((a, b) => a.name.first > b.name.first ? 1 : -1)
      }
      else if (self.usersOrder === "id") {
        return self.users.slice().sort((a, b) => a.id > b.id ? 1 : -1)
      }
      else throw Error(`Unknown ordering ${self.usersOrder}`)
    },
  }))
  .actions(self => ({
    addUser: flow<unknown, []>(function*() {
      const data = yield fetch("https://randomuser.me/api?results=1")
        .then(res => res.json())
        .then(data => data.results.map((user: any) => ({ ...user, id: user.login.username })))
      self.users.push(...data)
    }),
    loadUsers: flow<unknown, []>(function*() {
      const data = yield fetch(`https://randomuser.me/api?seed=${12321}&results=20`)
        .then(res => res.json())
        .then(data => data.results.map((user: any) => ({ ...user, id: user.login.username })))
      self.users.replace(data)
    }),
    deleteUser(id: string) {
      const user = self.users.find(u => u.id === id)
      if (user != null) self.users.remove(user)
    },
    setUsersOrder(order: "name" | "id") {
      self.usersOrder = order
    },
  }))

export type StoreType = typeof Store.Type
export const store = Store.create({
  usersOrder: "name",
})

// const { Provider, Consumer } = createContext<StoreType>(undefined as any)

// export const StoreProvider: FunctionalComponent = props => {
//   const store = Store.create({})
//   return <Provider value={store} children={props.children} />
// }

// export type StoreProps = {store: StoreType}
// export function injectStore<T>(Child: AnyComponent<T & StoreProps>): FunctionalComponent<T> {
//   return props => <Consumer render={store => <Child {...props} store={store}/>}/>
// }
