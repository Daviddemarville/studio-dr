import { beforeEach, describe, expect, it, jest } from "@jest/globals";

// Mock Supabase
const mockGetUser = jest.fn();
const mockOnAuthStateChange = jest.fn();
const mockUnsubscribe = jest.fn();

jest.mock("@/lib/supabase-browser", () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: mockGetUser,
      onAuthStateChange: mockOnAuthStateChange,
    },
  })),
}));

describe("Hook useSupabaseUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });
  });

  it("devrait exporter la fonction useSupabaseUser", () => {
    const { useSupabaseUser } = require("@/hooks/useSupabaseUser");
    expect(typeof useSupabaseUser).toBe("function");
  });

  // Note: Pour des tests complets de hooks React, il faudrait @testing-library/react-hooks
  // Ce test vérifie simplement que le module s'importe correctement et que les mocks sont configurés
});
