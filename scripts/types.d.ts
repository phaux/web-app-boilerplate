declare namespace App {
  type Todo = {
    title: string
    done: boolean;
  }
}

declare module 'mobx-preact' {
  export function observer<T extends import('preact').ComponentConstructor>(target: T): T
}
