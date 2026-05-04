import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import type {
  BeltLevel,
  Curriculum,
  OneStepSparring,
  TaekwonDoTheory,
  Technique,
  Tul,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "curriculum", "data");

function readYaml<T>(filePath: string): T {
  const content = fs.readFileSync(filePath, "utf-8");
  return yaml.load(content) as T;
}

export function loadBeltLevel(beltId: string): BeltLevel {
  return readYaml<BeltLevel>(
    path.join(DATA_DIR, "belts", `${beltId}.yaml`)
  );
}

export function loadTul(): Tul[] {
  const dir = path.join(DATA_DIR, "tul");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => readYaml<Tul>(path.join(dir, f)));
}

export function loadTechniques(): Technique[] {
  const data = readYaml<{ techniques: Technique[] }>(
    path.join(DATA_DIR, "techniques.yaml")
  );
  return data.techniques;
}

export function loadTheory(): TaekwonDoTheory[] {
  const data = readYaml<{ theory: TaekwonDoTheory[] }>(
    path.join(DATA_DIR, "theory.yaml")
  );
  return data.theory;
}

export function loadOneStepSparring(): OneStepSparring[] {
  const data = readYaml<{ oneStepSparring: OneStepSparring[] }>(
    path.join(DATA_DIR, "sparring.yaml")
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
