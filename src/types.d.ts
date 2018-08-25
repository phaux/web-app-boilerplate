declare module "mobx-preact" {
  export function observer<T extends import ("preact").ComponentConstructor>(target: T): T
}
