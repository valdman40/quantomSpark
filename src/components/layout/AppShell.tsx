import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { NotificationList } from '../common/NotificationList';

/**
 * Root layout shell.
 * TopBar is fixed at the top; below it the sidebar and the <Outlet> share the remaining height.
 */
export function AppShell() {
  return (
    <div className="app-shell">
      <TopBar />
      <div className="app-body">
        <Sidebar />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
      <NotificationList />
    </div>
  );
}
