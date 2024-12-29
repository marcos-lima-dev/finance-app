import { createContext, useContext, useState, useEffect } from "react";
import {
    buscarCotacoes,
    salvarCotacoesCache,
    obterCotacoesCache,
} from "../services/cotacaoService";

const PreferenciasContext = createContext();

export function PreferenciasProvider({ children }) {
    const [temaEscuro, setTemaEscuro] = useState(false);
    const [moedaPadrao, setMoedaPadrao] = useState("BRL");
    const [cotacoes, setCotacoes] = useState(null);
    const [metaMensal, setMetaMensal] = useState("");

    // Carrega as preferências e cotações ao iniciar
    useEffect(() => {
        const carregarPreferencias = () => {
            const tema = localStorage.getItem("temaEscuro") === "true";
            const moeda = localStorage.getItem("moedaPadrao") || "BRL";
            const meta = localStorage.getItem("metaMensal") || "";

            setTemaEscuro(tema);
            setMoedaPadrao(moeda);
            setMetaMensal(meta);

            document.documentElement.classList.toggle("dark", tema);
        };

        const carregarCotacoes = async () => {
            const novasCotacoes = await buscarCotacoes();
            if (novasCotacoes) {
                setCotacoes(novasCotacoes);
            }
        };

        carregarPreferencias();
        carregarCotacoes();
    }, []);

    const salvarPreferencias = (novasPreferencias) => {
        const {
            temaEscuro: novoTema,
            moedaPadrao: novaMoeda,
            metaMensal: novaMeta,
        } = novasPreferencias;

        // Atualiza tema
        setTemaEscuro(novoTema);
        localStorage.setItem("temaEscuro", novoTema);
        document.documentElement.classList.toggle("dark", novoTema);

        // Atualiza moeda
        setMoedaPadrao(novaMoeda);
        localStorage.setItem("moedaPadrao", novaMoeda);

        // Atualiza meta
        setMetaMensal(novaMeta);
        localStorage.setItem("metaMensal", novaMeta);
    };

    const formatarMoeda = (valor) => {
        if (typeof valor !== "number") return "R$ 0,00";

        // Se for real, retorna o formato brasileiro
        if (moedaPadrao === "BRL") {
            return valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            });
        }

        // Se não tiver cotações, mostra carregando
        if (!cotacoes) return "Carregando...";

        // Pega a taxa da moeda selecionada
        const taxa = moedaPadrao === "USD" ? cotacoes.USD : cotacoes.EUR;

        // Converte o valor usando a taxa
        const valorConvertido = valor / taxa;

        // Formata de acordo com a moeda
        return valorConvertido.toLocaleString(
            moedaPadrao === "USD" ? "en-US" : "de-DE",
            {
                style: "currency",
                currency: moedaPadrao,
            }
        );
    };

    const formatarInfoCotacao = (moeda, cotacoesAtuais) => {
        if (!cotacoesAtuais) return "Carregando cotações...";

        const taxa = moeda === "USD" ? cotacoesAtuais.USD : cotacoesAtuais.EUR;
        const simboloMoeda = moeda === "USD" ? "USD" : "EUR";

        return `1 ${simboloMoeda} = R$ ${taxa.toFixed(2)}\nCotação de ${
            cotacoesAtuais.dataConsulta
        }`;
    };

    return (
        <PreferenciasContext.Provider
            value={{
                temaEscuro,
                moedaPadrao,
                metaMensal,
                cotacoes,
                salvarPreferencias,
                formatarMoeda,
                formatarInfoCotacao,
            }}
        >
            {children}
        </PreferenciasContext.Provider>
    );
}

export const usePreferencias = () => {
    const context = useContext(PreferenciasContext);
    if (!context) {
        throw new Error(
            "usePreferencias deve ser usado dentro de um PreferenciasProvider"
        );
    }
    return context;
};
