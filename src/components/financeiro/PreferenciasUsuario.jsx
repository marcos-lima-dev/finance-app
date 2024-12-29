import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { usePreferencias } from "../../contexts/PreferenciasContext";

const PreferenciasUsuario = () => {
    const [mostrarModal, setMostrarModal] = useState(false);
    const {
        temaEscuro,
        moedaPadrao,
        metaMensal,
        cotacoes,
        salvarPreferencias,
        formatarInfoCotacao,
    } = usePreferencias();

    // Estado local do formulário sincronizado com as preferências globais
    const [formValues, setFormValues] = useState({
        temaEscuro: temaEscuro,
        moedaPadrao: moedaPadrao,
        metaMensal: metaMensal,
    });

    // Atualiza o formulário quando as preferências globais mudarem
    useEffect(() => {
        setFormValues({
            temaEscuro: temaEscuro,
            moedaPadrao: moedaPadrao,
            metaMensal: metaMensal,
        });
    }, [temaEscuro, moedaPadrao, metaMensal]);

    // Lida com o envio do formulário
    const handleSubmit = (e) => {
        e.preventDefault();
        salvarPreferencias(formValues);
        setMostrarModal(false);
    };

    return (
        <>
            <button
                onClick={() => setMostrarModal(true)}
                className="fixed bottom-4 right-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-lg"
            >
                <Settings className="w-6 h-6" />
            </button>

            {mostrarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold dark:text-white">
                                <Settings className="inline-block w-6 h-6 mr-2" />
                                Preferências
                            </h2>
                            <button
                                onClick={() => setMostrarModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-white">
                                    <span className="flex items-center">
                                        ◎ Meta Mensal
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    value={formValues.metaMensal}
                                    onChange={(e) =>
                                        setFormValues({
                                            ...formValues,
                                            metaMensal: e.target.value,
                                        })
                                    }
                                    placeholder="Meta mensal de gastos"
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-white">
                                    <span className="flex items-center">
                                        □ Aparência
                                    </span>
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formValues.temaEscuro}
                                        onChange={(e) =>
                                            setFormValues({
                                                ...formValues,
                                                temaEscuro: e.target.checked,
                                            })
                                        }
                                        className="mr-2"
                                    />
                                    <span className="dark:text-white">
                                        Tema Escuro
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-white">
                                    <span className="flex items-center">
                                        $ Moeda
                                    </span>
                                </label>
                                <select
                                    value={formValues.moedaPadrao}
                                    onChange={(e) =>
                                        setFormValues({
                                            ...formValues,
                                            moedaPadrao: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="BRL">Real (R$)</option>
                                    <option value="USD">Dólar ($)</option>
                                    <option value="EUR">Euro (€)</option>
                                </select>
                                {formValues.moedaPadrao !== "BRL" &&
                                    cotacoes && (
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {formatarInfoCotacao(
                                                formValues.moedaPadrao,
                                                cotacoes
                                            )}
                                        </div>
                                    )}
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setMostrarModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Salvar Preferências
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default PreferenciasUsuario;
