import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "../../components/ui/button";

describe("Button", () => {
  it("deve renderizar o texto acessivel", () => {
    render(<Button>Entrar</Button>);

    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("deve usar type button por padrao", () => {
    render(<Button>Salvar</Button>);

    expect(screen.getByRole("button", { name: "Salvar" })).toHaveAttribute(
      "type",
      "button",
    );
  });
});
