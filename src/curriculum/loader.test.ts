import { describe, expect, it } from "vitest";
import {
  loadBeltLevel,
  loadCurriculum,
  loadOneStepSparring,
  loadTheory,
  loadTechniques,
  loadTul,
} from "./loader";

// ── Belt levels ──────────────────────────────────────────────────────────────

describe("loadBeltLevel", () => {
  it("loads 10th kup belt level with required fields", () => {
    const belt = loadBeltLevel("10th-kup");
    expect(belt.id).toBe("10th-kup");
    expect(belt.rank).toBe(10);
    expect(belt.colour).toBe("white");
    expect(belt.source).toBeTruthy();
  });

  it("loads 9th kup belt level with required fields", () => {
    const belt = loadBeltLevel("9th-kup");
    expect(belt.id).toBe("9th-kup");
    expect(belt.rank).toBe(9);
    expect(belt.source).toBeTruthy();
  });
});

// ── Tul ─────────────────────────────────────────────────────────────────────

describe("loadTul", () => {
  it("loads Chon-Ji with correct movement count", () => {
    const tul = loadTul();
    const chonJi = tul.find((t) => t.id === "chon-ji");
    expect(chonJi).toBeDefined();
    expect(chonJi!.movements).toBe(19);
    expect(chonJi!.beltLevelId).toBe("10th-kup");
  });

  it("loads Do-San with correct movement count", () => {
    const tul = loadTul();
    const doSan = tul.find((t) => t.id === "do-san");
    expect(doSan).toBeDefined();
    expect(doSan!.movements).toBe(28);
    expect(doSan!.beltLevelId).toBe("9th-kup");
  });

  it("includes source citation on every tul", () => {
    loadTul().forEach((t) => expect(t.source).toBeTruthy());
  });

  it("includes meaning on every tul", () => {
    loadTul().forEach((t) => expect(t.meaning).toBeTruthy());
  });
});

// ── Techniques ───────────────────────────────────────────────────────────────

describe("loadTechniques", () => {
  it("returns at least one technique per expected category", () => {
    const techniques = loadTechniques();
    const categories = new Set(techniques.map((t) => t.category));
    expect(categories.has("stance")).toBe(true);
    expect(categories.has("block")).toBe(true);
    expect(categories.has("attack")).toBe(true);
    expect(categories.has("kick")).toBe(true);
  });

  it("includes 9th kup high block and side kick", () => {
    const techniques = loadTechniques();
    expect(techniques.find((t) => t.id === "nopunde-bakat-palmok-makgi")).toBeDefined();
    expect(techniques.find((t) => t.id === "yop-cha-jirugi")).toBeDefined();
  });

  it("includes source citation on every technique", () => {
    loadTechniques().forEach((t) => expect(t.source).toBeTruthy());
  });
});

// ── Theory ───────────────────────────────────────────────────────────────────

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

  it("includes Do-San theory for 9th kup", () => {
    const theory = loadTheory();
    const doSanMeaning = theory.find((t) => t.id === "theory-do-san-meaning");
    expect(doSanMeaning).toBeDefined();
    expect(doSanMeaning!.beltLevelId).toBe("9th-kup");
    const doSanMovements = theory.find((t) => t.id === "theory-do-san-movements");
    expect(doSanMovements).toBeDefined();
    expect(doSanMovements!.answer).toBe("28");
  });

  it("includes source citation on every theory item", () => {
    loadTheory().forEach((t) => expect(t.source).toBeTruthy());
  });
});

// ── One-step sparring ─────────────────────────────────────────────────────────

describe("loadOneStepSparring", () => {
  it("loads at least 3 patterns for 10th kup", () => {
    const sparring = loadOneStepSparring();
    const tenthKup = sparring.filter((s) => s.beltLevelId === "10th-kup");
    expect(tenthKup.length).toBeGreaterThanOrEqual(3);
  });

  it("loads at least 3 patterns for 9th kup", () => {
    const sparring = loadOneStepSparring();
    const ninthKup = sparring.filter((s) => s.beltLevelId === "9th-kup");
    expect(ninthKup.length).toBeGreaterThanOrEqual(3);
  });

  it("every pattern has attack, defence, and source", () => {
    loadOneStepSparring().forEach((s) => {
      expect(s.attack).toBeTruthy();
      expect(s.defence).toBeTruthy();
      expect(s.source).toBeTruthy();
    });
  });
});

// ── Full curriculum ───────────────────────────────────────────────────────────

describe("loadCurriculum", () => {
  it("loads complete 10th kup curriculum", () => {
    const curriculum = loadCurriculum("10th-kup");
    expect(curriculum.beltLevel.id).toBe("10th-kup");
    expect(curriculum.tul.length).toBeGreaterThan(0);
    expect(curriculum.techniques.length).toBeGreaterThan(0);
    expect(curriculum.theory.length).toBeGreaterThan(0);
    expect(curriculum.oneStepSparring.length).toBeGreaterThan(0);
  });

  it("loads complete 9th kup curriculum", () => {
    const curriculum = loadCurriculum("9th-kup");
    expect(curriculum.beltLevel.id).toBe("9th-kup");
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

  it("all 9th kup returned items belong to 9th kup", () => {
    const curriculum = loadCurriculum("9th-kup");
    curriculum.tul.forEach((t) => expect(t.beltLevelId).toBe("9th-kup"));
    curriculum.techniques.forEach((t) => expect(t.beltLevelId).toBe("9th-kup"));
    curriculum.theory.forEach((t) => expect(t.beltLevelId).toBe("9th-kup"));
    curriculum.oneStepSparring.forEach((s) =>
      expect(s.beltLevelId).toBe("9th-kup")
    );
  });
});
