import React, { useState } from "react";
import { Download, Filter } from "lucide-react";
import Papa from "papaparse";

const ExportacaoCSV = ({ transacoes }) => {
    const [filtros, setFiltros] = useState({
        dataInicial: "",
        dataFinal: "",
        tipo: "todos",
    });

    const [showFiltros, setShowFiltros] = useState(false);

    const filtrarTransacoes = () => {
        return transacoes.filter((transacao) => {
            const data = new Date(transacao.data);
            const dataInicial = filtros.dataInicial
                ? new Date(filtros.dataInicial)
                : null;
            const dataFinal = filtros.dataFinal
                ? new Date(filtros.dataFinal)
                : null;

            const filtroData =
                (!dataInicial || data >= dataInicial) &&
                (!dataFinal || data <= dataFinal);
            const filtroTipo =
                filtros.tipo === "todos" || transacao.tipo === filtros.tipo;

            return filtroData && filtroTipo;
        });
    };

    const formatarDadosParaExportacao = (dados) => {
        return dados.map((transacao) => ({
            Data: new Date(transacao.data).toLocaleDateString("pt-BR"),
            Tipo:
                transacao.tipo.charAt(0).toUpperCase() +
                transacao.tipo.slice(1),
            Categoria: transacao.categoria,
            Valor: transacao.valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            }),
            Descrição: transacao.descricao || "",
        }));
    };

    const exportarCSV = () => {
        const transacoesFiltradas = filtrarTransacoes();
        const dadosFormatados =
            formatarDadosParaExportacao(transacoesFiltradas);

        const csv = Papa.unparse(dadosFormatados, {
            delimiter: ",",
            header: true,
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `transacoes_${new Date().toLocaleDateString("pt-BR")}.csv`
        );
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Exportar Dados</h3>
                <button
                    onClick={() => setShowFiltros(!showFiltros)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                >
                    <Filter size={20} />
                </button>
            </div>

            {showFiltros && (
                <div className="mb-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Data Inicial
                            </label>
                            <input
                                type="date"
                                value={filtros.dataInicial}
                                onChange={(e) =>
                                    setFiltros({
                                        ...filtros,
                                        dataInicial: e.target.value,
                                    })
                                }
                                className="mt-1 p-2 w-full border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Data Final
                            </label>
                            <input
                                type="date"
                                value={filtros.dataFinal}
                                onChange={(e) =>
                                    setFiltros({
                                        ...filtros,
                                        dataFinal: e.target.value,
                                    })
                                }
                                className="mt-1 p-2 w-full border rounded-md"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tipo
                        </label>
                        <select
                            value={filtros.tipo}
                            onChange={(e) =>
                                setFiltros({ ...filtros, tipo: e.target.value })
                            }
                            className="mt-1 p-2 w-full border rounded-md"
                        >
                            <option value="todos">Todos</option>
                            <option value="credito">Créditos</option>
                            <option value="debito">Débitos</option>
                        </select>
                    </div>
                </div>
            )}

            <button
                onClick={exportarCSV}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2"
            >
                <Download size={20} />
                Exportar CSV
            </button>

            <div className="mt-4 text-sm text-gray-500">
                {`${
                    filtrarTransacoes().length
                } transações selecionadas para exportação`}
            </div>
        </div>
    );
};

export default ExportacaoCSV;
