const spinner = document.getElementsByClassName("spinner")[0]
spinner.classList.add("exit")
setTimeout(() => { spinner.remove() }, 200)

import { observer } from "mobx-preact"
import { Component, h, render } from "preact"
import Profile from "./profile"
import { Link, Route, Router } from "./router"
import { store } from "./store"

@observer
class App extends Component {

  componentDidMount() {
    store.loadUsers().catch(console.error)
  }

  render() {
    return (
      <Router>
        <div id="app">
          <nav>
            <ul>
              {store.getSortedUsers().map((user, i) => (
                <li
                  key={user.id}
                  style={{
                    animationDelay: `${i * 20}ms`,
                    top: `calc(var(--menu-item-height) * ${i})`,
                    transitionDelay: `${i * 20}ms`,
                  }}
                >
                  <Link href={`people/${user.id}`} active>
                    <img class="avatar" src={user.picture.large} />
                    {user.name.first} {user.name.last}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <main>
            <Route match="people">
              <Route match="*" component={Profile} />
            </Route>
          </main>
        </div>
      </Router>
    )
  }

}

render(<App />, document.body)
