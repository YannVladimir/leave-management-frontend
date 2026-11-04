import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Sidebar from "./Sidebar";

const currentUser = { name: "Jane Doe", profilePicture: "https://example.com/pic.png", role: "Manager" };

describe("Sidebar", () => {
  it("renders every menu item", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Sidebar isOpen setIsOpen={vi.fn()} currentUser={currentUser} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /apply leave/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /leave approval/i })).toBeInTheDocument();
  });

  it("marks the link matching the current route as active", () => {
    render(
      <MemoryRouter initialEntries={["/leave-balance"]}>
        <Sidebar isOpen setIsOpen={vi.fn()} currentUser={currentUser} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /leave balance/i })).toHaveClass("bg-primary-700");
    expect(screen.getByRole("link", { name: /dashboard/i })).not.toHaveClass("bg-primary-700");
  });

  it("hides menu item labels (but keeps icons) when collapsed", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Sidebar isOpen={false} setIsOpen={vi.fn()} currentUser={currentUser} />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(8);
  });
});
