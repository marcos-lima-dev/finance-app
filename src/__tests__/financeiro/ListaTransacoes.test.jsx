// src/__tests__/financeiro/ListaTransacoes.test.jsx
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ListaTransacoes from "../../components/financeiro/ListaTransacoes";
import { PreferenciasProvider } from "../../contexts/PreferenciasContext";

describe("ListaTransacoes", () => {
    const mockTransacoes = [
        {
            id: 1,
            tipo: "credito",
            categoria: "Salário",
            valor: 3000,
            data: "2024-12-28",
        },
        {
            id: 2,
            tipo: "debito",
            categoria: "Alimentação",
            valor: 150,
            data: "2024-12-28",
        },
    ];

    const defaultProps = {
        transacoes: [],
        onDelete: vi.fn(),
        onEdit: vi.fn(),
        operacao: { tipo: null, id: null },
        tipoFiltro: "todos",
        categoriaFiltro: "todos",
        setTipoFiltro: vi.fn(),
        setCategoriaFiltro: vi.fn(),
    };

    const renderComponent = (props = {}) => {
        return render(
            <PreferenciasProvider>
                <ListaTransacoes {...defaultProps} {...props} />
            </PreferenciasProvider>
        );
    };

    beforeEach(() => {
        defaultProps.onDelete.mockClear();
        defaultProps.onEdit.mockClear();
        defaultProps.setTipoFiltro.mockClear();
        defaultProps.setCategoriaFiltro.mockClear();
    });

    test("deve mostrar mensagem quando não há transações", () => {
        renderComponent();
        expect(
            screen.getByText("Nenhuma transação cadastrada ainda.")
        ).toBeInTheDocument();
    });

    test("deve renderizar transações corretamente", () => {
        renderComponent({ transacoes: mockTransacoes });

        // Verifica o título
        expect(screen.getByText("Transações")).toBeInTheDocument();

        // Verifica os filtros
        expect(screen.getByTestId("tipo-filter")).toBeInTheDocument();
        expect(screen.getByTestId("categoria-filter")).toBeInTheDocument();

        // Verifica os dados na tabela
        const tbody = screen.getByTestId("transacoes-tbody");
        expect(tbody.children).toHaveLength(2);

        // Verifica a primeira transação
        expect(screen.getByTestId("transacao-1")).toHaveTextContent("Salário");
        expect(screen.getByTestId("transacao-1")).toHaveTextContent("Crédito");

        // Verifica a segunda transação
        expect(screen.getByTestId("transacao-2")).toHaveTextContent(
            "Alimentação"
        );
        expect(screen.getByTestId("transacao-2")).toHaveTextContent("Débito");
    });

    test("deve filtrar transações por tipo", async () => {
        const user = userEvent.setup();
        renderComponent({ transacoes: mockTransacoes });

        // Seleciona o filtro de tipo
        const tipoFilter = screen.getByTestId("tipo-filter");
        await user.selectOptions(tipoFilter, "credito");

        expect(defaultProps.setTipoFiltro).toHaveBeenCalledWith("credito");
    });
});
