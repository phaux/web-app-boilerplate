import { ComponentFactory, h, PreactContext } from "preact"

export type Injector<P, K> = ComponentFactory<Pick<P, Exclude<keyof P, K>>>

export function createInjector<C, K extends string>(prop: K, Context: PreactContext<C>) {
  return <P extends Record<K, C>>(Child: ComponentFactory<P>): Injector<P, K> => props => (
    <Context.Consumer children={value => <Child {...props} {...{ [prop]: value } as any} />} />
  )
}

export type InjectorProps<T> = T extends (_: ComponentFactory<infer I>) => ComponentFactory<infer O>
  ? Pick<I, Exclude<keyof I, keyof O>>
  : never
