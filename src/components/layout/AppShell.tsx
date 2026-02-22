import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';
import { Footer } from './Footer';
import { NotificationList } from '../common/NotificationList';

/**
 * Root layout shell.
 * TopBar fixed at top → sidebar + content in app-body → StatusBar → Footer
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
      <StatusBar />
      <Footer />
      <NotificationList />
    </div>
  );
}
