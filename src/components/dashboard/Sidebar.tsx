import { useDashboardLayout } from "@/context/DashboardLayoutContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarNav } from "./SidebarNav";

export function DashboardSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border/40 bg-sidebar/90 backdrop-blur-xl lg:flex lg:flex-col">
      <SidebarNav />
    </aside>
  );
}

export function MobileSidebar() {
  const { mobileNavOpen, setMobileNavOpen } = useDashboardLayout();

  return (
    <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
      <SheetContent
        side="left"
        className="w-[min(100vw-2rem,18rem)] border-border/60 bg-sidebar/95 p-0 backdrop-blur-xl"
      >
        <div className="flex h-full flex-col">
          <SidebarNav onNavigate={() => setMobileNavOpen(false)} compact />
        </div>
      </SheetContent>
    </Sheet>
  );
}
