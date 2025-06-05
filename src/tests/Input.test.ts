import { InputHandler } from "../core/Input";

describe("InputHandler", () => {
  let input: InputHandler;

  beforeEach(() => {
    input = new InputHandler();
  });

  it("should initialize with empty keys object", () => {
    expect(typeof input.keys).toBe("object");
    expect(Object.keys(input.keys).length).toBe(0);
  });

  it("should set key to true on keydown and false on keyup", () => {
    // Simule un keydown "ArrowLeft"
    const downEvent = new KeyboardEvent("keydown", { key: "ArrowLeft" });
    window.dispatchEvent(downEvent);
    expect(input.keys["ArrowLeft"]).toBe(true);

    const upEvent = new KeyboardEvent("keyup", { key: "ArrowLeft" });
    window.dispatchEvent(upEvent);
    expect(input.keys["ArrowLeft"]).toBe(false);
  });
});
