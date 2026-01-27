import { useEffect, useState } from "react";
import api from "../services/api";
import Toast from "../components/Toast";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "" });
  const [editandoId, setEditandoId] = useState(null);
  const [busca, setBusca] = useState("");
  const [feedback, setFeedback] = useState({ message: "", tone: "info" });
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({});

  useEffect(() => {
    carregarClientes();
  }, []);

  function carregarClientes() {
    setCarregando(true);
    api.get("/clientes", { params: { busca } })
      .then(res => setClientes(res.data))
      .catch(err => console.error(err))
      .finally(() => setCarregando(false));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const novosErros = {};
    if (!form.nome?.trim()) novosErros.nome = "Nome é obrigatório.";
    if (!form.email?.trim()) novosErros.email = "E-mail é obrigatório.";
    setErros(novosErros);
    if (Object.keys(novosErros).length) return;

    setSalvando(true);
    setFeedback({ message: "", tone: "info" });
    const req = editandoId
      ? api.put(`/clientes/${editandoId}`, form)
      : api.post("/clientes", form);

    req
      .then(() => {
        setEditandoId(null);
        setForm({ nome: "", email: "", telefone: "" });
        setFeedback({ message: "Cliente salvo com sucesso!", tone: "success" });
        carregarClientes();
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
        setFeedback({ message: "Erro ao salvar. Verifique os dados e tente novamente.", tone: "error" });
      })
      .finally(() => setSalvando(false));
  }

  function editar(cliente) {
    setEditandoId(cliente.id);
    setForm(cliente);
  }

  function excluir(id) {
    if (confirm("Deseja excluir?")) {
      api
        .delete(`/clientes/${id}`)
        .then(() => {
          setFeedback({ message: "Cliente excluído.", tone: "info" });
          carregarClientes();
        })
        .catch(() => setFeedback({ message: "Erro ao excluir cliente.", tone: "error" }));
    }
  }

  return (
    <div>
      <h1 className="page-title">Clientes</h1>
      <Toast
        message={feedback.message}
        tone={feedback.tone}
        onClose={() => setFeedback({ message: "", tone: "info" })}
      />

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
              {erros.nome && <small>{erros.nome}</small>}
            </label>

            <label className="field">
              E-mail
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              {erros.email && <small>{erros.email}</small>}
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
              <button className="btn btn-primary" type="submit" disabled={salvando}>
                {salvando ? "Salvando..." : editandoId ? "Atualizar" : "Salvar"}
              </button>
              {feedback.message && <span style={{ color: "var(--muted)" }}>{feedback.message}</span>}
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
                </tr>
              ))
            ) : clientes.map((c) => (
              <tr key={c.id} className="row-animate">
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
