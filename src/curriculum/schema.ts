import { z } from "zod";

export const BeltLevelSchema = z.object({
  id: z.string().min(1),
  rank: z.number().int().min(1).max(10),
  koreanName: z.string().min(1),
  colour: z.string().min(1),
  source: z.string().min(1),
});

export const TechniqueSchema = z.object({
  id: z.string().min(1),
  category: z.enum(["attack", "defence", "kick", "stance", "block"]),
  koreanName: z.string().min(1),
  englishName: z.string().min(1),
  description: z.string().min(1),
  beltLevelId: z.string().min(1),
  source: z.string().min(1),
});

export const TulSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  koreanName: z.string().min(1),
  movements: z.number().int().positive(),
  meaning: z.string().min(1),
  beltLevelId: z.string().min(1),
  source: z.string().min(1),
});

export const OneStepSparringSchema = z.object({
  id: z.string().min(1),
  number: z.number().int().positive(),
  attack: z.string().min(1),
  defence: z.string().min(1),
  beltLevelId: z.string().min(1),
  source: z.string().min(1),
});

export const TaekwonDoTheorySchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.enum(["meaning", "history", "terminology", "tenets", "etiquette"]),
  beltLevelId: z.string().min(1),
  source: z.string().min(1),
});

export const TechniquesFileSchema = z.object({
  techniques: z.array(TechniqueSchema),
});

export const TheoryFileSchema = z.object({
  theory: z.array(TaekwonDoTheorySchema),
});

export const OneStepSparringFileSchema = z.object({
  oneStepSparring: z.array(OneStepSparringSchema),
});
