import { useServiceRunner } from "./index";

describe("index", () => {
  it("can export useServiceRunner", () => {
    expect(!!useServiceRunner).toEqual(true);
  });
});
