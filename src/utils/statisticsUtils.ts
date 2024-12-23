export interface Sample {
  count: number;
  total: number;
}

interface ChiSquaredResult {
    chiSquared: number;
    criticalValue: number;
}

export function calculateChiSquared(sample1: Sample, sample2: Sample, confidenceLevel: number): ChiSquaredResult | null {
  if (sample1.total === 0 || sample2.total === 0) {
    return null;
  }

  const pooledProportion = (sample1.count + sample2.count) / (sample1.total + sample2.total);

  const chiSquared = Math.pow(sample1.count - sample1.total * pooledProportion, 2) / (sample1.total * pooledProportion) +
                     Math.pow(sample2.count - sample2.total * pooledProportion, 2) / (sample2.total * pooledProportion);

  const criticalValue = chiSquareCriticalValue(confidenceLevel, 1);

  return {
    chiSquared,
    criticalValue,
  };
}


export function chiSquareCriticalValue(confidenceLevel: number, degreesOfFreedom: number): number {
    // Since we are interested in the upper tail, we need to compute 1 - confidenceLevel
    return inverseChiSquareCDF(confidenceLevel / 100, degreesOfFreedom);
}

function gammaFunction(s: number): number {
    // Lanczos approximation for the gamma function
    const p = [
        676.5203681218851,     -1259.1392167224028,
        771.32342877765313,    -176.61502916214059,
        12.507343278686905,    -0.13857109526572012,
        9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    const g = 7;
    if (s < 0.5) {
        // Reflection formula
        return Math.PI / (Math.sin(Math.PI * s) * gammaFunction(1 - s));
    } else {
        s -= 1;
        let x = 0.99999999999980993;
        for (let i = 0; i < p.length; i++) {
            x += p[i] / (s + i + 1);
        }
        const t = s + g + 0.5;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, s + 0.5) * Math.exp(-t) * x;
    }
}

function lowerIncompleteGamma(s: number, x: number): number {
    // Series expansion for the lower incomplete gamma function
    let sum = 0;
    let term = 1 / s;
    let n = 0;
    while (term > 1e-15) {
        sum += term;
        n += 1;
        term *= x / (s + n);
    }
    return sum * Math.exp(-x + s * Math.log(x));
}

function chiSquareCDF(x: number, k: number): number {
    const s = k / 2;
    return lowerIncompleteGamma(s, x / 2) / gammaFunction(s);
}

function inverseChiSquareCDF(p: number, k: number, tolerance: number = 1e-8, maxIterations: number = 100): number {
    // Bisection method to find inverse CDF
    let lower = 0;
    let upper = 1000; // Adjust upper bound as needed
    let mid;
    for (let i = 0; i < maxIterations; i++) {
        mid = (lower + upper) / 2;
        const cdf = chiSquareCDF(mid, k);
        if (Math.abs(cdf - p) < tolerance) {
            return mid;
        } else if (cdf < p) {
            lower = mid;
        } else {
            upper = mid;
        }
    }
    if (mid === undefined) {
        throw new Error("Failed to compute inverse chi-square CDF");
    }
    return mid; // Return the best estimate
}
