import React, { useState } from "react";
import { CATEGORIAS, CATEGORIA_ICONS } from "../../utils/constants/categorias";
import {
    ArrowUpCircle,
    ArrowDownCircle,
    Calendar,
    DollarSign,
    Tag,
    Loader,
    Save,
} from "lucide-react";

const FormularioTransacao = ({ onSalvar, salvando }) => {
    const [transacao, setTransacao] = useState({
        tipo: "credito",
        categoria: CATEGORIAS.credito[0],
        valor: "",
        data: new Date().toISOString().split("T")[0],
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!transacao.categoria || !transacao.valor) return;

        await onSalvar({
            ...transacao,
            valor: parseFloat(transacao.valor),
            id: Date.now(),
        });

        setTransacao({
            tipo: "credito",
            categoria: CATEGORIAS.credito[0],
            valor: "",
            data: new Date().toISOString().split("T")[0],
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-2 sm:p-6 rounded-lg shadow">
            <h2 className="text-sm sm:text-xl font-semibold mb-2 sm:mb-4 hidden sm:block dark:text-white">
                Nova Transação
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-2 sm:block sm:space-y-4"
            >
                <div className="col-span-1">
                    <label className="block text-xs sm:text-sm font-medium mb-1 flex items-center dark:text-gray-200">
                        {transacao.tipo === "credito" ? (
                            <ArrowUpCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        ) : (
                            <ArrowDownCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        )}
                        Tipo
                    </label>
                    <select
                        value={transacao.tipo}
                        onChange={(e) =>
                            setTransacao({
                                ...transacao,
                                tipo: e.target.value,
                                categoria: CATEGORIAS[e.target.value][0],
                            })
                        }
                        className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        disabled={salvando}
                    >
                        <option value="credito">Crédito</option>
                        <option value="debito">Débito</option>
                    </select>
                </div>

                <div className="col-span-1">
                    <label className="block text-xs sm:text-sm font-medium mb-1 flex items-center dark:text-gray-200">
                        <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Categoria
                    </label>
                    <select
                        value={transacao.categoria}
                        onChange={(e) =>
                            setTransacao({
                                ...transacao,
                                categoria: e.target.value,
                            })
                        }
                        className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        disabled={salvando}
                    >
                        {CATEGORIAS[transacao.tipo].map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-span-1">
                    <label className="block text-xs sm:text-sm font-medium mb-1 flex items-center dark:text-gray-200">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Valor
                    </label>
                    <input
                        type="number"
                        value={transacao.valor}
                        onChange={(e) =>
                            setTransacao({
                                ...transacao,
                                valor: e.target.value,
                            })
                        }
                        className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        min="0"
                        step="0.01"
                        required
                        disabled={salvando}
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-xs sm:text-sm font-medium mb-1 flex items-center dark:text-gray-200">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Data
                    </label>
                    <input
                        type="date"
                        value={transacao.data}
                        onChange={(e) =>
                            setTransacao({ ...transacao, data: e.target.value })
                        }
                        className="w-full p-1 sm:p-2 border rounded text-xs sm:text-base
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        disabled={salvando}
                    />
                </div>

                <button
                    type="submit"
                    className="col-span-2 bg-blue-500 text-white p-1 sm:p-2 rounded 
                        hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-800
                        flex items-center justify-center text-xs sm:text-base mt-2"
                    disabled={salvando}
                >
                    {salvando ? (
                        <>
                            <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mr-1" />
                            <span className="hidden sm:inline">
                                Salvando...
                            </span>
                        </>
                    ) : (
                        <>
                            <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">
                                Salvar Transação
                            </span>
                            <span className="sm:hidden">Salvar</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default FormularioTransacao;
