import React, { useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { usePreferencias } from "../../contexts/PreferenciasContext";
import _ from "lodash";

const DashboardGraficos = ({ transacoes }) => {
    const { formatarMoeda } = usePreferencias();

    const dadosProcessados = useMemo(() => {
        // Ordena as transações por data
        const transacoesOrdenadas = _.sortBy(transacoes, "data");

        // Calcula o saldo acumulado
        let saldoAcumulado = 0;
        return transacoesOrdenadas.map((transacao) => {
            // Atualiza o saldo
            saldoAcumulado +=
                transacao.tipo === "credito"
                    ? transacao.valor
                    : -transacao.valor;

            return {
                data: new Date(transacao.data).toLocaleDateString(),
                saldo: saldoAcumulado,
            };
        });
    }, [transacoes]);

    const dadosMensais = useMemo(() => {
        // Agrupa por mês e calcula totais
        const porMes = _.groupBy(transacoes, (t) => {
            const data = new Date(t.data);
            return `${data.getFullYear()}-${String(
                data.getMonth() + 1
            ).padStart(2, "0")}`;
        });

        // Processa os dados de cada mês
        const dadosPorMes = Object.entries(porMes).map(([mes, trans]) => {
            const creditos = trans
                .filter((t) => t.tipo === "credito")
                .reduce((sum, t) => sum + t.valor, 0);
            const debitos = trans
                .filter((t) => t.tipo === "debito")
                .reduce((sum, t) => sum + t.valor, 0);

            // Formata o mês para exibição
            const [ano, mesNum] = mes.split("-");
            const mesFormatado = new Date(ano, mesNum - 1)
                .toLocaleDateString("pt-BR", {
                    month: "short",
                    year: "numeric",
                })
                .replace(".", "");

            return {
                mes: mesFormatado,
                creditos,
                debitos,
            };
        });

        // Ordena por mês
        return _.sortBy(dadosPorMes, (mes) => mes.mes);
    }, [transacoes]);

    if (!transacoes.length) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center text-gray-500 dark:text-gray-400">
                Adicione transações para visualizar os gráficos
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">
                Evolução Financeira
            </h2>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dadosProcessados}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="data"
                            stroke="#6B7280"
                            tick={{ fill: "#6B7280" }}
                        />
                        <YAxis
                            tickFormatter={formatarMoeda}
                            stroke="#6B7280"
                            tick={{ fill: "#6B7280" }}
                        />
                        <Tooltip
                            formatter={formatarMoeda}
                            contentStyle={{
                                backgroundColor: "#1F2937",
                                border: "none",
                                borderRadius: "0.375rem",
                                color: "#E5E7EB",
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="saldo"
                            stroke="#2563eb"
                            name="Saldo"
                            strokeWidth={2}
                            dot={{ fill: "#2563eb" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosMensais}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="mes"
                            stroke="#6B7280"
                            tick={{ fill: "#6B7280" }}
                        />
                        <YAxis
                            tickFormatter={formatarMoeda}
                            stroke="#6B7280"
                            tick={{ fill: "#6B7280" }}
                        />
                        <Tooltip
                            formatter={formatarMoeda}
                            contentStyle={{
                                backgroundColor: "#1F2937",
                                border: "none",
                                borderRadius: "0.375rem",
                                color: "#E5E7EB",
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="creditos"
                            fill="#22c55e"
                            name="Créditos"
                        />
                        <Bar dataKey="debitos" fill="#ef4444" name="Débitos" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DashboardGraficos;
