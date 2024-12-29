// src/__tests__/financeiro/FormularioTransacao.test.jsx
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormularioTransacao from "../../components/financeiro/FormularioTransacao";

describe("FormularioTransacao", () => {
    const mockSalvarTransacao = vi.fn();

    beforeEach(() => {
        mockSalvarTransacao.mockClear();
    });

    test("deve renderizar o formulário corretamente", () => {
        render(<FormularioTransacao onSalvar={mockSalvarTransacao} />);

        expect(screen.getByText("Nova Transação")).toBeInTheDocument();
        expect(screen.getByText("Tipo")).toBeInTheDocument();
        expect(screen.getByText("Categoria")).toBeInTheDocument();
        expect(screen.getByText("Valor")).toBeInTheDocument();
        expect(screen.getByText("Data")).toBeInTheDocument();
        expect(screen.getAllByRole("combobox")).toHaveLength(2);

        const valorInput = screen.getByRole("spinbutton");
        const dataInput = screen.getByDisplayValue(
            new Date().toISOString().split("T")[0]
        );
        expect(valorInput).toBeInTheDocument();
        expect(dataInput).toBeInTheDocument();

        const button = screen.getByRole("button");
        expect(button).toHaveTextContent(/salvar/i);
    });

    test("deve permitir inserir dados", async () => {
        render(<FormularioTransacao onSalvar={mockSalvarTransacao} />);

        await act(async () => {
            const valorInput = screen.getByRole("spinbutton");
            fireEvent.change(valorInput, { target: { value: "100" } });

            const submitButton = screen.getByRole("button");
            fireEvent.click(submitButton);
        });

        expect(mockSalvarTransacao).toHaveBeenCalledWith(
            expect.objectContaining({
                valor: 100,
                tipo: "credito",
            })
        );
    });

    test("não deve permitir salvar quando o valor está vazio", async () => {
        render(<FormularioTransacao onSalvar={mockSalvarTransacao} />);

        await act(async () => {
            const submitButton = screen.getByRole("button");
            fireEvent.click(submitButton);
        });

        expect(mockSalvarTransacao).not.toHaveBeenCalled();
    });
});
