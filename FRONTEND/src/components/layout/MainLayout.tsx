import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import AppSideBar from "./AppSideBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSideBar />

        <main className="flex-1x">
          <div className="container px-4 py-6 max-w-7xl mx-auto">
            <SidebarTrigger />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
