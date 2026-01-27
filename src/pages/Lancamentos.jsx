import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Toast from "../components/Toast";

const TIPOS = ["corretiva", "evolutiva", "implantacao", "legislativa"];

export default function Lancamentos() {
  const [projetos, setProjetos] = useState([]);
  const [lancamentos, setLancamentos] = useState([]);

  const [filtroProjetoId, setFiltroProjetoId] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [feedback, setFeedback] = useState({ message: "", tone: "info" });
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({});

  const [form, setForm] = useState({
    projeto_id: "",
    colaborador: "",
    data: "",
    horas: "",
    tipo: "corretiva",
    descricao: "",
  });

  useEffect(() => {
    api.get("/projetos").then((r) => setProjetos(r.data));
  }, []);

  const filtrosOk = useMemo(() => {
    return Boolean(filtroProjetoId && inicio && fim);
  }, [filtroProjetoId, inicio, fim]);

  function carregarLancamentos() {
    if (!filtrosOk) {
      setLancamentos([]);
      return;
    }
    setCarregando(true);
    api
      .get("/lancamentos", {
        params: { projeto_id: filtroProjetoId, inicio, fim },
      })
      .then((r) => setLancamentos(r.data))
      .catch((e) => console.error(e))
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregarLancamentos();
  }, [filtroProjetoId, inicio, fim]);

  function resetForm() {
    setEditandoId(null);
    setErros({});
    setForm({
      projeto_id: filtroProjetoId || "",
      colaborador: "",
      data: "",
      horas: "",
      tipo: "corretiva",
      descricao: "",
    });
  }

  function validarForm() {
    const novosErros = {};
    if (!form.projeto_id) novosErros.projeto_id = "Selecione o projeto.";
    if (!form.colaborador?.trim()) novosErros.colaborador = "Colaborador é obrigatório.";
    if (!form.data) novosErros.data = "Data é obrigatória.";
    const h = Number(form.horas);
    if (!Number.isFinite(h) || h <= 0) novosErros.horas = "Horas precisa ser maior que 0.";
    if (!TIPOS.includes(form.tipo)) novosErros.tipo = "Tipo inválido.";
    return novosErros;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const novosErros = validarForm();
    setErros(novosErros);
    if (Object.keys(novosErros).length) return;

    setSalvando(true);
    const payload = {
      ...form,
      projeto_id: Number(form.projeto_id),
      horas: Number(form.horas),
      descricao: form.descricao?.trim() ? form.descricao : null,
    };

    const req = editandoId
      ? api.put(`/lancamentos/${editandoId}`, payload)
      : api.post("/lancamentos", payload);

    req
      .then(() => {
        resetForm();
        setFeedback({ message: "Lançamento salvo com sucesso!", tone: "success" });
        carregarLancamentos();
      })
      .catch((err) => {
        const apiErrors = err?.response?.data?.errors;
        if (apiErrors) {
          const mapped = {};
          Object.keys(apiErrors).forEach((k) => {
            mapped[k] = apiErrors[k][0];
          });
          setErros(mapped);
        }
        setFeedback({ message: "Erro ao salvar lançamento.", tone: "error" });
      })
      .finally(() => setSalvando(false));
  }

  function editar(l) {
    setEditandoId(l.id);
    setForm({
      projeto_id: l.projeto_id ?? "",
      colaborador: l.colaborador ?? "",
      data: l.data ?? "",
      horas: l.horas ?? "",
      tipo: l.tipo ?? "corretiva",
      descricao: l.descricao ?? "",
    });
  }

  function excluir(id) {
    if (confirm("Excluir lançamento?")) {
      api
        .delete(`/lancamentos/${id}`)
        .then(() => {
          setFeedback({ message: "Lançamento excluído.", tone: "info" });
          carregarLancamentos();
        })
        .catch(() => setFeedback({ message: "Erro ao excluir lançamento.", tone: "error" }));
    }
  }

  return (
    <div>
      <h1 className="page-title">Lançamentos (Timesheet)</h1>
      <Toast
        message={feedback.message}
        tone={feedback.tone}
        onClose={() => setFeedback({ message: "", tone: "info" })}
      />

      <section className="panel">
        <div className="grid">
          <h3>Filtros</h3>

          <label className="field">
            Projeto
            <select
              value={filtroProjetoId}
              onChange={(e) => {
                setFiltroProjetoId(e.target.value);
                setForm((f) => ({ ...f, projeto_id: e.target.value }));
              }}
              required
            >
              <option value="">Selecione o projeto</option>
              {projetos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-2">
            <label className="field">
              Data início
              <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} required />
            </label>

            <label className="field">
              Data fim
              <input type="date" value={fim} onChange={(e) => setFim(e.target.value)} required />
            </label>
          </div>

          <div className="actions">
            <button className="btn btn-primary" type="button" onClick={carregarLancamentos} disabled={!filtrosOk}>
              Aplicar filtros
            </button>
          </div>

          {!filtrosOk && (
            <small style={{ color: "var(--muted)" }}>
              Selecione <b>projeto</b> e informe <b>data início</b> e <b>data fim</b> para listar.
            </small>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="grid">
          <h3>{editandoId ? "Editar lançamento" : "Novo lançamento"}</h3>

          <form onSubmit={handleSubmit} className="grid">
            <label className="field">
              Projeto
              <select
                value={form.projeto_id}
                onChange={(e) => setForm({ ...form, projeto_id: e.target.value })}
                required
              >
                <option value="">Projeto</option>
                {projetos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
              {erros.projeto_id && <small>{erros.projeto_id}</small>}
            </label>

            <label className="field">
              Colaborador
              <input
                placeholder="Colaborador (obrigatório)"
                value={form.colaborador}
                onChange={(e) => setForm({ ...form, colaborador: e.target.value })}
                required
              />
              {erros.colaborador && <small>{erros.colaborador}</small>}
            </label>

            <label className="field">
              Data
              <input
                type="date"
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
                required
              />
              {erros.data && <small>{erros.data}</small>}
            </label>

            <label className="field">
              Horas
              <input
                placeholder="Horas (ex: 1.5)"
                type="number"
                step="0.01"
                value={form.horas}
                onChange={(e) => setForm({ ...form, horas: e.target.value })}
                required
              />
              {erros.horas && <small>{erros.horas}</small>}
            </label>

            <label className="field">
              Tipo
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} required>
                {TIPOS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {erros.tipo && <small>{erros.tipo}</small>}
            </label>

            <label className="field">
              Descrição
              <textarea
                placeholder="Descrição (opcional)"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                rows={3}
              />
            </label>

            <div className="actions">
              <button className="btn btn-primary" type="submit" disabled={salvando}>
                {salvando ? "Salvando..." : editandoId ? "Atualizar" : "Salvar"}
              </button>
              {editandoId && (
                <button className="btn btn-ghost" type="button" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="panel">
        <h3>Listagem</h3>

        {!filtrosOk ? (
          <p>Preencha os filtros para ver os lançamentos.</p>
        ) : (
          <>
            {(!carregando && lancamentos.length === 0) && <p>Nenhum lançamento no período.</p>}
            <table className="table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Colaborador</th>
                  <th>Tipo</th>
                  <th>Horas</th>
                  <th>Descrição</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  [1, 2, 3].map((i) => (
                    <tr className="skeleton-row" key={i}>
                      <td>
                        <div className="skeleton skeleton-line" />
                      </td>
                      <td>
                        <div className="skeleton skeleton-line" />
                      </td>
                      <td>
                        <div className="skeleton skeleton-line" />
                      </td>
                      <td>
                        <div className="skeleton skeleton-line" />
                      </td>
                      <td>
                        <div className="skeleton skeleton-line" />
                      </td>
                      <td>
                        <div className="skeleton skeleton-line" />
                      </td>
                    </tr>
                  ))
                ) : (
                  lancamentos.map((l) => (
                    <tr key={l.id} className="row-animate">
                      <td>{l.data}</td>
                      <td>{l.colaborador}</td>
                      <td>{l.tipo}</td>
                      <td>{l.horas}</td>
                      <td>{l.descricao || "-"}</td>
                      <td>
                        <div className="actions">
                          <button className="btn" onClick={() => editar(l)}>
                            Editar
                          </button>
                          <button className="btn btn-ghost" onClick={() => excluir(l.id)}>
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
      </section>
    </div>
  );
}
