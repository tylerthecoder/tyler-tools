import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import ToolList from './components/ToolList'
import Base64Tool from './components/Base64Tool'
import ChiSquaredTool from './components/ChiSquaredTool'

function App() {
  const [searchTerm, setSearchTerm] = useState('')

  const tools = [
    { name: 'Base64 Encoder/Decoder', path: '/base64' },
    { name: 'Chi-Squared Test', path: '/chi-squared' },
  ]

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Router>
      <div className="App">
        <h1>Tyler's Tools</h1>
        <Routes>
          <Route path="/" element={
            <>
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ToolList tools={filteredTools} />
            </>
          } />
          <Route path="/base64" element={<Base64Tool />} />
          <Route path="/chi-squared" element={<ChiSquaredTool />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
