import { expect, test } from "bun:test";
import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";
import uzbekSte from "../uzbek-ste.ts";

type Handler = (event: Record<string, unknown>, ctx: Record<string, unknown>) => unknown;

function load(): Map<string, Handler> {
  const handlers = new Map<string, Handler>();
  const omp = { on: (name: string, handler: Handler) => handlers.set(name, handler) };
  uzbekSte(omp as unknown as ExtensionAPI);
  return handlers;
}

test("every turn gets the hidden rule message", () => {
  const before = load().get("before_agent_start")!;
  const result = before({ systemPrompt: ["base"] }, {}) as {
    message: { customType: string; content: string; display: boolean };
  };
  expect(result.message.customType).toBe("uzbek-ste");
  expect(result.message.display).toBe(false);
  expect(result.message.content).toStartWith("<uzbek-ste>");
  expect(result.message.content).toEndWith("</uzbek-ste>");
  expect(result.message.content).toContain("### Keyingi qadam");
  expect(result.message.content).toContain("| # | Variant | Natija | Narx | Xavf |");
  expect(result.message.content).toContain("**Javob:** raqam yozing, masalan `1`.");
  // the same rule is sent again on the next turn, not only once
  expect(before({ systemPrompt: ["base"] }, {})).toEqual(result);
});

test("the ask tool is blocked with a reason that points to the markdown block", () => {
  const result = load().get("tool_call")!({ toolName: "ask", input: {} }, {}) as { block: boolean; reason: string };
  expect(result.block).toBe(true);
  expect(result.reason).toContain("Keyingi qadam");
});

test("other tools pass through", () => {
  const toolCall = load().get("tool_call")!;
  for (const toolName of ["bash", "read", "edit", "task"]) {
    expect(toolCall({ toolName, input: {} }, {})).toBeUndefined();
  }
});
