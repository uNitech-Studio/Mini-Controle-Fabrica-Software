import { useEffect, useState } from "react";
import api from "../services/api";

const STATUS = ["planejado", "em_andamento", "pausado", "finalizado"];

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    cliente_id: "",
    nome: "",
    descricao: "",
    data_inicio: "",
    data_fim: "",
    valor_contrato: "",
    custo_hora_base: "",
    status: "planejado",
  });

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    api.get("/projetos").then((r) => setProjetos(r.data));
    api.get("/clientes").then((r) => setClientes(r.data));
  }

  function reset() {
    setEditandoId(null);
    setForm({
      cliente_id: "",
      nome: "",
      descricao: "",
      data_inicio: "",
      data_fim: "",
      valor_contrato: "",
      custo_hora_base: "",
      status: "planejado",
    });
  }

  function validar() {
    const valor = Number(form.valor_contrato);
    const custo = Number(form.custo_hora_base);
    if (valor <= 0) return "valor_contrato precisa ser maior que 0";
    if (custo <= 0) return "custo_hora_base precisa ser maior que 0";
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const erro = validar();
    if (erro) return alert(erro);

    const payload = {
      ...form,
      cliente_id: Number(form.cliente_id),
      valor_contrato: Number(form.valor_contrato),
      custo_hora_base: Number(form.custo_hora_base),
      data_fim: form.data_fim || null,
      descricao: form.descricao || null,
    };

    const req = editandoId
      ? api.put(`/projetos/${editandoId}`, payload)
      : api.post("/projetos", payload);

    req.then(() => {
      reset();
      carregar();
    });
  }

  function editar(p) {
    setEditandoId(p.id);
    setForm({
      cliente_id: p.cliente_id ?? "",
      nome: p.nome ?? "",
      descricao: p.descricao ?? "",
      data_inicio: p.data_inicio ?? "",
      data_fim: p.data_fim ?? "",
      valor_contrato: p.valor_contrato ?? "",
      custo_hora_base: p.custo_hora_base ?? "",
      status: p.status ?? "planejado",
    });
  }

  function excluir(id) {
    if (confirm("Excluir projeto?")) {
      api.delete(`/projetos/${id}`).then(carregar);
    }
  }

  return (
    <div>
      <h1 className="page-title">Projetos</h1>

      <section className="panel">
        <form onSubmit={handleSubmit} className="grid">
          <label className="field">
            Cliente
            <select
              value={form.cliente_id}
              onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
              required
            >
              <option value="">Selecione o cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            Nome do projeto
            <input
              placeholder="Nome (obrigatório)"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
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

          <div className="grid grid-2">
            <label className="field">
              Data início
              <input
                type="date"
                value={form.data_inicio}
                onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
                required
              />
            </label>

            <label className="field">
              Data fim
              <input
                type="date"
                value={form.data_fim}
                onChange={(e) => setForm({ ...form, data_fim: e.target.value })}
              />
            </label>
          </div>

          <div className="grid grid-2">
            <label className="field">
              Valor do contrato
              <input
                placeholder="Maior que 0"
                type="number"
                step="0.01"
                value={form.valor_contrato}
                onChange={(e) => setForm({ ...form, valor_contrato: e.target.value })}
                required
              />
            </label>

            <label className="field">
              Custo hora base
              <input
                placeholder="Maior que 0"
                type="number"
                step="0.01"
                value={form.custo_hora_base}
                onChange={(e) => setForm({ ...form, custo_hora_base: e.target.value })}
                required
              />
            </label>
          </div>

          <label className="field">
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <div className="actions">
            <button className="btn btn-primary" type="submit">
              {editandoId ? "Atualizar" : "Salvar"}
            </button>
            {editandoId && (
              <button className="btn btn-ghost" type="button" onClick={reset}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Cliente</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {projetos.map((p) => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>{p.client?.nome || p.cliente_id}</td>
                <td>
                  <span className="badge">{p.status}</span>
                </td>
                <td>
                  <div className="actions">
                    <button className="btn" onClick={() => editar(p)}>
                      Editar
                    </button>
                    <button className="btn btn-ghost" onClick={() => excluir(p.id)}>
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
