import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import type { ZodSchema } from "zod";
import type {
  BeltLevel,
  Curriculum,
  OneStepSparring,
  TaekwonDoTheory,
  Technique,
  Tul,
} from "./types";
import {
  BeltLevelSchema,
  OneStepSparringFileSchema,
  TechniquesFileSchema,
  TheoryFileSchema,
  TulSchema,
} from "./schema";

const DATA_DIR = path.join(process.cwd(), "src", "curriculum", "data");

function readYaml<T>(filePath: string, schema: ZodSchema<T>): T {
  const content = fs.readFileSync(filePath, "utf-8");
  const raw = yaml.load(content);
  const result = schema.safeParse(raw);
  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Content validation failed in ${path.relative(process.cwd(), filePath)}:\n${errors}`
    );
  }
  return result.data;
}

export function loadBeltLevel(beltId: string): BeltLevel {
  return readYaml(
    path.join(DATA_DIR, "belts", `${beltId}.yaml`),
    BeltLevelSchema
  );
}

export function loadAllBeltLevels(): BeltLevel[] {
  const dir = path.join(DATA_DIR, "belts");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => readYaml(path.join(dir, f), BeltLevelSchema))
    .sort((a, b) => b.rank - a.rank); // highest rank number = most beginner, shown first
}

export function loadTul(): Tul[] {
  const dir = path.join(DATA_DIR, "tul");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => readYaml(path.join(dir, f), TulSchema));
}

export function loadTechniques(): Technique[] {
  const data = readYaml(path.join(DATA_DIR, "techniques.yaml"), TechniquesFileSchema);
  return data.techniques;
}

export function loadTheory(): TaekwonDoTheory[] {
  const data = readYaml(path.join(DATA_DIR, "theory.yaml"), TheoryFileSchema);
  return data.theory;
}

export function loadOneStepSparring(): OneStepSparring[] {
  const data = readYaml(
    path.join(DATA_DIR, "sparring.yaml"),
    OneStepSparringFileSchema
  );
  return data.oneStepSparring;
}

export function loadCurriculum(beltId: string): Curriculum {
  return {
    beltLevel: loadBeltLevel(beltId),
    tul: loadTul().filter((t) => t.beltLevelId === beltId),
    techniques: loadTechniques().filter((t) => t.beltLevelId === beltId),
    oneStepSparring: loadOneStepSparring().filter(
      (s) => s.beltLevelId === beltId
    ),
    theory: loadTheory().filter((t) => t.beltLevelId === beltId),
  };
}
