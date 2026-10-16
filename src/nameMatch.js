function tokens(text) {
  return new Set(
    String(text || "")
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((token) => token.length >= 2)
  );
}

export function nameScore(payerName, narration) {
  const narrationTokens = tokens(narration);
  return [...tokens(payerName)].filter((token) => narrationTokens.has(token)).length;
}

export function isStrongMatch(payerName, narration) {
  const hits = nameScore(payerName, narration);
  return hits >= 2 || (tokens(payerName).size === 1 && hits === 1);
}
