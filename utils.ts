/**
 * Calculates the Kendall Tau rank correlation coefficient.
 * @param ranking Array of numbers representing the current order of items. 
 *                The "perfect" order is assumed to be ascending [0, 1, 2, ...].
 * @returns Object containing tau score, number of concordant pairs, and number of discordant pairs.
 */
export function calculateKendallTau(ranking: number[]) {
    const n = ranking.length;
    if (n < 2) return { tau: 1, concordant: 0, discordant: 0, pairs: [] };
  
    let concordant = 0;
    let discordant = 0;
    const pairs: { i: number; j: number; type: 'concordant' | 'discordant' }[] = [];
  
    // Compare every pair of elements
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        // In the perfect reference [0, 1, 2, 3...], i always comes before j if i < j.
        // We check if the relationship holds in the provided ranking.
        
        // Let's assume the values in the array correspond to their "true" index.
        // e.g., ranking = [1, 0, 2] means item 1 is first, item 0 is second.
        
        // Wait, standard definition:
        // Any pair of observations (xi, yi) and (xj, yj), where i < j.
        // Here we are comparing a permutation against the identity permutation [0, 1, 2, 3...]
        
        const val1 = ranking[i];
        const val2 = ranking[j];
        
        // If val1 < val2, they are in correct relative order (Concordant)
        // If val1 > val2, they are in reverse relative order (Discordant)
        if (val1 < val2) {
            concordant++;
            pairs.push({ i: val1, j: val2, type: 'concordant' });
        } else {
            discordant++;
            pairs.push({ i: val1, j: val2, type: 'discordant' });
        }
      }
    }
  
    const totalPairs = (n * (n - 1)) / 2;
    const tau = (concordant - discordant) / totalPairs;
  
    return { 
      tau: parseFloat(tau.toFixed(2)), 
      concordant, 
      discordant,
      pairs
    };
  }
  
  export const TAILWIND_COLORS = {
    primary: '#2563eb',
    secondary: '#475569',
    accent: '#f59e0b',
    danger: '#ef4444',
    success: '#22c55e'
  };
