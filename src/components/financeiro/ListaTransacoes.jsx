import React, { useState } from "react";
import { usePreferencias } from "../../contexts/PreferenciasContext";
import {
    CircleDollarSign,
    Tag,
    Calendar,
    X,
    Trash2,
    Edit,
    Wallet,
} from "lucide-react";
import { CATEGORIAS } from "../../utils/constants/categorias";

const ListaTransacoes = ({
    transacoes = [],
    onExcluir,
    onEditar,
    operacao,
    tipoFiltro,
    categoriaFiltro,
    setTipoFiltro,
    setCategoriaFiltro,
}) => {
    const { formatarMoeda } = usePreferencias();
    const [transacaoParaExcluir, setTransacaoParaExcluir] = useState(null);
    const [transacaoEditando, setTransacaoEditando] = useState(null);

    const filtrarTransacoes = () => {
        return transacoes.filter((transacao) => {
            const matchTipo =
                tipoFiltro === "todos" || transacao.tipo === tipoFiltro;
            const matchCategoria =
                categoriaFiltro === "todos" ||
                transacao.categoria === categoriaFiltro;
            return matchTipo && matchCategoria;
        });
    };

    // Modal de Confirmação de Exclusão
    const ModalConfirmacao = ({ transacao }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">
                    Confirmar Exclusão
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Tem certeza que deseja excluir esta transação?
                </p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => setTransacaoParaExcluir(null)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            onExcluir(transacao.id);
                            setTransacaoParaExcluir(null);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );

    // Modal de Edição
    const ModalEdicao = ({ transacao }) => {
        const [formValues, setFormValues] = useState({
            ...transacao,
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            onEditar({
                ...formValues,
                valor: parseFloat(formValues.valor),
            });
            setTransacaoEditando(null);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">
                        Editar Transação
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-white">
                                Tipo
                            </label>
                            <select
                                value={formValues.tipo}
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        tipo: e.target.value,
                                        categoria:
                                            CATEGORIAS[e.target.value][0],
                                    })
                                }
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                disabled={operacao.tipo === "editando"}
                            >
                                <option value="credito">Crédito</option>
                                <option value="debito">Débito</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-white">
                                Categoria
                            </label>
                            <select
                                value={formValues.categoria}
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        categoria: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                disabled={operacao.tipo === "editando"}
                            >
                                {CATEGORIAS[formValues.tipo].map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-white">
                                Valor
                            </label>
                            <input
                                type="number"
                                value={formValues.valor}
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        valor: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                disabled={operacao.tipo === "editando"}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-white">
                                Data
                            </label>
                            <input
                                type="date"
                                value={formValues.data}
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        data: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                disabled={operacao.tipo === "editando"}
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setTransacaoEditando(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                disabled={operacao.tipo === "editando"}
                            >
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const BotoesAcao = ({ transacao }) => (
        <div className="flex space-x-2">
            <button
                onClick={() => setTransacaoEditando(transacao)}
                className="text-blue-500 hover:text-blue-700 disabled:text-blue-300 flex items-center"
                disabled={
                    operacao.tipo === "editando" && operacao.id === transacao.id
                }
            >
                <Edit className="w-4 h-4" />
                <span className="ml-1 hidden sm:inline">Editar</span>
            </button>
            <button
                onClick={() => setTransacaoParaExcluir(transacao)}
                className="text-red-500 hover:text-red-700 flex items-center"
            >
                <Trash2 className="w-4 h-4" />
                <span className="ml-1 hidden sm:inline">Excluir</span>
            </button>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1 flex items-center dark:text-gray-200">
                        <CircleDollarSign className="w-4 h-4 mr-2" />
                        Tipo
                    </label>
                    <select
                        data-testid="tipo-filter"
                        value={tipoFiltro}
                        onChange={(e) => setTipoFiltro(e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="todos">Todos</option>
                        <option value="credito">Crédito</option>
                        <option value="debito">Débito</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 flex items-center dark:text-gray-200">
                        <Tag className="w-4 h-4 mr-2" />
                        Categoria
                    </label>
                    <select
                        data-testid="categoria-filter"
                        value={categoriaFiltro}
                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="todos">todos</option>
                        {CATEGORIAS.credito
                            .concat(CATEGORIAS.debito)
                            .map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold dark:text-white">
                    Transações
                </h2>
                <button
                    onClick={() => {
                        setTipoFiltro("todos");
                        setCategoriaFiltro("todos");
                    }}
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                >
                    <X className="w-4 h-4 mr-1" />
                    Limpar Filtros
                </button>
            </div>

            {transacoes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Nenhuma transação cadastrada ainda.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <th className="p-3 text-left text-gray-600 dark:text-gray-300">
                                    Data
                                </th>
                                <th className="p-3 text-left text-gray-600 dark:text-gray-300">
                                    Tipo
                                </th>
                                <th className="p-3 text-left text-gray-600 dark:text-gray-300">
                                    Categoria
                                </th>
                                <th className="p-3 text-left text-gray-600 dark:text-gray-300">
                                    Valor
                                </th>
                                <th className="p-3 text-left text-gray-600 dark:text-gray-300">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody data-testid="transacoes-tbody">
                            {filtrarTransacoes().map((transacao) => (
                                <tr
                                    key={transacao.id}
                                    data-testid={`transacao-${transacao.id}`}
                                    className="border-b dark:border-gray-700"
                                >
                                    <td
                                        data-testid={`data-${transacao.id}`}
                                        className="p-3 dark:text-gray-300"
                                    >
                                        {new Date(
                                            transacao.data
                                        ).toLocaleDateString()}
                                    </td>
                                    <td
                                        data-testid={`tipo-${transacao.id}`}
                                        className="p-3 dark:text-gray-300"
                                    >
                                        {transacao.tipo === "credito"
                                            ? "Crédito"
                                            : "Débito"}
                                    </td>
                                    <td
                                        data-testid={`categoria-${transacao.id}`}
                                        className="p-3 flex items-center dark:text-gray-300"
                                    >
                                        <Wallet className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                                        {transacao.categoria}
                                    </td>
                                    <td
                                        data-testid={`valor-${transacao.id}`}
                                        className={`p-3 ${
                                            transacao.tipo === "credito"
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-red-600 dark:text-red-400"
                                        }`}
                                    >
                                        {formatarMoeda(transacao.valor)}
                                    </td>
                                    <td className="p-3">
                                        <BotoesAcao transacao={transacao} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {transacaoParaExcluir && (
                <ModalConfirmacao transacao={transacaoParaExcluir} />
            )}

            {transacaoEditando && <ModalEdicao transacao={transacaoEditando} />}
        </div>
    );
};

export default ListaTransacoes;
