declare module "mobx-preact" {
  import { ComponentConstructor } from "preact"
  export function observer<T extends ComponentConstructor>(target: T): T
}
