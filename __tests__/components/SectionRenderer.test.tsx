import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";

// Mock the specialized views
jest.mock("@/app/(public)/components/SectionRenderer/index", () => ({
  QuiSommesNous: () => <div>QuiSommesNous Component</div>,
  Workflow: () => <div>Workflow Component</div>,
  FAQ: () => <div>FAQ Component</div>,
  Logos: () => <div>Logos Component</div>,
  Testimonials: () => <div>Testimonials Component</div>,
  Pricing: () => <div>Pricing Component</div>,
  CardsWithImage: () => <div>CardsWithImage Component</div>,
  GenericRepeater: () => <div>GenericRepeater Component</div>,
  GenericSimple: () => <div>GenericSimple Component</div>,
}));

// Mock React useState for lang
jest.mock("react", () => ({
  ...(jest.requireActual("react") as object),
  useState: jest.fn(() => ["fr"]),
}));

import SectionRenderer from "@/app/(public)/components/SectionRenderer";

describe("SectionRenderer", () => {
  const mockSection = {
    id: 1,
    slug: "test-section",
    template_slug: "section_qui_sommes_nous",
    title: "Test Section",
    icon: "icon",
    table_name: "test_table",
  };

  const mockContent = [{ id: "1", content: { name: "Test Content" } }];

  const mockTemplate = {
    id: "1",
    name: "Test Template",
    fields: [{ name: "name", type: "text" }],
  };

  it("devrait rendre la vue spécialisée pour un template_slug connu", () => {
    render(
      <SectionRenderer
        section={{ ...mockSection, template_slug: "section_qui_sommes_nous" }}
        content={mockContent}
        template={mockTemplate}
      />,
    );
    expect(screen.getByText("QuiSommesNous Component")).toBeTruthy();
  });

  it("devrait rendre GenericRepeater si le template a un repeater", () => {
    const templateWithRepeater = {
      ...mockTemplate,
      fields: [{ name: "items", type: "repeater" }],
    };
    render(
      <SectionRenderer
        section={{ ...mockSection, template_slug: "unknown" }}
        content={mockContent}
        template={templateWithRepeater}
      />,
    );
    expect(screen.getByText("GenericRepeater Component")).toBeTruthy();
  });

  it("devrait rendre GenericSimple comme fallback", () => {
    render(
      <SectionRenderer
        section={{ ...mockSection, template_slug: "unknown" }}
        content={mockContent}
        template={mockTemplate}
      />,
    );
    expect(screen.getByText("GenericSimple Component")).toBeTruthy();
  });

  it("devrait retourner null si pas de template ou content", () => {
    const { container } = render(
      <SectionRenderer
        section={mockSection}
        content={[]}
        template={mockTemplate}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});
