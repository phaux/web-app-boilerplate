import { ComponentChild, ComponentFactory, createContext, FunctionalComponent, h } from "preact"
import { useCallback, useContext, useEffect, useMemo, useState } from "preact/hooks"

export type RouterContext = {
  match: string[];
  path: string[];
  navigate(path: string): void;
}

const RouterContext = createContext<RouterContext>({ match: [], path: [], navigate() {} })
export const useRouter = () => useContext(RouterContext)

const useLocation = (cb: () => void) => {
  useEffect(() => {
    window.addEventListener("popstate", cb)
    return () => {
      window.removeEventListener("popstate", cb)
    }
  }, [cb])
}

export const Router: FunctionalComponent = props => {
  const [path, setPath] = useState(location.pathname)

  const update = useCallback(() => {
    setPath(location.pathname)
  }, [setPath])

  useLocation(update)

  const navigate = useCallback(
    (path: string) => {
      history.pushState(null, "", path)
      update()
    },
    [update],
  )

  const value = useMemo(
    () => ({
      match: [],
      navigate,
      path: path.split("/").filter(Boolean),
    }),
    [navigate, path],
  )

  return <RouterContext.Provider children={props.children} value={value} />
}

export type RouteChildProps = { route: string }
export type RouteProps = {
  component?: ComponentFactory<RouteChildProps>;
  match: string;
  render?(route: string): ComponentChild;
}
export const Route: FunctionalComponent<RouteProps> = props => {
  const router = useRouter()
  const [dir, ...subpath] = router.path

  if (dir == null) return null
  if (props.match !== "*" && dir !== props.match) return null

  const children = useMemo(() => {
    if (props.component) return <props.component key={dir} route={dir} />
    if (props.render) return props.render(dir)
    return props.children
  }, [props.component, props.render, props.children])

  const value = useMemo(
    () => ({
      match: [...router.match, dir],
      navigate: router.navigate,
      path: subpath,
    }),
    [router.match, dir, subpath.join("/")],
  )

  return <RouterContext.Provider children={children} value={value} />
}

const cx = (...args: Array<string | null | undefined>): string[] => {
  const classes = []
  for (const arg of args) if (arg) classes.push(...arg.split(/\s+/))
  return classes.filter(Boolean)
}

export type LinkProps = JSX.HTMLAttributes & {
  active?: boolean | string;
}
export const Link: FunctionalComponent<LinkProps> = props => {
  const router = useRouter()

  const classes = useMemo(() => {
    const classes = cx(props.class, props.className)
    if (props.active && props.href != null) {
      const path = router.path.join("/")
      const target = props.href
        .split("/")
        .filter(Boolean)
        .join("/")
      if (path.indexOf(target) === 0) {
        if (props.active === true) classes.push("active")
        else classes.push(props.active)
      }
    }
    return classes.length > 0 ? classes.join(" ") : undefined
  }, [props.class, props.className, props.active, props.href, router.path])

  const getHref = useCallback(() => {
    if (props.href == null || props.href[0] === "/") return props.href
    const path = props.href.split("/").filter(Boolean)
    return "/" + [...router.match, ...path].join("/")
  }, [router.match, props.href])

  const handleClick = useCallback(
    (ev: MouseEvent) => {
      const href = getHref()
      if (props.onClick != null) props.onClick(ev)
      if (ev.defaultPrevented) return
      if (href == null) return
      if (ev.button !== 0) return
      if (props.target != null && props.target !== "_self") return
      if (ev.metaKey || ev.altKey || ev.ctrlKey || ev.shiftKey) return
      ev.preventDefault()
      router.navigate(href)
    },
    [getHref, router.navigate, props.onClick, props.target],
  )

  return <a {...props} class={classes} href={getHref()} onClick={handleClick} />
}
