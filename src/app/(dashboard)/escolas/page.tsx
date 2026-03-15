"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Trash2, Pencil } from "lucide-react";
import { useEscolas } from "@/hooks/useEscolas";
import { useSessionStore } from "@/store/session";
import { Button, Input, Select, SidePanel, Badge, Spinner } from "@/components/ui";
import type { Escola } from "@/lib/types";
import toast from "react-hot-toast";

type FormMode = "new" | "edit";

export default function EscolasPage() {
  const { escolas, loading, criar, atualizar, excluir } = useEscolas();
  const { isAdmin } = useSessionStore();

  const [busca, setBusca] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("new");
  const [editTarget, setEditTarget] = useState<Escola | null>(null);

  // Form state
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"PUBLICA" | "PRIVADA">("PUBLICA");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Filtro client-side (equivalente ao FilteredList do JavaFX)
  const escolasFiltradas = useMemo(() => {
    const t = busca.trim().toLowerCase();
    if (!t) return escolas;
    return escolas.filter(
      (e) =>
        e.nome.toLowerCase().includes(t) ||
        e.tipoLabel.toLowerCase().includes(t) ||
        e.status.toLowerCase().includes(t)
    );
  }, [escolas, busca]);

  function abrirNova() {
    setFormMode("new");
    setEditTarget(null);
    setNome("");
    setTipo("PUBLICA");
    setPanelOpen(true);
  }

  function abrirEditar(escola: Escola) {
    setFormMode("edit");
    setEditTarget(escola);
    setNome(escola.nome);
    setTipo(escola.tipo);
    setPanelOpen(true);
  }

  function fecharPanel() {
    setPanelOpen(false);
    setEditTarget(null);
  }

  async function handleSalvar() {
    if (!nome.trim()) {
      toast.error("Preencha o nome da escola.");
      return;
    }
    setSaving(true);
    try {
      if (formMode === "new") {
        await criar(nome.trim(), tipo);
        toast.success("Escola cadastrada com sucesso!");
      } else if (editTarget) {
        await atualizar(editTarget.id, nome.trim(), tipo);
        toast.success("Escola atualizada!");
      }
      fecharPanel();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleExcluir(escola: Escola) {
    if (!confirm(`Excluir "${escola.nome}"? Esta ação não pode ser desfeita.`)) return;
    setDeleting(escola.id);
    try {
      await excluir(escola.id);
      toast.success("Escola removida.");
      if (editTarget?.id === escola.id) fecharPanel();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir. Verifique vínculos.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="flex h-full">
      {/* ── Conteúdo principal ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Escolas</h1>
            {!isAdmin() && (
              <p className="text-xs text-gray-400 mt-0.5">
                Exibindo apenas as escolas das suas turmas
              </p>
            )}
          </div>

          {/* Busca */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, rede..."
              className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-56
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {isAdmin() && (
            <Button onClick={abrirNova} size="md">
              <Plus size={14} />
              Nova Escola
            </Button>
          )}
        </div>

        {/* Tabela */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <Spinner />
          ) : escolasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <span className="text-4xl">🏫</span>
              <p className="text-sm">Nenhuma escola encontrada.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Nome da Escola
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide w-28">
                    Rede
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide w-24">
                    Status
                  </th>
                  {isAdmin() && (
                    <th className="px-4 py-3 w-24" />
                  )}
                </tr>
              </thead>
              <tbody>
                {escolasFiltradas.map((escola) => (
                  <tr
                    key={escola.id}
                    onClick={() => isAdmin() ? abrirEditar(escola) : undefined}
                    className={`border-b border-gray-100 transition
                      ${isAdmin() ? "cursor-pointer hover:bg-blue-50" : ""}
                      ${editTarget?.id === escola.id ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {escola.nome}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={escola.tipo === "PRIVADA" ? "purple" : "blue"}>
                        {escola.tipoLabel}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={escola.status === "ativo" ? "green" : "gray"}>
                        {escola.status}
                      </Badge>
                    </td>
                    {isAdmin() && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => abrirEditar(escola)}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleExcluir(escola)}
                            disabled={deleting === escola.id}
                            className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition disabled:opacity-40"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Rodapé com contagem */}
        <div className="px-6 py-2 border-t border-gray-100 bg-white">
          <p className="text-xs text-gray-400">
            {escolasFiltradas.length} escola{escolasFiltradas.length !== 1 ? "s" : ""}
            {busca && ` encontrada${escolasFiltradas.length !== 1 ? "s" : ""} para "${busca}"`}
          </p>
        </div>
      </div>

      {/* ── Painel lateral de cadastro/edição ──────────────────────────── */}
      <SidePanel
        title={formMode === "new" ? "Nova Escola" : `Editar: ${editTarget?.nome ?? ""}`}
        open={panelOpen}
        onClose={fecharPanel}
      >
        <Input
          label="Nome da Escola"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: EMEF Vila Esperança"
          onKeyDown={(e) => e.key === "Enter" && handleSalvar()}
        />

        <Select
          label="Rede de Ensino"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as "PUBLICA" | "PRIVADA")}
          options={[
            { value: "PUBLICA", label: "Pública" },
            { value: "PRIVADA", label: "Privada" },
          ]}
        />

        {formMode === "edit" && editTarget && (
          <div className="pt-1">
            <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">
              Status atual
            </p>
            <Badge variant={editTarget.status === "ativo" ? "green" : "gray"}>
              {editTarget.status}
            </Badge>
          </div>
        )}

        <div className="pt-2">
          <Button
            onClick={handleSalvar}
            loading={saving}
            className="w-full justify-center"
          >
            {formMode === "new" ? "Cadastrar Escola" : "Salvar Alterações"}
          </Button>
        </div>

        {formMode === "edit" && editTarget && (
          <div className="pt-1 border-t border-gray-100">
            <Button
              variant="danger"
              onClick={() => handleExcluir(editTarget)}
              loading={deleting === editTarget.id}
              className="w-full justify-center"
            >
              <Trash2 size={13} />
              Excluir Escola
            </Button>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Só é possível excluir escolas sem turmas vinculadas.
            </p>
          </div>
        )}
      </SidePanel>
    </div>
  );
}
