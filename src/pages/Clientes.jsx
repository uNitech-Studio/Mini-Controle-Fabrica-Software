import { useEffect, useState } from "react";
import api from "../services/api";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "" });
  const [editandoId, setEditandoId] = useState(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarClientes();
  }, []);

  function carregarClientes() {
    api.get("/clientes", { params: { busca } })
      .then(res => setClientes(res.data))
      .catch(err => console.error(err));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editandoId) {
      api.put(`/clientes/${editandoId}`, form).then(() => {
        setEditandoId(null);
        setForm({ nome: "", email: "", telefone: "" });
        carregarClientes();
      });
    } else {
      api.post("/clientes", form).then(() => {
        setForm({ nome: "", email: "", telefone: "" });
        carregarClientes();
      });
    }
  }

  function editar(cliente) {
    setEditandoId(cliente.id);
    setForm(cliente);
  }

  function excluir(id) {
    if (confirm("Deseja excluir?")) {
      api.delete(`/clientes/${id}`).then(carregarClientes);
    }
  }

  return (
    <div>
      <h1 className="page-title">Clientes</h1>

      <section className="panel">
        <div className="grid">
          <label className="field">
            Buscar por nome ou e-mail
            <input
              placeholder="Ex: maria@empresa.com"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyUp={carregarClientes}
            />
          </label>

          <form onSubmit={handleSubmit} className="grid grid-3">
            <label className="field">
              Nome
              <input
                placeholder="Nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
            </label>

            <label className="field">
              E-mail
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>

            <label className="field">
              Telefone
              <input
                placeholder="Telefone"
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              />
            </label>

            <div className="actions">
              <button className="btn btn-primary" type="submit">
                {editandoId ? "Atualizar" : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.email}</td>
                <td>{c.telefone || "-"}</td>
                <td>
                  <div className="actions">
                    <button className="btn" onClick={() => editar(c)}>
                      Editar
                    </button>
                    <button className="btn btn-ghost" onClick={() => excluir(c.id)}>
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
