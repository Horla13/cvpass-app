import { canAnalyze } from "./billing";
import { createClient } from "@supabase/supabase-js";

jest.mock("@supabase/supabase-js");

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

function makeMockClient(
  analysesCount: number,
  subscription: Record<string, unknown> | null
) {
  const mockSingle = jest.fn().mockResolvedValue({
    data: subscription,
    error: subscription ? null : { code: "PGRST116" },
  });
  const mockEqSub = jest.fn().mockReturnValue({ single: mockSingle });
  const mockSelectSub = jest.fn().mockReturnValue({ eq: mockEqSub });

  const mockFrom = jest.fn().mockImplementation((table: string) => {
    if (table === "analyses") {
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ count: analysesCount, error: null }),
        }),
      };
    }
    if (table === "subscriptions") {
      return { select: mockSelectSub };
    }
  });

  mockCreateClient.mockReturnValue({ from: mockFrom } as ReturnType<typeof createClient>);
}

const FUTURE = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
const PAST = new Date(Date.now() - 1000).toISOString();

describe("canAnalyze", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
  });

  it("autorise si 0 analyses (quota gratuit)", async () => {
    makeMockClient(0, null);
    const result = await canAnalyze("user_free");
    expect(result.allowed).toBe(true);
  });

  it("bloque si ≥1 analyse et aucune subscription", async () => {
    makeMockClient(1, null);
    const result = await canAnalyze("user_no_sub");
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("quota_exceeded");
  });

  it("autorise si pass48h non expiré", async () => {
    makeMockClient(3, { plan: "pass48h", status: "active", pass_expires_at: FUTURE });
    const result = await canAnalyze("user_pass");
    expect(result.allowed).toBe(true);
  });

  it("bloque si pass48h expiré", async () => {
    makeMockClient(1, { plan: "pass48h", status: "active", pass_expires_at: PAST });
    const result = await canAnalyze("user_expired_pass");
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("quota_exceeded");
  });

  it("autorise si subscription monthly active", async () => {
    makeMockClient(5, { plan: "monthly", status: "active", pass_expires_at: null });
    const result = await canAnalyze("user_monthly");
    expect(result.allowed).toBe(true);
  });
});
