import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

// Mock NextResponse
const mockJson = jest.fn();
const mockNextResponse = {
  json: mockJson,
  next: jest.fn(() => ({ cookies: { set: jest.fn() } })),
};
jest.mock("next/server", () => ({
  NextResponse: mockNextResponse,
}));

// Mock Request
global.Request = jest.fn().mockImplementation(() => ({
  json: jest.fn(() => Promise.resolve({})),
})) as unknown as typeof Request;

// Mock Resend
type SendFn = (
  payload?: Record<string, unknown>,
) => Promise<{ data: { id: string } }>;
const mockSend = jest.fn() as jest.MockedFunction<SendFn>;
jest.mock("resend", () => ({
  Resend: jest.fn(() => ({
    emails: { send: mockSend },
  })),
}));

// Mock Supabase
const mockFrom = jest.fn(() => ({
  select: jest.fn(() => ({
    eq: jest.fn(() => ({
      single: jest.fn(() => ({
        data: { email: "test@example.com" },
        error: null,
      })),
    })),
  })),
}));
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    from: mockFrom,
  })),
}));

jest.mock("@/lib/supabase-server", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn(() => ({ error: null })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: [{ email: "team@example.com" }],
          error: null,
        })),
      })),
    })),
  })),
}));

// Middleware tests skipped - complex SSR mocking required

describe("API /resend", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RESEND_API_KEY = "test-key";
    process.env.FROM_EMAIL = "test@example.com";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
    mockSend.mockResolvedValue({ data: { id: "123" } });
  });

  afterEach(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.FROM_EMAIL;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  it("devrait envoyer un email avec succès", async () => {
    const { POST } = require("@/app/api/resend/route");
    const req = {
      json: jest.fn(() => Promise.resolve({ email: "user@example.com" })),
    };
    const _result = await POST(req);
    expect(mockJson).toHaveBeenCalledWith({
      success: true,
      message: "Email sent successfully",
      id: "123",
    });
  });

  it("devrait retourner une erreur si email manquant", async () => {
    const { POST } = require("@/app/api/resend/route");
    const req = { json: jest.fn(() => Promise.resolve({})) };
    await POST(req);
    expect(mockJson).toHaveBeenCalledWith(
      { error: "Email inconnue" },
      { status: 400 },
    );
  });
});

describe("API /contact", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RESEND_API_KEY = "test-key";
    process.env.TURNSTILE_SECRET_KEY = "secret";
    mockSend.mockResolvedValue({ data: { id: "456" } });
  });

  afterEach(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.TURNSTILE_SECRET_KEY;
  });

  it("devrait traiter un message de contact valide", async () => {
    // Mock fetch for captcha
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      }),
    ) as unknown as typeof fetch;

    const { POST } = require("@/app/api/contact/route");
    const req = {
      json: jest.fn(() =>
        Promise.resolve({
          email: "user@example.com",
          subject: "Test",
          message: "Hello",
          token: "valid-token",
        }),
      ),
    };
    const _result = await POST(req);
    expect(mockJson).toHaveBeenCalledWith({ success: true });
  });

  it("devrait rejeter si captcha invalide", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false }),
      }),
    ) as unknown as typeof fetch;

    const { POST } = require("@/app/api/contact/route");
    const req = {
      json: jest.fn(() =>
        Promise.resolve({
          email: "user@example.com",
          subject: "Test",
          message: "Hello",
          token: "invalid",
        }),
      ),
    };
    const _result = await POST(req);
    expect(mockJson).toHaveBeenCalledWith(
      { error: "Captcha invalide.", details: null },
      { status: 400 },
    );
  });
});
