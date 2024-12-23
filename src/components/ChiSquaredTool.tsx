import React, { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { calculateChiSquared, Sample } from '../utils/statisticsUtils'
import styles from './ChiSquaredTool.module.css'

function ChiSquaredTool() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sample1Count, setSample1Count] = useState(searchParams.get('s1c') || '45')
  const [sample1Total, setSample1Total] = useState(searchParams.get('s1t') || '100')
  const [sample2Count, setSample2Count] = useState(searchParams.get('s2c') || '60')
  const [sample2Total, setSample2Total] = useState(searchParams.get('s2t') || '100')
  const [confidenceLevel, setConfidenceLevel] = useState(parseInt(searchParams.get('cl') || '95'))

  const result = useMemo(() => {
    const sample1Numeric: Sample = { count: parseInt(sample1Count) || 0, total: parseInt(sample1Total) || 0 }
    const sample2Numeric: Sample = { count: parseInt(sample2Count) || 0, total: parseInt(sample2Total) || 0 }

    const chiSquaredResult = calculateChiSquared(sample1Numeric, sample2Numeric, confidenceLevel)
    if (chiSquaredResult === null) {
      return null
    } else {
      const { chiSquared, criticalValue } = chiSquaredResult
      const isSignificant = chiSquared > criticalValue
      const interpretation = isSignificant
        ? "There is a statistically significant difference between the samples."
        : "There is no statistically significant difference between the samples."

      return {
        chiSquared,
        criticalValue,
        isSignificant,
        interpretation
      }
    }
  }, [sample1Count, sample1Total, sample2Count, sample2Total, confidenceLevel])

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string, param: string) => {
    setter(value)
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams)
      newParams.set(param, value)
      return newParams
    })
  }

  const handleConfidenceLevelChange = (value: number) => {
    setConfidenceLevel(value)
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams)
      newParams.set('cl', value.toString())
      return newParams
    })
  }

  return (
    <div className={styles.chiSquaredTool}>
      <h2>Chi-Squared Test</h2>
      <form>
        <div className={styles.sampleInput}>
          <label>Sample 1:</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={sample1Count}
            onChange={(e) => handleInputChange(setSample1Count, e.target.value, 's1c')}
            placeholder="Count"
          />
          <label>out of</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={sample1Total}
            onChange={(e) => handleInputChange(setSample1Total, e.target.value, 's1t')}
            placeholder="Total"
          />
        </div>
        <div className={styles.sampleInput}>
          <label>Sample 2:</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={sample2Count}
            onChange={(e) => handleInputChange(setSample2Count, e.target.value, 's2c')}
            placeholder="Count"
          />
          <label>out of</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={sample2Total}
            onChange={(e) => handleInputChange(setSample2Total, e.target.value, 's2t')}
            placeholder="Total"
          />
        </div>
        <div className={styles.confidenceLevel}>
          <label htmlFor="confidenceLevel">Confidence Level: {confidenceLevel}%</label>
          <input
            id="confidenceLevel"
            type="range"
            min="90"
            max="99"
            step="1"
            value={confidenceLevel}
            onChange={(e) => handleConfidenceLevelChange(parseInt(e.target.value))}
          />
        </div>
      </form>
      {result && (
        <div className={styles.results}>
          <h3>Results:</h3>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Chi-squared value:</span>
            <span className={styles.resultValue}>{result.chiSquared.toFixed(4)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Critical value:</span>
            <span className={styles.resultValue}>{result.criticalValue.toFixed(4)}</span>
          </div>
          <div className={`${styles.interpretation} ${result.isSignificant ? styles.significant : styles.notSignificant}`}>
            {result.interpretation}
          </div>
        </div>
      )}
      <Link to="/" className={styles.backLink}>Back to Tools</Link>
    </div>
  )
}

export default ChiSquaredTool