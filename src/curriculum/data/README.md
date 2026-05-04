# Curriculum Content — Authoring Guide

You do not need to write any code to add a new belt. Follow the steps below,
open a pull request, and CI will validate your content automatically.

---

## Folder layout

```
data/
  belts/          — one file per belt grade (e.g. 10th-kup.yaml)
  tul/            — one file per pattern (e.g. chon-ji.yaml)
  techniques.yaml — all techniques across all grades
  theory.yaml     — all theory Q&A across all grades
  sparring.yaml   — all one-step sparring sequences across all grades
```

---

## How to add a new belt (step by step)

### 1 — Create the belt file

Copy `belts/10th-kup.yaml` into a new file named after the grade
(e.g. `belts/8th-kup.yaml`).

```yaml
# 8th Kup — Yellow Belt
# Source: TAGB syllabus (tagb.co.uk); HED TKD school curriculum
id: 8th-kup          # must match the filename (without .yaml)
rank: 8              # 10 = beginner, 1 = 1st dan
colour: yellow
koreanName: 팔 급
source: "TAGB syllabus (tagb.co.uk); HED TKD school curriculum"
```

Required fields: `id`, `rank`, `colour`, `koreanName`, `source`.

### 2 — Add the tul (pattern)

Create a new file in `tul/` named after the pattern (e.g. `tul/dan-gun.yaml`).

```yaml
# Dan-Gun — second tul in ITF Taekwon-Do
# Source: ITF Encyclopedia (Choi Hong Hi, 1999, p.57); TAGB syllabus
id: dan-gun
name: Dan-Gun
koreanName: 단군
movements: 21
beltLevelId: 8th-kup   # must match the id in belts/
meaning: >
  Dan-Gun is named after the holy Dan-Gun, the legendary founder of
  Korea in the year 2333 B.C.
source: "ITF Encyclopedia (Choi Hong Hi, 1999, p.57); TAGB syllabus (tagb.co.uk)"
```

Required fields: `id`, `name`, `koreanName`, `movements`, `beltLevelId`, `meaning`, `source`.

### 3 — Add techniques

Open `techniques.yaml` and append new items under the existing list.
Keep them in belt-level order (lowest → highest rank) for readability.

```yaml
  - id: nopunde-bakat-palmok-makgi   # unique slug, no spaces
    category: block                  # one of: attack, defence, kick, stance, block
    koreanName: 높은 바깥 팔목 막기
    englishName: High outer forearm block
    description: >
      Sweeping block from inside to outside protecting the upper body / head.
      Primary block in Do-San.
    beltLevelId: 9th-kup
    source: "ITF Encyclopedia (Choi Hong Hi, 1999)"
```

Allowed `category` values: `attack` · `defence` · `kick` · `stance` · `block`

### 4 — Add theory questions

Open `theory.yaml` and append new items under the existing list.

```yaml
  - id: theory-do-san-movements
    question: How many movements are in Do-San?
    answer: "28"
    category: meaning               # one of: meaning, history, terminology, tenets, etiquette
    beltLevelId: 9th-kup
    source: "ITF Encyclopedia (Choi Hong Hi, 1999)"
```

Allowed `category` values: `meaning` · `history` · `terminology` · `tenets` · `etiquette`

### 5 — Add one-step sparring

Open `sparring.yaml` and append new sequences under the existing list.
Number them consecutively per belt level (e.g. 4, 5, 6 for 9th kup).

```yaml
  - id: il-su-sik-4
    number: 4
    attack: >
      Step forward with right foot into right walking stance, execute right
      obverse punch (Kaunde Baro Jirugi) to the middle section.
    defence: >
      Step back with left foot into left walking stance, execute right high
      outer forearm block; counter with left reverse punch to middle section.
    beltLevelId: 9th-kup
    source: "HED TKD school syllabus; TAGB il-su sik methodology"
```

Required fields: `id`, `number`, `attack`, `defence`, `beltLevelId`, `source`.

### 6 — Open a pull request

Commit your changes on a new branch and open a PR.
CI runs `npm test` and will show exactly which field is wrong if validation fails.

---

## Validation rules (what CI checks)

| Field | Rule |
|---|---|
| `source` | Required on every item — cite the syllabus or encyclopedia edition |
| `beltLevelId` | Must match an `id` in `belts/` exactly |
| `category` (technique) | Must be one of: `attack`, `defence`, `kick`, `stance`, `block` |
| `category` (theory) | Must be one of: `meaning`, `history`, `terminology`, `tenets`, `etiquette` |
| `movements` (tul) | Must be a positive integer |
| `rank` (belt) | Must be an integer between 1 and 10 |

If CI fails, read the error message — it will tell you the field name and what was wrong.

---

## Sourcing content

All curriculum data must be cited. Preferred sources:

- **ITF Encyclopedia** — Choi Hong Hi (1999); cite page number where possible.
- **TAGB syllabus** — tagb.co.uk; note the grade the item appears in.
- **HED TKD school curriculum** — HED TKD school grading sheet; flag school-specific
  variations so they can be verified.

Do not invent movements, meanings, or theory answers. If you are unsure of a detail,
leave a `# TODO: verify` comment in the YAML and flag it in the PR description.
