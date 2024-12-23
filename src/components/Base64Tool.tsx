import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import styles from './Base64Tool.module.css'

function Base64Tool() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [input, setInput] = useState(searchParams.get('input') || '')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>(searchParams.get('mode') as 'encode' | 'decode' || 'encode')

  const handleInputChange = (value: string) => {
    setInput(value)
    setSearchParams({ input: value, mode })
  }

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode)
    setSearchParams({ input, mode: newMode })
  }

  const handleEncode = () => {
    setOutput(btoa(input))
  }

  const handleDecode = () => {
    try {
      setOutput(atob(input))
    } catch (error) {
      setOutput('Invalid Base64 input')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mode === 'encode' ? handleEncode() : handleDecode()
  }

  return (
    <div className={styles.base64Tool}>
      <h2>Base64 Encoder/Decoder</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputArea}>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter text to encode or decode"
          />
        </div>
        <div className={styles.modeSelection}>
          <label>
            <input
              type="radio"
              value="encode"
              checked={mode === 'encode'}
              onChange={() => handleModeChange('encode')}
            />
            Encode
          </label>
          <label>
            <input
              type="radio"
              value="decode"
              checked={mode === 'decode'}
              onChange={() => handleModeChange('decode')}
            />
            Decode
          </label>
        </div>
        <button type="submit">{mode === 'encode' ? 'Encode' : 'Decode'}</button>
      </form>
      <div className={styles.results}>
        <h3>Result:</h3>
        <pre>{output}</pre>
      </div>
      <Link to="/" className={styles.backLink}>Back to Tools</Link>
    </div>
  )
}

export default Base64Tool