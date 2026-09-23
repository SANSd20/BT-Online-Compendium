import { useEffect, useState } from 'react'

export type AppRoute = '/' | '/archetype' | '/point-buy' | '/life-modules'

const routes = new Set<AppRoute>(['/', '/archetype', '/point-buy', '/life-modules'])

function readRoute(): AppRoute {
  const candidate = (window.location.hash.slice(1) || '/') as AppRoute
  return routes.has(candidate) ? candidate : '/'
}

export function useHashRoute(): AppRoute {
  const [route, setRoute] = useState<AppRoute>(readRoute)

  useEffect(() => {
    const update = () => setRoute(readRoute())
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  return route
}

