import { describe, expect, it } from "vitest";
import {
  loadBeltLevel,
  loadCurriculum,
  loadOneStepSparring,
  loadTheory,
  loadTechniques,
  loadTul,
} from "./loader";

describe("loadBeltLevel", () => {
  it("loads 10th kup belt level with required fields", () => {
    const belt = loadBeltLevel("10th-kup");
    expect(belt.id).toBe("10th-kup");
    expect(belt.rank).toBe(10);
    expect(belt.colour).toBe("white");
    expect(belt.source).toBeTruthy();
  });
});

describe("loadTul", () => {
  it("loads Chon-Ji with correct movement count", () => {
    const tul = loadTul();
    const chonJi = tul.find((t) => t.id === "chon-ji");
    expect(chonJi).toBeDefined();
    expect(chonJi!.movements).toBe(19);
    expect(chonJi!.beltLevelId).toBe("10th-kup");
  });

  it("includes source citation on every tul", () => {
    loadTul().forEach((t) => expect(t.source).toBeTruthy());
  });
});

describe("loadTechniques", () => {
  it("returns at least one technique per expected category", () => {
    const techniques = loadTechniques();
    const categories = new Set(techniques.map((t) => t.category));
    expect(categories.has("stance")).toBe(true);
    expect(categories.has("block")).toBe(true);
    expect(categories.has("attack")).toBe(true);
    expect(categories.has("kick")).toBe(true);
  });

  it("includes source citation on every technique", () => {
    loadTechniques().forEach((t) => expect(t.source).toBeTruthy());
  });
});

describe("loadTheory", () => {
  it("includes tenets question with Courtesy in the answer", () => {
    const tenets = loadTheory().filter((t) => t.category === "tenets");
    expect(tenets.length).toBeGreaterThan(0);
    expect(tenets[0].answer).toContain("Courtesy");
  });

  it("includes tul meaning question for Chon-Ji", () => {
    const meanings = loadTheory().filter((t) => t.category === "meaning");
    expect(meanings.some((t) => t.answer.toLowerCase().includes("heaven"))).toBe(true);
  });

  it("includes source citation on every theory item", () => {
    loadTheory().forEach((t) => expect(t.source).toBeTruthy());
  });
});

describe("loadOneStepSparring", () => {
  it("loads at least 3 patterns for 10th kup", () => {
    const sparring = loadOneStepSparring();
    const tenthKup = sparring.filter((s) => s.beltLevelId === "10th-kup");
    expect(tenthKup.length).toBeGreaterThanOrEqual(3);
  });

  it("every pattern has attack, defence, and source", () => {
    loadOneStepSparring().forEach((s) => {
      expect(s.attack).toBeTruthy();
      expect(s.defence).toBeTruthy();
      expect(s.source).toBeTruthy();
    });
  });
});

describe("loadCurriculum", () => {
  it("loads complete 10th kup curriculum", () => {
    const curriculum = loadCurriculum("10th-kup");
    expect(curriculum.beltLevel.id).toBe("10th-kup");
    expect(curriculum.tul.length).toBeGreaterThan(0);
    expect(curriculum.techniques.length).toBeGreaterThan(0);
    expect(curriculum.theory.length).toBeGreaterThan(0);
    expect(curriculum.oneStepSparring.length).toBeGreaterThan(0);
  });

  it("all returned items belong to the requested belt level", () => {
    const curriculum = loadCurriculum("10th-kup");
    curriculum.tul.forEach((t) => expect(t.beltLevelId).toBe("10th-kup"));
    curriculum.techniques.forEach((t) =>
      expect(t.beltLevelId).toBe("10th-kup")
    );
    curriculum.theory.forEach((t) => expect(t.beltLevelId).toBe("10th-kup"));
    curriculum.oneStepSparring.forEach((s) =>
      expect(s.beltLevelId).toBe("10th-kup")
    );
  });
});
