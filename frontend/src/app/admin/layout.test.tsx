import { render, screen } from "@testing-library/react";
import AdminLayout from "./layout";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("AdminLayout", () => {
  const mockUsePathname = usePathname as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders navbar header, child content, sign-out button, and footer", () => {
    mockUsePathname.mockReturnValue("/admin");

    render(
      <AdminLayout>
        <div data-testid="admin-child">Dashboard Content</div>
      </AdminLayout>,
    );

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByTestId("admin-child")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();

    const signOutLink = screen.getByRole("link", { name: /sign out/i });
    expect(signOutLink).toHaveAttribute("href", "/auth/logout");
  });

  it("renders no breadcrumbs when at root /admin path", () => {
    mockUsePathname.mockReturnValue("/admin");

    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>,
    );

    expect(
      screen.queryByRole("navigation", { name: /breadcrumb/i }),
    ).not.toBeInTheDocument();
  });

  it("renders breadcrumbs omitting /admin and formatting path segments up to 2 layers deep", () => {
    mockUsePathname.mockReturnValue("/admin/tournaments/round-1/matches");

    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>,
    );

    const breadcrumbs = screen.getAllByRole("navigation", {
      name: /breadcrumb/i,
    });
    expect(breadcrumbs.length).toBeGreaterThan(0);

    // Checks that path segments 'tournaments' and 'round-1' are formatted and rendered
    expect(screen.getAllByText("Tournaments").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Round 1").length).toBeGreaterThan(0);

    // Checks that layer 3 ('matches') was omitted
    expect(screen.queryByText("Matches")).not.toBeInTheDocument();
  });
});
