import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Header } from "@/components/layout/Header";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/contas",
  useRouter: () => ({ replace: mocks.replace }),
  useSearchParams: () => new URLSearchParams("periodo=mes-atual&perfil=todos"),
}));

describe("Header", () => {
  it("exibe o titulo da rota e atualiza os filtros globais", () => {
    render(<Header />);

    expect(screen.getByRole("heading", { name: "Contas" })).toBeVisible();

    fireEvent.change(screen.getByLabelText("Periodo"), {
      target: { value: "trimestre" },
    });
    expect(mocks.replace).toHaveBeenLastCalledWith(
      "/contas?periodo=trimestre&perfil=todos",
    );

    fireEvent.change(screen.getByLabelText("Perfil"), {
      target: { value: "pj" },
    });
    expect(mocks.replace).toHaveBeenLastCalledWith(
      "/contas?periodo=mes-atual&perfil=pj",
    );
  });
});
