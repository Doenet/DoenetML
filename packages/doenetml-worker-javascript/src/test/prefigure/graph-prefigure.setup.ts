import { vi } from "vitest";

const postMessageMock = vi.fn();
vi.stubGlobal("postMessage", postMessageMock);
vi.mock("hyperformula");
