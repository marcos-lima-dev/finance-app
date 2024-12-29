import {
    Wallet,
    TrendingUp,
    Laptop,
    ShoppingBag,
    Utensils,
    Car,
    Home,
    Heart,
    GraduationCap,
    Gamepad2,
    Shirt,
    Receipt,
    CircleDollarSign,
    CircleDot,
} from "lucide-react";

// Exporta as categorias
export const CATEGORIAS = {
    credito: [
        "Salário",
        "Investimentos",
        "Freelance",
        "Vendas",
        "Outros Créditos",
    ],
    debito: [
        "Alimentação",
        "Transporte",
        "Moradia",
        "Saúde",
        "Educação",
        "Lazer",
        "Roupas",
        "Contas",
        "Outros Débitos",
    ],
};

// Exporta o mapeamento de ícones
export const CATEGORIA_ICONS = {
    Salário: Wallet,
    Investimentos: TrendingUp,
    Freelance: Laptop,
    Vendas: ShoppingBag,
    "Outros Créditos": CircleDollarSign,

    Alimentação: Utensils,
    Transporte: Car,
    Moradia: Home,
    Saúde: Heart,
    Educação: GraduationCap,
    Lazer: Gamepad2,
    Roupas: Shirt,
    Contas: Receipt,
    "Outros Débitos": CircleDot,
};
