"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSessionStore } from "@/store/session";
import {
  School, Users, GraduationCap, BookUser,
  CalendarDays, ClipboardCheck, BookOpen,
  Clock, LogOut, ChevronRight, Menu, X,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  teacherOnly?: boolean;
  color?: string;
}

const NAV_GESTAO: NavItem[] = [
  { label: "Escolas",     href: "/escolas",    icon: <School size={15} />,       color: "text-sky-400" },
  { label: "Turmas",      href: "/turmas",     icon: <Users size={15} />,        color: "text-violet-400" },
  { label: "Alunos",      href: "/alunos",     icon: <GraduationCap size={15} />,color: "text-emerald-400" },
  { label: "Professores", href: "/professores",icon: <BookUser size={15} />,     color: "text-amber-400", adminOnly: true },
];

const NAV_MODULOS: NavItem[] = [
  { label: "Cronograma",      href: "/cronograma", icon: <CalendarDays size={15} />,  color: "text-blue-400" },
  { label: "Chamada",         href: "/chamada",    icon: <ClipboardCheck size={15} />,color: "text-green-400",  teacherOnly: true },
  { label: "Diário de Aulas", href: "/diario",     icon: <BookOpen size={15} />,      color: "text-orange-400", teacherOnly: true },
  { label: "Horas",           href: "/horas",      icon: <Clock size={15} />,         color: "text-rose-400" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { sessao, clearSessao, isAdmin } = useSessionStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setSidebarOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    clearSessao();
    router.push("/login");
    toast.success("Sessão encerrada.");
  }

  function filteredItems(items: NavItem[]) {
    return items.filter((item) => {
      if (item.adminOnly  && !isAdmin()) return false;
      if (item.teacherOnly &&  isAdmin()) return false;
      return true;
    });
  }

  const allItems = [...NAV_GESTAO, ...NAV_MODULOS];
  const currentItem = allItems.find((i) => pathname.startsWith(i.href));

  // Avatar initials
  const initials = sessao?.nome
    ? sessao.nome.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
    : "??";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="relative flex-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/40">
              <span className="text-white font-black text-xs tracking-tight">OA</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-gray-900" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">SAG</p>
            <p className="text-gray-500 text-[10px] font-medium leading-tight">Painel de Gestão</p>
          </div>
        </div>
        <button
          className="md:hidden text-gray-500 hover:text-gray-300 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fechar menu"
        >
          <X size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-4 space-y-5 overflow-y-auto overflow-x-hidden">
        {/* Gestão group */}
        <div>
          <p className="px-2.5 mb-1.5 text-[9px] font-bold tracking-[0.12em] uppercase text-gray-600">
            Gestão
          </p>
          <div className="space-y-0.5">
            {filteredItems(NAV_GESTAO).map((item) => (
              <NavButton
                key={item.href}
                item={item}
                active={pathname.startsWith(item.href)}
                onClick={() => router.push(item.href)}
              />
            ))}
          </div>
        </div>

        {/* Módulos group */}
        <div>
          <p className="px-2.5 mb-1.5 text-[9px] font-bold tracking-[0.12em] uppercase text-gray-600">
            {isAdmin() ? "Operação" : "Módulos"}
          </p>
          <div className="space-y-0.5">
            {filteredItems(NAV_MODULOS).map((item) => (
              <NavButton
                key={item.href}
                item={item}
                active={pathname.startsWith(item.href)}
                onClick={() => router.push(item.href)}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* User profile + logout */}
      <div className="p-2.5 border-t border-white/5">
        {/* User info card */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.04] mb-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-none">
            <span className="text-white text-[10px] font-bold">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-200 text-xs font-semibold truncate leading-tight">
              {sessao?.nome ?? "—"}
            </p>
            <p className="text-gray-500 text-[10px] leading-tight">
              {isAdmin() ? "Administrador" : "Professor"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/8 transition-colors group"
        >
          <LogOut size={13} className="group-hover:scale-110 transition-transform" />
          Sair da conta
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50">

      {/* ── Mobile overlay ─────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar desktop ─────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex w-[200px] flex-none flex-col"
        style={{
          background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
          borderRight: "1px solid rgba(255,255,255,0.05)"
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── Sidebar mobile drawer ───────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex flex-col overflow-hidden md:hidden",
          "transition-transform duration-250 ease-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
          borderRight: "1px solid rgba(255,255,255,0.05)"
        }}
        aria-label="Menu de navegação"
      >
        <SidebarContent />
      </aside>

      {/* ── Main content area ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ── Top header ─────────────────────────────────────────────────── */}
        <header className="flex-none flex items-center px-4 sm:px-5 bg-white border-b border-slate-200 shadow-sm"
          style={{ height: "56px" }}>

          {/* Hamburger mobile */}
          <button
            className="md:hidden mr-3 p-2 -ml-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors flex-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={18} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="font-bold text-slate-400 text-sm flex-none">SAG</span>
            {currentItem && (
              <>
                <ChevronRight size={13} className="text-slate-300 flex-none" />
                <span className="text-slate-700 font-semibold text-sm truncate">
                  {currentItem.label}
                </span>
              </>
            )}
          </div>

          {/* Right side — role badge */}
          <div className="flex items-center gap-2 ml-3 flex-none">
            <span className={cn(
              "hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase",
              isAdmin()
                ? "bg-violet-50 text-violet-700 border border-violet-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            )}>
              <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                isAdmin() ? "bg-violet-500" : "bg-blue-500"
              )} />
              {isAdmin() ? "Admin" : "Professor"}
            </span>
          </div>
        </header>

        {/* ── Page content ───────────────────────────────────────────────── */}
        <main className="flex-1 overflow-auto">
          {mounted ? children : null}
        </main>
      </div>
    </div>
  );
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 text-left group",
        active
          ? "bg-blue-500/15 text-blue-300 shadow-inner"
          : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
      )}
    >
      <span className={cn(
        "flex-none transition-transform duration-150 group-hover:scale-110",
        active ? "text-blue-400" : item.color ?? "text-gray-500"
      )}>
        {item.icon}
      </span>
      <span className="truncate">{item.label}</span>
      {active && (
        <span className="ml-auto w-1 h-4 rounded-full bg-blue-400 flex-none" />
      )}
    </button>
  );
}