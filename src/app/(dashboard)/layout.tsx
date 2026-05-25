"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSessionStore } from "@/store/session";
import {
  School, Users, GraduationCap, BookUser,
  CalendarDays, ClipboardCheck, BookOpen,
  Clock, LogOut, ChevronRight, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  teacherOnly?: boolean;
}

const NAV_GESTAO: NavItem[] = [
  { label: "Escolas",     href: "/escolas",    icon: <School size={16} /> },
  { label: "Turmas",      href: "/turmas",     icon: <Users size={16} /> },
  { label: "Alunos",      href: "/alunos",     icon: <GraduationCap size={16} /> },
  { label: "Professores", href: "/professores",icon: <BookUser size={16} />, adminOnly: true },
];

const NAV_MODULOS: NavItem[] = [
  { label: "Cronograma",      href: "/cronograma", icon: <CalendarDays size={16} /> },
  { label: "Chamada",         href: "/chamada",    icon: <ClipboardCheck size={16} />, teacherOnly: true },
  { label: "Diário de Aulas", href: "/diario",     icon: <BookOpen size={16} />,      teacherOnly: true },
  { label: "Horas",           href: "/horas",      icon: <Clock size={16} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { sessao, clearSessao, isAdmin } = useSessionStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fecha sidebar ao mudar de rota (mobile)
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Impede scroll do body quando sidebar aberto no mobile
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

  const currentItem = [...NAV_GESTAO, ...NAV_MODULOS].find(
    (i) => pathname.startsWith(i.href)
  );

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-blue-300 flex-none"
            style={{ background: "#2c5282" }}
          >
            OA
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">SAG</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-none truncate max-w-[110px]">
              {sessao?.nome ?? "—"}
            </p>
          </div>
        </div>
        {/* Botão fechar só no mobile */}
        <button
          className="md:hidden text-gray-400 hover:text-white p-1 rounded transition"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fechar menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        <div>
          <p
            className="px-2 mb-1.5 text-[10px] font-bold tracking-widest uppercase"
            style={{ color: "#4a5568" }}
          >
            Gestão
          </p>
          {filteredItems(NAV_GESTAO).map((item) => (
            <NavButton
              key={item.href}
              item={item}
              active={pathname.startsWith(item.href)}
              onClick={() => router.push(item.href)}
            />
          ))}
        </div>

        <div>
          <p
            className="px-2 mb-1.5 text-[10px] font-bold tracking-widest uppercase"
            style={{ color: "#4a5568" }}
          >
            {isAdmin() ? "Operação" : "Módulos"}
          </p>
          {filteredItems(NAV_MODULOS).map((item) => (
            <NavButton
              key={item.href}
              item={item}
              active={pathname.startsWith(item.href)}
              onClick={() => router.push(item.href)}
            />
          ))}
        </div>
      </nav>

      {/* Role + Logout */}
      <div className="px-3 py-4 border-t border-gray-700 space-y-2">
        <div className="px-2 py-1.5 rounded-lg" style={{ background: "#2d3748" }}>
          <p className="text-xs text-gray-400">
            {isAdmin() ? "Administrador" : "Professor"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900/20 transition"
        >
          <LogOut size={15} />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* ── Overlay (mobile) ─────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar desktop (sempre visível, md+) ─────────────────────── */}
      <aside
        className="hidden md:flex w-52 flex-none flex-col overflow-y-auto"
        style={{ background: "#1a202c" }}
      >
        <SidebarContent />
      </aside>

      {/* ── Sidebar mobile (drawer deslizante) ───────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex flex-col overflow-hidden",
          "transition-transform duration-200 ease-in-out md:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ background: "#1a202c" }}
        aria-label="Menu de navegação"
      >
        <SidebarContent />
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Header */}
        <header className="flex-none h-14 flex items-center px-4 md:px-6 bg-white border-b border-gray-200 gap-3">
          {/* Hambúrguer — só mobile */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition flex-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500 min-w-0">
            <span className="font-medium text-gray-900 flex-none">SAG</span>
            {currentItem && (
              <>
                <ChevronRight size={14} className="text-gray-300 flex-none" />
                <span className="text-gray-600 font-medium truncate">
                  {currentItem.label}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 overflow-auto">
          {children}
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
        "w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition text-left",
        active
          ? "bg-blue-600 text-white font-semibold"
          : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
      )}
    >
      <span className="flex-none">{item.icon}</span>
      {item.label}
    </button>
  );
}