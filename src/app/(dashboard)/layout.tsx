"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSessionStore } from "@/store/session";
import {
  Home, School, Users, GraduationCap, BookUser,
  CalendarDays, ClipboardCheck, BookOpen,
  Clock, LogOut, ChevronRight, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import type { UsuarioSessao } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  teacherOnly?: boolean;
}

const NAV_PRINCIPAL: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <Home size={16} /> },
];

const NAV_GESTAO: NavItem[] = [
  { label: "Escolas", href: "/escolas", icon: <School size={16} /> },
  { label: "Turmas", href: "/turmas", icon: <Users size={16} /> },
  { label: "Alunos", href: "/alunos", icon: <GraduationCap size={16} /> },
  { label: "Professores", href: "/professores", icon: <BookUser size={16} />, adminOnly: true },
];

const NAV_MODULOS: NavItem[] = [
  { label: "Cronograma", href: "/cronograma", icon: <CalendarDays size={16} /> },
  { label: "Chamada", href: "/chamada", icon: <ClipboardCheck size={16} />, teacherOnly: true },
  { label: "Diário de Aulas", href: "/diario", icon: <BookOpen size={16} />, teacherOnly: true },
  { label: "Horas", href: "/horas", icon: <Clock size={16} /> },
];

const ALL_NAV_ITEMS = [...NAV_PRINCIPAL, ...NAV_GESTAO, ...NAV_MODULOS];

function getVisibleItems(items: NavItem[], admin: boolean) {
  return items.filter((item) => {
    if (item.adminOnly && !admin) return false;
    if (item.teacherOnly && admin) return false;
    return true;
  });
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { sessao, clearSessao, isAdmin } = useSessionStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const admin = isAdmin();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    clearSessao();
    router.push("/login");
    toast.success("Sessão encerrada.");
  }

  const currentItem = ALL_NAV_ITEMS.find((item) => {
    if (item.href === "/dashboard") return pathname === item.href;
    return pathname.startsWith(item.href);
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className="hidden w-56 flex-none flex-col overflow-y-auto border-r border-slate-800 bg-slate-950 md:flex">
        <SidebarContent
          sessao={sessao}
          admin={admin}
          pathname={pathname}
          onNavigate={(href) => router.push(href)}
          onLogout={handleLogout}
        />
      </aside>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-hidden border-r border-slate-800 bg-slate-950",
          "transition-transform duration-200 ease-out md:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Menu de navegação"
      >
        <SidebarContent
          sessao={sessao}
          admin={admin}
          pathname={pathname}
          onNavigate={(href) => router.push(href)}
          onLogout={handleLogout}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 flex-none items-center gap-3 border-b border-slate-200 bg-white px-4 md:px-6">
          <button
            className="flex-none rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-1.5 text-sm">
            <span className="font-semibold text-slate-900">SAG</span>
            {currentItem && (
              <>
                <ChevronRight size={14} className="flex-none text-slate-300" />
                <span className="truncate font-medium text-slate-600">
                  {currentItem.label}
                </span>
              </>
            )}
          </div>

          <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 sm:flex">
            <span className="max-w-[180px] truncate font-medium">
              {sessao?.nome ?? "Sessão"}
            </span>
            <span className="rounded-md bg-white px-1.5 py-0.5 font-semibold text-slate-500">
              {admin ? "Admin" : "Professor"}
            </span>
          </div>
        </header>

        <main className="sag-main flex-1 overflow-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  sessao,
  admin,
  pathname,
  onNavigate,
  onLogout,
  onClose,
}: {
  sessao: UsuarioSessao | null;
  admin: boolean;
  pathname: string;
  onNavigate: (href: string) => void;
  onLogout: () => void;
  onClose?: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
        <button
          type="button"
          onClick={() => onNavigate("/dashboard")}
          className="flex min-w-0 items-center gap-3 text-left"
        >
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white">
            SAG
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight text-white">Sistema SAG</p>
            <p className="mt-0.5 truncate text-xs leading-tight text-slate-500">
              {sessao?.nome ?? "Carregando sessão"}
            </p>
          </div>
        </button>

        {onClose && (
          <button
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white md:hidden"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        <NavGroup
          label="Principal"
          items={getVisibleItems(NAV_PRINCIPAL, admin)}
          pathname={pathname}
          onNavigate={onNavigate}
        />
        <NavGroup
          label="Gestão"
          items={getVisibleItems(NAV_GESTAO, admin)}
          pathname={pathname}
          onNavigate={onNavigate}
        />
        <NavGroup
          label={admin ? "Operação" : "Rotina"}
          items={getVisibleItems(NAV_MODULOS, admin)}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      </nav>

      <div className="space-y-3 border-t border-slate-800 px-3 py-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Perfil ativo
          </p>
          <p className="mt-0.5 text-xs font-semibold text-slate-200">
            {admin ? "Administrador" : "Professor"}
          </p>
        </div>

        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-950/40 hover:text-red-200"
        >
          <LogOut size={15} />
          Sair
        </button>
      </div>
    </>
  );
}

function NavGroup({
  label,
  items,
  pathname,
  onNavigate,
}: {
  label: string;
  items: NavItem[];
  pathname: string;
  onNavigate: (href: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
        {label}
      </p>

      <div className="space-y-0.5">
        {items.map((item) => (
          <NavButton
            key={item.href}
            item={item}
            active={
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href)
            }
            onClick={() => onNavigate(item.href)}
          />
        ))}
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
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
      )}
    >
      <span className="flex-none">{item.icon}</span>
      <span className="truncate font-medium">{item.label}</span>
    </button>
  );
}
