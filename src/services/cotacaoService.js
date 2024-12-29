// src/services/cotacaoService.js
const formatarData = (data) => {
    const d = new Date(data);
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    const ano = d.getFullYear();
    return `${mes}-${dia}-${ano}`;
};

export const buscarCotacoes = async () => {
    try {
        // Primeiro verifica o cache
        const cotacoesCache = obterCotacoesCache();
        if (cotacoesCache) {
            return cotacoesCache;
        }

        // Busca cotação atual da API
        const response = await fetch(
            "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await response.json();

        if (data && data.rates && data.rates.BRL && data.rates.EUR) {
            // Taxa USD/BRL (quanto vale 1 USD em BRL)
            const usdToBrl = data.rates.BRL;

            // Taxa EUR/BRL (quanto vale 1 EUR em BRL)
            const eurToBrl = data.rates.BRL / data.rates.EUR;

            console.log("Cotações calculadas:", {
                "1 USD em BRL": usdToBrl,
                "1 EUR em BRL": eurToBrl,
            });

            const cotacoes = {
                USD: Number(usdToBrl.toFixed(2)),
                EUR: Number(eurToBrl.toFixed(2)),
                timestamp: new Date().getTime(),
                dataConsulta: formatarData(new Date()),
            };

            // Salva no cache
            salvarCotacoesCache(cotacoes);
            return cotacoes;
        }

        throw new Error("Dados da API inválidos");
    } catch (erro) {
        console.error("Erro ao buscar cotações:", erro);

        // Em caso de erro, retorna valores aproximados
        return {
            USD: 4.95, // 1 USD = R$ 4,95
            EUR: 5.45, // 1 EUR = R$ 5,45
            timestamp: new Date().getTime(),
            dataConsulta: formatarData(new Date()),
        };
    }
};

export const salvarCotacoesCache = (cotacoes) => {
    if (cotacoes && cotacoes.USD > 0 && cotacoes.EUR > 0) {
        localStorage.setItem("cotacoes", JSON.stringify(cotacoes));
    }
};

export const obterCotacoesCache = () => {
    try {
        const cached = localStorage.getItem("cotacoes");
        if (!cached) return null;

        const cotacoes = JSON.parse(cached);
        const horasPassadas =
            (new Date().getTime() - cotacoes.timestamp) / (1000 * 60 * 60);

        // Se passou mais de 3 horas, busca nova cotação
        if (horasPassadas > 3) {
            localStorage.removeItem("cotacoes");
            return null;
        }

        return cotacoes;
    } catch (erro) {
        localStorage.removeItem("cotacoes");
        return null;
    }
};
