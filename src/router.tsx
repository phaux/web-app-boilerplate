import { Component, ComponentChild, ComponentFactory, h } from "preact"
import { createContext } from "preact-context"

export type RouterContext = {
  match: string[];
  path: string[];
  navigate(path: string): void;
}
const defaultContext: RouterContext = { match: [], path: [], navigate() {} }
const { Consumer, Provider } = createContext<RouterContext>(defaultContext)

export class Router extends Component<{}, {path: string}> {
  state = { path: location.pathname }
  componentDidMount() {
    window.addEventListener("popstate", this.update)
  }
  componentWillUnmount() {
    window.removeEventListener("popstate", this.update)
  }
  navigate = (path: string) => {
    history.pushState(null, "", path)
    this.update()
  }
  render() {
    return (
      <Provider
        children={this.props.children}
        value={{
          match: [],
          navigate: this.navigate,
          path: this.state.path.split("/").filter(Boolean),
        }}
      />
    )
  }
  update = () => {
    this.setState({ path: location.pathname })
  }
}

export type RouteChildProps = {route: string}
export type RouteProps = {
  component?: ComponentFactory<RouteChildProps>;
  match: string;
  render?(route: string): ComponentChild;
}
export class Route extends Component<RouteProps> {
  render() {
    return <Consumer render={this.renderRoute} />
  }
  renderRoute = (ctx: RouterContext) => {
    const { match, render, children, component: Component } = this.props
    const [dir, ...subpath] = ctx.path
    if (dir == null) return null
    if (match !== "*" && dir !== match) return null
    return (
      <Provider
        children={
          Component != null ? <Component key={dir} route={dir} /> :
            render != null ? render(dir) :
              children}
        value={{
          match: [...ctx.match, dir],
          navigate: ctx.navigate,
          path: subpath,
        }}
      />
    )
  }
}

export type LinkProps = JSX.HTMLAttributes & {
  active?: boolean | string;
}
export class Link extends Component<LinkProps> {
  getClassName(ctx: RouterContext) {
    const { href, active, className } = this.props
    const classes = className == null ? [] : className.split(/\s+/)
    if (active && href != null) {
      const path = ctx.path.join("/")
      const target = href.split("/").filter(Boolean).join("/")
      if (path.indexOf(target) === 0) {
        if (active === true) classes.push("active")
        else classes.push(active)
      }
    }
    return classes.length > 0 ? classes.join(" ") : undefined
  }
  getHref(ctx: RouterContext) {
    const { href } = this.props
    if (href == null || href[0] === "/") return href
    const path = href.split("/").filter(Boolean)
    return "/" + [...ctx.match, ...path].join("/")
  }
  handleClick = (ctx: RouterContext) => (e: MouseEvent) => {
    const { target, onClick } = this.props
    const href = this.getHref(ctx)
    if (onClick != null) onClick(e)
    if (e.defaultPrevented) return
    if (href == null) return
    if (e.button !== 0) return
    if (target != null && target !== "_self") return
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return
    e.preventDefault()
    ctx.navigate(href)
  }
  render() {
    return <Consumer render={this.renderLink} />
  }
  renderLink = (ctx: RouterContext) => (
    <a
      {...this.props}
      class={this.getClassName(ctx)}
      href={this.getHref(ctx)}
      onClick={this.handleClick(ctx)}
    />
  )
}

export { Consumer as RouterConsumer }
