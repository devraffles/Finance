import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Sidebar } from "@/components/layout/Sidebar";

const mocks = vi.hoisted(() => ({
  refresh: vi.fn(),
  replace: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: () => null,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh }),
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: { signOut: mocks.signOut },
}));

describe("Sidebar", () => {
  it("marca a rota ativa e abre o menu no mobile", () => {
    render(
      <Sidebar user={{ email: "admin@kwakfinance.local", name: "Admin" }} />,
    );

    expect(
      screen.getAllByRole("link", { name: "Dashboard" })[0],
    ).toHaveAttribute("aria-current", "page");

    fireEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
    expect(screen.getByRole("button", { name: "Fechar menu" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Fechar menu" }));
    expect(
      screen.queryByRole("button", { name: "Fechar menu" }),
    ).not.toBeInTheDocument();
  });
});
