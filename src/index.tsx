import { observable } from "mobx"
import { observer } from "mobx-preact"
import { Component, h, render } from "preact"

@observer
class App extends Component {

  @observable count = 0

  handleClick = () => this.count += 1

  render() {
    return <div>
      <button onClick={this.handleClick}>Click me</button>
      <p>Clicks: {this.count}</p>
    </div>
  }

}

render(<App />, document.body)
