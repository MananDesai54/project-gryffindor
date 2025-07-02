export type Variable = {
  label: string;
};

export const NEW_VARIABLE_ID = "new_variable";

export const VARIABLE_PREFIX = "{{";
export const VARIABLE_SUFFIX = "}}";

export const VARIABLE_REGEX = new RegExp(
  `${VARIABLE_PREFIX}[^${VARIABLE_SUFFIX}]+${VARIABLE_SUFFIX}`,
  "g",
);

export function extractVariables(text: string): Variable[] {
  const matches = text.match(VARIABLE_REGEX);
  if (!matches) return [];

  return matches.map((match) => ({
    label: match.slice(VARIABLE_PREFIX.length, -VARIABLE_SUFFIX.length),
  }));
}

export function getVariableText(variable: Variable): string {
  return `${VARIABLE_PREFIX}${variable.label}${VARIABLE_SUFFIX}`;
}
