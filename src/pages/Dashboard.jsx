import { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#e2725b", "#2f6d7a", "#f2a05b", "#1f2937"];

export default function Dashboard() {
  const [projetos, setProjetos] = useState([]);
  const [projetoId, setProjetoId] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    api.get("/projetos").then((r) => setProjetos(r.data));
  }, []);

  function buscar() {
    if (!projetoId || !inicio || !fim) {
      alert("Preencha todos os filtros");
      return;
    }

    setCarregando(true);
    api
      .get(`/projetos/${projetoId}/dashboard`, {
        params: { inicio, fim },
      })
      .then((r) => setDados(r.data))
      .finally(() => setCarregando(false));
  }

  function exportCSV() {
    if (!dados) return;

    let csv = "tipo,horas,custo\n";

    Object.entries(dados.porTipo).forEach(([tipo, v]) => {
      csv += `${tipo},${v.horas},${v.custo}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "resumo.csv";
    a.click();
  }

  const chartData = dados
    ? Object.entries(dados.porTipo).map(([tipo, v]) => ({
        name: tipo,
        value: v.horas,
        custo: v.custo,
      }))
    : [];

  return (
    <div>
      <h1 className="page-title">Dashboard de Lucratividade</h1>

      <section className="panel">
        <div className="grid">
          <h3>Filtros</h3>
          <div className="grid grid-3">
            <label className="field">
              Projeto
              <select value={projetoId} onChange={(e) => setProjetoId(e.target.value)}>
                <option value="">Projeto</option>
                {projetos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              Data início
              <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
            </label>

            <label className="field">
              Data fim
              <input type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
            </label>
          </div>

          <div className="actions">
            <button className="btn btn-primary" onClick={buscar} disabled={carregando}>
              {carregando ? "Calculando..." : "Calcular"}
            </button>
          </div>
        </div>
      </section>

      {carregando && (
        <>
          <section className="panel">
            <div className="metrics">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div className="metric-card" key={i}>
                  <div className="skeleton skeleton-line" />
                  <div style={{ height: 8 }} />
                  <div className="skeleton skeleton-line" />
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="grid grid-2">
              <div className="chart-box skeleton" />
              <div className="chart-box skeleton" />
            </div>
          </section>
        </>
      )}

      {dados && !carregando && (
        <>
          <section className="panel">
            <div className="metrics">
              <MetricCard title="Horas totais" value={dados.horas} />
              <MetricCard title="Custo total" value={`R$ ${dados.custo}`} />
              <MetricCard title="Receita" value={`R$ ${dados.receita}`} />
              <MetricCard title="Margem (R$)" value={`R$ ${dados.margem}`} />
              <MetricCard title="Margem (%)" value={`${dados.margemPercent}%`} />
              <MetricCard title="Break-even (h)" value={dados.breakEven} />
            </div>
          </section>

          <section className="panel">
            <div className="grid">
              <h3>Horas por tipo</h3>
              <div className="grid grid-2">
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} dataKey="value" outerRadius={110} innerRadius={50}>
                        {chartData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="actions">
                <button className="btn btn-ghost" onClick={exportCSV}>
                  Exportar CSV
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="metric-card">
      <strong>{title}</strong>
      <div>{value}</div>
    </div>
  );
}
