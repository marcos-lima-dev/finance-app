import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { Calendar, TrendingUp, DollarSign } from "lucide-react";
import AnaliseCategoria from "./AnaliseCategoria";
import ExportacaoCSV from "./ExportacaoCSV";

const DashboardGraficos = ({ transacoes }) => {
    // Estados para filtros
    const [periodoSelecionado, setPeriodoSelecionado] = useState("mes");
    const [transacoesFiltradas, setTransacoesFiltradas] = useState([]);

    // Efeito para filtrar transações
    useEffect(() => {
        const filtrarTransacoes = () => {
            const hoje = new Date();
            return transacoes.filter((transacao) => {
                const dataTransacao = new Date(transacao.data);
                switch (periodoSelecionado) {
                    case "mes":
                        return (
                            dataTransacao.getMonth() === hoje.getMonth() &&
                            dataTransacao.getFullYear() === hoje.getFullYear()
                        );
                    case "trimestre":
                        const tresMesesAtras = new Date(
                            hoje.setMonth(hoje.getMonth() - 3)
                        );
                        return dataTransacao >= tresMesesAtras;
                    case "ano":
                        return (
                            dataTransacao.getFullYear() === hoje.getFullYear()
                        );
                    default:
                        return true;
                }
            });
        };

        setTransacoesFiltradas(filtrarTransacoes());
    }, [transacoes, periodoSelecionado]);

    // Função para agrupar dados por mês com comparativo
    const processarDadosMensais = () => {
        const dadosPorMes = transacoesFiltradas.reduce((acc, transacao) => {
            const data = new Date(transacao.data);
            const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;

            if (!acc[mesAno]) {
                acc[mesAno] = {
                    mes: mesAno,
                    creditos: 0,
                    debitos: 0,
                    saldo: 0,
                    variacaoPercentual: 0,
                };
            }

            if (transacao.tipo === "credito") {
                acc[mesAno].creditos += transacao.valor;
                acc[mesAno].saldo += transacao.valor;
            } else {
                acc[mesAno].debitos += transacao.valor;
                acc[mesAno].saldo -= transacao.valor;
            }

            return acc;
        }, {});

        // Calcula variação percentual
        const meses = Object.keys(dadosPorMes).sort();
        meses.forEach((mes, index) => {
            if (index > 0) {
                const mesAtual = dadosPorMes[mes].saldo;
                const mesAnterior = dadosPorMes[meses[index - 1]].saldo;
                dadosPorMes[mes].variacaoPercentual =
                    ((mesAtual - mesAnterior) / Math.abs(mesAnterior)) * 100;
            }
        });

        return Object.values(dadosPorMes).sort((a, b) => {
            const [mesA, anoA] = a.mes.split("/");
            const [mesB, anoB] = b.mes.split("/");
            return new Date(anoA, mesA - 1) - new Date(anoB, mesB - 1);
        });
    };

    // Processa evolução diária com média móvel
    const processarEvolucaoDiaria = () => {
        const evolucao = transacoesFiltradas
            .sort((a, b) => new Date(a.data) - new Date(b.data))
            .reduce((acc, transacao) => {
                const data = new Date(transacao.data);
                const dia = data.toLocaleDateString("pt-BR");

                if (!acc[dia]) {
                    const ultimoSaldo = acc[Object.keys(acc).pop()]?.saldo || 0;
                    acc[dia] = {
                        dia,
                        saldo: ultimoSaldo,
                        mediaTresDias: 0,
                    };
                }

                acc[dia].saldo +=
                    transacao.tipo === "credito"
                        ? transacao.valor
                        : -transacao.valor;

                return acc;
            }, {});

        // Calcula média móvel de 3 dias
        const dias = Object.keys(evolucao);
        dias.forEach((dia, index) => {
            if (index >= 2) {
                const saldosTresDias = [
                    evolucao[dias[index]].saldo,
                    evolucao[dias[index - 1]].saldo,
                    evolucao[dias[index - 2]].saldo,
                ];
                evolucao[dia].mediaTresDias =
                    saldosTresDias.reduce((a, b) => a + b) / 3;
            }
        });

        return Object.values(evolucao);
    };

    const dadosGrafico = processarDadosMensais();
    const dadosEvolucao = processarEvolucaoDiaria();

    const formatarValor = (valor) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            maximumFractionDigits: 0,
        }).format(valor);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border rounded shadow-lg">
                    <p className="font-semibold">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {formatarValor(entry.value)}
                            {entry.name === "Saldo" &&
                                payload[0].payload.variacaoPercentual && (
                                    <span
                                        className={`ml-2 ${
                                            payload[0].payload
                                                .variacaoPercentual > 0
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }`}
                                    >
                                        (
                                        {payload[0].payload.variacaoPercentual.toFixed(
                                            1
                                        )}
                                        %)
                                    </span>
                                )}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Filtros e Cards de Resumo */}
            <div className="bg-white p-6 rounded-lg shadow max-h-screen overflow-y-auto">
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        Dashboard Financeiro
                    </h2>

                    <select
                        value={periodoSelecionado}
                        onChange={(e) => setPeriodoSelecionado(e.target.value)}
                        className="p-2 border rounded-md"
                    >
                        <option value="mes">Este Mês</option>
                        <option value="trimestre">Último Trimestre</option>
                        <option value="ano">Este Ano</option>
                    </select>
                </div>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <DollarSign className="text-blue-500" />
                            <h3 className="font-semibold">Total Créditos</h3>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 mt-2">
                            {formatarValor(
                                transacoesFiltradas.reduce(
                                    (total, t) =>
                                        total +
                                        (t.tipo === "credito" ? t.valor : 0),
                                    0
                                )
                            )}
                        </p>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <DollarSign className="text-red-500" />
                            <h3 className="font-semibold">Total Débitos</h3>
                        </div>
                        <p className="text-2xl font-bold text-red-600 mt-2">
                            {formatarValor(
                                transacoesFiltradas.reduce(
                                    (total, t) =>
                                        total +
                                        (t.tipo === "debito" ? t.valor : 0),
                                    0
                                )
                            )}
                        </p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="text-green-500" />
                            <h3 className="font-semibold">Saldo Atual</h3>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mt-2">
                            {formatarValor(
                                transacoesFiltradas.reduce(
                                    (total, t) =>
                                        total +
                                        (t.tipo === "credito"
                                            ? t.valor
                                            : -t.valor),
                                    0
                                )
                            )}
                        </p>
                    </div>
                </div>

                {/* Gráficos */}
                <div className="space-y-6">
                    {/* Gráfico de Barras - Créditos vs Débitos */}
                    <div>
                        <h3 className="text-sm font-medium mb-2">
                            Créditos vs Débitos por Mês
                        </h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dadosGrafico}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="mes"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={formatarValor}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar
                                        dataKey="creditos"
                                        name="Créditos"
                                        fill="#22c55e"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="debitos"
                                        name="Débitos"
                                        fill="#ef4444"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Gráfico de Linha - Evolução do Saldo */}
                    <div>
                        <h3 className="text-sm font-medium mb-2">
                            Evolução do Saldo
                        </h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dadosEvolucao}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="dia"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={formatarValor}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <ReferenceLine
                                        y={0}
                                        stroke="#666"
                                        strokeDasharray="3 3"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="saldo"
                                        name="Saldo"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="mediaTresDias"
                                        name="Média (3 dias)"
                                        stroke="#8884d8"
                                        strokeDasharray="5 5"
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Componentes de Análise e Exportação */}
            <div className="space-y-6">
                <AnaliseCategoria transacoes={transacoesFiltradas} />
                <ExportacaoCSV transacoes={transacoesFiltradas} />
            </div>
        </div>
    );
};

export default DashboardGraficos;
