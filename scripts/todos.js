import {observable} from 'mobx'

/** @type {Array<App.Todo & {id: string}>} */
export const data = observable([])

/**
 * @param {App.Todo} todo
 * @return {void}
 */
export function create(todo) {
  data.push({...todo, id: new Date().toISOString()})
}

/**
 * @param {string} id
 * @return {void}
 */
export function remove(id) {
  const i = data.findIndex(item => item.id == id)
  if (i >= 0) data.splice(i, 1)
}
