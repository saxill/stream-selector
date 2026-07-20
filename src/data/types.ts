/** Every piece of copy exists in English and Latin-script Hinglish. */
export type Loc = { en: string; hi: string };

/** branch-id -> how strongly this statement signals that branch */
export type Weights = Record<string, number>;

export type Question = { t: Loc; w: Weights };

export type Specialization = {
  id: string;
  name: Loc;
  desc: Loc;
  careers: string[];
};

export type Major = Specialization & {
  specializations: Specialization[];
};

export type Track = {
  id: string;
  name: Loc;
  tagline: Loc;
  majors: Major[];
  round1Questions: Question[];
  /** major-id -> that major's specialization questions */
  round2Questions: Record<string, Question[]>;
};

export const q = (en: string, hi: string, w: Weights): Question => ({ t: { en, hi }, w });
