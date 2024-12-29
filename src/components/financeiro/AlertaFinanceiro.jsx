import React, { useState, useEffect } from "react";
import { Bell, AlertTriangle, Settings, X } from "lucide-react";
import { usePreferencias } from "../../contexts/PreferenciasContext";
import _ from "lodash";

const AlertaFinanceiro = ({ transacoes, categorias }) => {
    const { formatarMoeda } = usePreferencias();
    const [limites, setLimites] = useState(() => {
        const savedLimites = localStorage.getItem("limites");
        return savedLimites ? JSON.parse(savedLimites) : {};
    });

    const [alertas, setAlertas] = useState([]);
    const [showConfig, setShowConfig] = useState(false);

    useEffect(() => {
        localStorage.setItem("limites", JSON.stringify(limites));
    }, [limites]);

    useEffect(() => {
        const novosAlertas = [];
        const mesAtual = new Date().getMonth();

        const transacoesMes = transacoes.filter((t) => {
            const transData = new Date(t.data);
            return transData.getMonth() === mesAtual && t.tipo === "debito";
        });

        const gastosPorCategoria = _.groupBy(transacoesMes, "categoria");

        Object.entries(gastosPorCategoria).forEach(([categoria, trans]) => {
            const totalGasto = trans.reduce((sum, t) => sum + t.valor, 0);
            const limite = limites[categoria];

            if (limite) {
                const percentualGasto = (totalGasto / limite) * 100;
                if (percentualGasto >= 80) {
                    novosAlertas.push({
                        id: Date.now() + categoria,
                        categoria,
                        percentual: percentualGasto,
                        valorGasto: totalGasto,
                        limite,
                    });
                }
            }
        });

        setAlertas(novosAlertas);
    }, [transacoes, limites]);

    const handleLimiteChange = (categoria, valor) => {
        setLimites((prev) => ({
            ...prev,
            [categoria]: parseFloat(valor) || 0,
        }));
    };

    const removerAlerta = (id) => {
        setAlertas((prev) => prev.filter((a) => a.id !== id));
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
                    <Bell className="w-6 h-6" />
                    Sistema de Alertas
                </h2>
                <button
                    onClick={() => setShowConfig(!showConfig)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <Settings className="w-6 h-6 dark:text-gray-300" />
                </button>
            </div>

            {showConfig && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
                    <h3 className="font-semibold mb-3 dark:text-white">
                        Configurar Limites por Categoria
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categorias.map((categoria) => (
                            <div
                                key={categoria}
                                className="flex items-center gap-2"
                            >
                                <label className="flex-1 dark:text-gray-200">
                                    {categoria}
                                </label>
                                <input
                                    type="number"
                                    value={limites[categoria] || ""}
                                    onChange={(e) =>
                                        handleLimiteChange(
                                            categoria,
                                            e.target.value
                                        )
                                    }
                                    className="w-32 p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                    placeholder="R$ Limite"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-3 mt-4">
                {alertas.map((alerta) => (
                    <div
                        key={alerta.id}
                        className={`p-4 rounded-lg border ${
                            alerta.percentual >= 90
                                ? "bg-red-50 dark:bg-red-900/20 border-red-500"
                                : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500"
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle
                                className={`h-5 w-5 flex-shrink-0 ${
                                    alerta.percentual >= 90
                                        ? "text-red-500"
                                        : "text-yellow-500"
                                }`}
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm dark:text-white">
                                    Alerta: {alerta.categoria}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                    {formatarMoeda(alerta.valorGasto)} /{" "}
                                    {formatarMoeda(alerta.limite)} (
                                    {alerta.percentual.toFixed(1)}%)
                                </p>
                            </div>
                            <button
                                onClick={() => removerAlerta(alerta.id)}
                                className="p-1 hover:bg-white/50 dark:hover:bg-black/20 rounded-full"
                                title="Remover alerta"
                            >
                                <X className="w-4 h-4 dark:text-gray-300" />
                            </button>
                        </div>
                    </div>
                ))}
                {alertas.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-3 text-sm">
                        Nenhum alerta no momento
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertaFinanceiro;
