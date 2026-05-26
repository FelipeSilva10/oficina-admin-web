const admin = useMemo(() => isAdmin(), [isAdmin]);

const escolasFiltradas = useMemo(() => {
  const normalize = (v: string) =>
    v
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

  const t = normalize(busca.trim());

  if (!t) return escolas;

  return escolas.filter((e) => {
    return (
      normalize(e.nome).includes(t) ||
      normalize(e.tipoLabel).includes(t) ||
      normalize(e.status).includes(t)
    );
  });
}, [escolas, busca]);

const stats = useMemo(() => {
  let publicas = 0;
  let privadas = 0;

  for (const escola of escolas) {
    if (escola.tipo === "PUBLICA") publicas++;
    else privadas++;
  }

  return {
    total: escolas.length,
    publicas,
    privadas,
  };
}, [escolas]);