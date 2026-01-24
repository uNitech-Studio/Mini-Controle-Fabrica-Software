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
      <h1>Projetos</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
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

        <input
          placeholder="Nome (obrigatório)"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />

        <textarea
          placeholder="Descrição (opcional)"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          rows={3}
        />

        <label>
          Data início (obrigatório)
          <input
            type="date"
            value={form.data_inicio}
            onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
            required
          />
        </label>

        <label>
          Data fim (opcional)
          <input
            type="date"
            value={form.data_fim}
            onChange={(e) => setForm({ ...form, data_fim: e.target.value })}
          />
        </label>

        <input
          placeholder="Valor contrato (maior que 0)"
          type="number"
          step="0.01"
          value={form.valor_contrato}
          onChange={(e) => setForm({ ...form, valor_contrato: e.target.value })}
          required
        />

        <input
          placeholder="Custo hora base (maior que 0)"
          type="number"
          step="0.01"
          value={form.custo_hora_base}
          onChange={(e) => setForm({ ...form, custo_hora_base: e.target.value })}
          required
        />

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">{editandoId ? "Atualizar" : "Salvar"}</button>
          {editandoId && (
            <button type="button" onClick={reset}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <hr />

      <ul>
        {projetos.map((p) => (
          <li key={p.id} style={{ marginBottom: 8 }}>
            <b>{p.nome}</b> — status: {p.status} — cliente_id: {p.cliente_id}
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button onClick={() => editar(p)}>Editar</button>
              <button onClick={() => excluir(p.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
