/// <reference path="./types.d.ts" />
import {Component, h, render} from 'preact'
import {observer} from 'mobx-preact'
import {decorate, observable} from 'mobx'
import * as Todos from './todos'

const App = observer(class extends Component {

  /** @param {object} props */
  constructor(props) {
    super(props)
    this.todos = Todos.data
    this.text = 'Make coffee'
  }

  render() {
    return h('div', {},
      h('h1', {}, 'Todo App'),
      h('ul', {},
        this.todos.map(todo => h('li', {}, todo.title))
      ),
      h('form', {
        onSubmit: ev => {
          ev.preventDefault()
          if (!this.text) return
          Todos.create({title: this.text, done: false})
          this.text = ''
        },
      }, h('input', {
        value: this.text,
        onChange: ev => this.text = /** @type {HTMLInputElement} */ (ev.target).value,
      })),
    )
  }

})

decorate(App, {
  todos: observable,
  text: observable,
})

render(h(App, {}), document.body)
