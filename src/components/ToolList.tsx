import { Link } from 'react-router-dom'

interface Tool {
  name: string
  path: string
}

interface ToolListProps {
  tools: Tool[]
}

function ToolList({ tools }: ToolListProps) {
  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool.path}>
          <Link to={tool.path}>{tool.name}</Link>
        </li>
      ))}
    </ul>
  )
}

export default ToolList