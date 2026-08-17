import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/components/auth/login-form";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh }),
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: mocks.signIn,
    },
  },
}));

describe("LoginForm", () => {
  it("alterna a visibilidade da senha", () => {
    render(<LoginForm />);

    const password = screen.getByLabelText("Senha");
    expect(password).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "Mostrar senha" }));

    expect(password).toHaveAttribute("type", "text");
  });

  it("mostra erro de validacao para senha curta", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(
      await screen.findByText("A senha deve ter pelo menos 6 caracteres."),
    ).toBeInTheDocument();
    expect(mocks.signIn).not.toHaveBeenCalled();
  });

  it("redireciona apos autenticar", async () => {
    mocks.signIn.mockResolvedValueOnce({ data: null, error: null });
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(mocks.replace).toHaveBeenCalledWith("/dashboard");
    });
    expect(mocks.refresh).toHaveBeenCalledOnce();
  });
});
