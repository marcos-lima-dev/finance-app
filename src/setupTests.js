// src/setupTests.js
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock do localStorage
const storageMock = {
    storage: {},
    getItem(key) {
        return this.storage[key] || null;
    },
    setItem(key, value) {
        this.storage[key] = value;
    },
    clear() {
        this.storage = {};
    },
};

Object.defineProperty(window, "localStorage", {
    value: storageMock,
});

// Mock do matchMedia
window.matchMedia =
    window.matchMedia ||
    function () {
        return {
            matches: false,
            addListener: vi.fn(),
            removeListener: vi.fn(),
        };
    };
