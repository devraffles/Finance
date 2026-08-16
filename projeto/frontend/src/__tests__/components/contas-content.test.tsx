import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ContasContent } from "../../components/contas/contas-content";

describe("ContasContent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("abre o formulario para cadastrar uma nova conta", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      }),
    );

    render(<ContasContent />);
    fireEvent.click(screen.getByRole("button", { name: /nova conta/i }));

    expect(
      screen.getByRole("dialog", { name: "Nova conta" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Nova conta" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
  });
});
