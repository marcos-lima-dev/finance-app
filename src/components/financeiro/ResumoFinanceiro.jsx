import React, { useMemo } from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { usePreferencias } from "../../contexts/PreferenciasContext";

const ResumoFinanceiro = ({ transacoes }) => {
    const { formatarMoeda } = usePreferencias();

    const resumo = useMemo(() => {
        return transacoes.reduce(
            (acc, transacao) => {
                const valor = transacao.valor;
                if (transacao.tipo === "credito") {
                    acc.totalCreditos += valor;
                    acc.saldo += valor;
                } else {
                    acc.totalDebitos += valor;
                    acc.saldo -= valor;
                }
                return acc;
            },
            { totalCreditos: 0, totalDebitos: 0, saldo: 0 }
        );
    }, [transacoes]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total de Créditos */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Total de Créditos
                        </p>
                        <h3 className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatarMoeda(resumo.totalCreditos)}
                        </h3>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                </div>
            </div>

            {/* Total de Débitos */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Total de Débitos
                        </p>
                        <h3 className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
                            {formatarMoeda(resumo.totalDebitos)}
                        </h3>
                    </div>
                    <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                        <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                </div>
            </div>

            {/* Saldo */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Saldo
                        </p>
                        <h3
                            className={`text-xl sm:text-2xl font-bold ${
                                resumo.saldo >= 0
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-red-600 dark:text-red-400"
                            }`}
                        >
                            {formatarMoeda(resumo.saldo)}
                        </h3>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                        <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumoFinanceiro;
