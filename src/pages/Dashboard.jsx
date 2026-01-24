import { useEffect, useState } from "react";
import api from "../services/api";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function Dashboard() {
  const [projetos, setProjetos] = useState([]);
  const [projetoId, setProjetoId] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [dados, setDados] = useState(null);

  useEffect(() => {
    api.get("/projetos").then(r => setProjetos(r.data));
  }, []);

  function buscar() {
    if (!projetoId || !inicio || !fim) {
      alert("Preencha todos os filtros");
      return;
    }

    api
      .get(`/projetos/${projetoId}/dashboard`, {
        params: { inicio, fim }
      })
      .then(r => setDados(r.data));
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
        value: v.horas
      }))
    : [];

  return (
    <div>
      <h1>Dashboard de Lucratividade</h1>

      {/* Filtros */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <select value={projetoId} onChange={e => setProjetoId(e.target.value)}>
          <option value="">Projeto</option>
          {projetos.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>

        <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} />
        <input type="date" value={fim} onChange={e => setFim(e.target.value)} />

        <button onClick={buscar}>Calcular</button>
      </div>

      {/* Métricas */}
      {dados && (
        <>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <Card title="Horas totais" value={dados.horas} />
            <Card title="Custo total" value={`R$ ${dados.custo}`} />
            <Card title="Receita" value={`R$ ${dados.receita}`} />
            <Card title="Margem (R$)" value={`R$ ${dados.margem}`} />
            <Card title="Margem (%)" value={`${dados.margemPercent}%`} />
            <Card title="Break-even (h)" value={dados.breakEven} />
          </div>

          {/* Gráfico */}
          <h3>Horas por tipo</h3>
          <PieChart width={350} height={300}>
            <Pie data={chartData} dataKey="value" outerRadius={100}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          <button onClick={exportCSV}>Exportar CSV</button>
        </>
      )}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{
      padding: 15,
      background: "#eee",
      borderRadius: 8,
      minWidth: 150
    }}>
      <strong>{title}</strong>
      <div>{value}</div>
    </div>
  );
}
