import { useMemo } from 'react';
import { usePathname } from './router';
import { parse } from './routes';
import { Stage } from './Stage';

export function App() {
  const pathname = usePathname();
  const route = useMemo(() => parse(pathname), [pathname]);
  return <Stage route={route} />;
}
