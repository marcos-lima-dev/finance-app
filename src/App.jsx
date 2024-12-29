import React, { useState, useEffect, lazy, Suspense } from "react";
import { PreferenciasProvider } from "./contexts/PreferenciasContext";
import PreferenciasUsuario from "./components/financeiro/PreferenciasUsuario";
import FormularioTransacao from "./components/financeiro/FormularioTransacao";
import ListaTransacoes from "./components/financeiro/ListaTransacoes";
import ResumoFinanceiro from "./components/financeiro/ResumoFinanceiro";
import AlertaFinanceiro from "./components/financeiro/AlertaFinanceiro";
import { CATEGORIAS } from "./utils/constants/categorias";
import Toast from "./components/ui/Toast";

const DashboardGraficos = lazy(() =>
    import("./components/financeiro/DashboardGraficos")
);

const LoadingGraficos = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm h-64 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
);

export default function App() {
    const [transacoes, setTransacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [operacao, setOperacao] = useState({
        tipo: null,
        id: null,
    });
    const [toast, setToast] = useState(null);
    const [tipoFiltro, setTipoFiltro] = useState("todos");
    const [categoriaFiltro, setCategoriaFiltro] = useState("todos");

    const mostrarToast = (mensagem, tipo) => {
        setToast({ mensagem, tipo });
    };

    useEffect(() => {
        const carregarDados = async () => {
            try {
                setCarregando(true);
                const dadosLocais = localStorage.getItem("transacoes");
                if (dadosLocais) {
                    setTransacoes(JSON.parse(dadosLocais));
                }
            } catch (erro) {
                console.error("Erro ao carregar dados:", erro);
                mostrarToast("Erro ao carregar dados", "erro");
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, []);

    const simularProcessamento = () =>
        new Promise((resolve) => setTimeout(resolve, 500));

    const salvarTransacao = async (novaTransacao) => {
        try {
            setOperacao({ tipo: "salvando", id: null });
            await simularProcessamento();

            const novasTransacoes = [...transacoes, novaTransacao];
            setTransacoes(novasTransacoes);
            localStorage.setItem("transacoes", JSON.stringify(novasTransacoes));
            mostrarToast("Transação salva com sucesso!", "sucesso");
        } catch (erro) {
            mostrarToast("Erro ao salvar transação", "erro");
        } finally {
            setOperacao({ tipo: null, id: null });
        }
    };

    const editarTransacao = async (transacaoEditada) => {
        try {
            setOperacao({ tipo: "editando", id: transacaoEditada.id });
            await simularProcessamento();

            const novasTransacoes = transacoes.map((t) =>
                t.id === transacaoEditada.id ? transacaoEditada : t
            );
            setTransacoes(novasTransacoes);
            localStorage.setItem("transacoes", JSON.stringify(novasTransacoes));
            mostrarToast("Transação editada com sucesso!", "sucesso");
        } catch (erro) {
            mostrarToast("Erro ao editar transação", "erro");
        } finally {
            setOperacao({ tipo: null, id: null });
        }
    };

    const excluirTransacao = async (id) => {
        try {
            setOperacao({ tipo: "excluindo", id });
            await simularProcessamento();

            const novasTransacoes = transacoes.filter((t) => t.id !== id);
            setTransacoes(novasTransacoes);
            localStorage.setItem("transacoes", JSON.stringify(novasTransacoes));
            mostrarToast("Transação excluída com sucesso!", "sucesso");
        } catch (erro) {
            mostrarToast("Erro ao excluir transação", "erro");
        } finally {
            setOperacao({ tipo: null, id: null });
        }
    };

    if (carregando) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando dados...</p>
                </div>
            </div>
        );
    }

    return (
        <PreferenciasProvider>
            <>
                <div className="min-h-screen bg-gray-100 p-1 sm:p-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-6">
                            Controle Financeiro
                        </h1>
                        <div className="space-y-2 sm:space-y-6">
                            <ResumoFinanceiro transacoes={transacoes} />
                            <AlertaFinanceiro
                                transacoes={transacoes}
                                categorias={CATEGORIAS.debito}
                            />
                            <Suspense fallback={<LoadingGraficos />}>
                                <DashboardGraficos transacoes={transacoes} />
                            </Suspense>
                            <FormularioTransacao
                                onSalvar={salvarTransacao}
                                salvando={operacao.tipo === "salvando"}
                            />
                            <ListaTransacoes
                                transacoes={transacoes}
                                onExcluir={excluirTransacao}
                                onEditar={editarTransacao}
                                operacao={operacao}
                                tipoFiltro={tipoFiltro}
                                categoriaFiltro={categoriaFiltro}
                                setTipoFiltro={setTipoFiltro}
                                setCategoriaFiltro={setCategoriaFiltro}
                            />
                        </div>
                    </div>
                    <PreferenciasUsuario />
                </div>
                {toast && (
                    <Toast
                        mensagem={toast.mensagem}
                        tipo={toast.tipo}
                        onClose={() => setToast(null)}
                    />
                )}
            </>
        </PreferenciasProvider>
    );
}
