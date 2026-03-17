import { canAnalyze } from "./billing";
import { createClient } from "@supabase/supabase-js";

jest.mock("@supabase/supabase-js");

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

const FUTURE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
const PAST = new Date(Date.now() - 1000).toISOString();

function makeMockClient(
  subscription: Record<string, unknown> | null,
  earlyAccess: boolean = false
) {
  const mockFrom = jest.fn().mockImplementation((table: string) => {
    if (table === "early_access") {
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({
              data: earlyAccess ? { email: "test@test.com" } : null,
              error: null,
            }),
          }),
        }),
      };
    }
    if (table === "subscriptions") {
      const upsertMock = jest.fn().mockResolvedValue({ error: null });
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({
              data: subscription,
              error: null,
            }),
          }),
        }),
        upsert: upsertMock,
      };
    }
  });

  mockCreateClient.mockReturnValue({ from: mockFrom } as ReturnType<typeof createClient>);
}

describe("canAnalyze", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
  });

  it("autorise si early_access", async () => {
    makeMockClient(null, true);
    const result = await canAnalyze("user_ea", "ea@test.com");
    expect(result.allowed).toBe(true);
  });

  it("autorise si plan pro actif non expiré", async () => {
    makeMockClient({
      user_id: "user_pro",
      plan: "pro",
      status: "active",
      credits_remaining: 999999,
      subscription_expires_at: FUTURE,
    });
    const result = await canAnalyze("user_pro");
    expect(result.allowed).toBe(true);
  });

  it("bloque si plan pro expiré", async () => {
    makeMockClient({
      user_id: "user_pro_expired",
      plan: "pro",
      status: "active",
      credits_remaining: 0,
      subscription_expires_at: PAST,
    });
    const result = await canAnalyze("user_pro_expired");
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("NO_CREDITS");
  });

  it("autorise si credits > 0", async () => {
    makeMockClient({
      user_id: "user_free",
      plan: "free",
      status: "active",
      credits_remaining: 2,
      subscription_expires_at: null,
    });
    const result = await canAnalyze("user_free");
    expect(result.allowed).toBe(true);
  });

  it("bloque si credits = 0", async () => {
    makeMockClient({
      user_id: "user_no_credits",
      plan: "free",
      status: "active",
      credits_remaining: 0,
      subscription_expires_at: null,
    });
    const result = await canAnalyze("user_no_credits");
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("NO_CREDITS");
  });
});
