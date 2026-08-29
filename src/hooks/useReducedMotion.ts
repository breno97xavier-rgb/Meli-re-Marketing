import { useState } from 'react';

export function useReducedMotion(): boolean {
  // Always enable rich visual animations by default
  const [matches] = useState<boolean>(false);
  return matches;
}

