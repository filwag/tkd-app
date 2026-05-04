export type BeltLevel = {
  id: string;
  rank: number; // 10 = 10th kup (beginner), 1 = 1st dan (black belt)
  koreanName: string;
  colour: string;
  source: string;
};

export type Technique = {
  id: string;
  category: "attack" | "defence" | "kick" | "stance" | "block";
  koreanName: string;
  englishName: string;
  description: string;
  beltLevelId: string;
  source: string;
};

// ITF term for form/pattern — not "poomsae" (WT/Kukkiwon term)
export type Tul = {
  id: string;
  name: string;
  koreanName: string;
  movements: number;
  meaning: string;
  beltLevelId: string;
  source: string;
};

// Il-Su Sik — one-step pre-arranged sparring
export type OneStepSparring = {
  id: string;
  number: number;
  attack: string;
  defence: string;
  beltLevelId: string;
  source: string;
};

// TAGB grading includes theory: tul meanings, Korean terms, history, tenets
export type TaekwonDoTheory = {
  id: string;
  question: string;
  answer: string;
  category: "meaning" | "history" | "terminology" | "tenets" | "etiquette";
  beltLevelId: string;
  source: string;
};

export type Curriculum = {
  beltLevel: BeltLevel;
  tul: Tul[];
  techniques: Technique[];
  oneStepSparring: OneStepSparring[];
  theory: TaekwonDoTheory[];
};
