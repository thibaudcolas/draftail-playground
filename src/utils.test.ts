import { postRequest } from "./utils";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

it("posts JSON and returns the parsed response", async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ html: "hello" }) });
  vi.stubGlobal("fetch", fetchMock);
  expect(await postRequest("/api/export", { contentState: null })).toEqual({ html: "hello" });
  expect(fetchMock).toHaveBeenCalledWith(
    "/api/export",
    expect.objectContaining({
      method: "POST",
      body: '{"contentState":null}',
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    }),
  );
});

it.each([400, 500])("rejects HTTP %i responses", async (status) => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status }));
  await expect(postRequest("/api/export", {})).rejects.toThrow("Export failed");
});

it("rejects malformed JSON", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => {
        throw new SyntaxError("Bad JSON");
      },
    }),
  );
  await expect(postRequest("/api/export", {})).rejects.toThrow("Bad JSON");
});

it("aborts stalled requests after 15 seconds", async () => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "fetch",
    vi.fn(
      (_url, { signal }: RequestInit) =>
        new Promise((_resolve, reject) => {
          signal!.addEventListener("abort", () => reject(new Error("Aborted")));
        }),
    ),
  );
  const result = expect(postRequest("/api/export", {})).rejects.toThrow("Aborted");
  await vi.advanceTimersByTimeAsync(15000);
  await result;
  expect(vi.getTimerCount()).toBe(0);
});
