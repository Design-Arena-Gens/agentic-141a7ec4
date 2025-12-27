'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: number
  type: 'user' | 'agent'
  content: string
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      type: 'agent',
      content: "Hello! I'm your command agent. I'm ready to follow your instructions. Tell me what to do!",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isThinking])

  const executeCommand = (command: string): string => {
    const cmd = command.toLowerCase().trim()

    // Math operations
    if (cmd.includes('calculate') || cmd.includes('compute') || cmd.includes('solve')) {
      const numbers = command.match(/\d+/g)
      if (numbers && numbers.length >= 2) {
        const num1 = parseInt(numbers[0])
        const num2 = parseInt(numbers[1])
        if (cmd.includes('add') || cmd.includes('+')) return `${num1} + ${num2} = ${num1 + num2}`
        if (cmd.includes('subtract') || cmd.includes('-')) return `${num1} - ${num2} = ${num1 - num2}`
        if (cmd.includes('multiply') || cmd.includes('*') || cmd.includes('×')) return `${num1} × ${num2} = ${num1 * num2}`
        if (cmd.includes('divide') || cmd.includes('/') || cmd.includes('÷')) return `${num1} ÷ ${num2} = ${num1 / num2}`
      }
    }

    // Time and date
    if (cmd.includes('time') || cmd.includes('clock')) {
      return `The current time is ${new Date().toLocaleTimeString()}`
    }
    if (cmd.includes('date') || cmd.includes('today')) {
      return `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
    }

    // Greetings
    if (cmd.includes('hello') || cmd.includes('hi ') || cmd === 'hi') {
      return "Hello! Great to hear from you. What would you like me to do?"
    }
    if (cmd.includes('how are you')) {
      return "I'm functioning perfectly and ready to execute your commands!"
    }

    // Information commands
    if (cmd.includes('tell me about') || cmd.includes('what is')) {
      const topic = command.split(/tell me about|what is/i)[1]?.trim()
      if (topic) {
        return `${topic} is an interesting topic! I'm a command-following agent, so I can help you with tasks like calculations, generating random numbers, telling time, and executing various commands.`
      }
    }

    // Random number generation
    if (cmd.includes('random number')) {
      const match = cmd.match(/between (\d+) and (\d+)/)
      if (match) {
        const min = parseInt(match[1])
        const max = parseInt(match[2])
        const random = Math.floor(Math.random() * (max - min + 1)) + min
        return `Random number between ${min} and ${max}: ${random}`
      }
      return `Random number: ${Math.floor(Math.random() * 100)}`
    }

    // Countdown
    if (cmd.includes('count to')) {
      const match = cmd.match(/count to (\d+)/)
      if (match) {
        const num = parseInt(match[1])
        if (num <= 20) {
          return Array.from({ length: num }, (_, i) => i + 1).join(', ')
        }
        return `That's a bit too high! I can count to 20 max.`
      }
    }

    // Reverse text
    if (cmd.includes('reverse')) {
      const text = command.split('reverse')[1]?.trim()
      if (text) {
        return `Reversed: ${text.split('').reverse().join('')}`
      }
    }

    // Uppercase/Lowercase
    if (cmd.includes('uppercase') || cmd.includes('capitalize')) {
      const text = command.split(/uppercase|capitalize/i)[1]?.trim()
      if (text) return `UPPERCASE: ${text.toUpperCase()}`
    }
    if (cmd.includes('lowercase')) {
      const text = command.split('lowercase')[1]?.trim()
      if (text) return `lowercase: ${text.toLowerCase()}`
    }

    // Coin flip
    if (cmd.includes('flip a coin') || cmd.includes('coin flip')) {
      return `🪙 ${Math.random() < 0.5 ? 'Heads' : 'Tails'}!`
    }

    // Dice roll
    if (cmd.includes('roll a dice') || cmd.includes('roll dice')) {
      return `🎲 You rolled a ${Math.floor(Math.random() * 6) + 1}!`
    }

    // Motivational
    if (cmd.includes('motivate me') || cmd.includes('inspire me')) {
      const quotes = [
        "You've got this! Every command you give makes you stronger.",
        "Believe in yourself! You're doing amazing.",
        "Success is the sum of small efforts, repeated day in and day out.",
        "The only way to do great work is to love what you do.",
        "Your potential is endless. Keep pushing forward!"
      ]
      return quotes[Math.floor(Math.random() * quotes.length)]
    }

    // Joke
    if (cmd.includes('tell me a joke') || cmd.includes('joke')) {
      const jokes = [
        "Why don't programmers like nature? It has too many bugs.",
        "Why did the AI go to therapy? It had too many neural issues.",
        "What do you call a bot that likes to party? A disco-rd bot!",
        "Why did the robot go on a diet? It had too many bytes!",
        "How do robots eat guacamole? With computer chips!"
      ]
      return jokes[Math.floor(Math.random() * jokes.length)]
    }

    // Clear/reset
    if (cmd.includes('clear') || cmd.includes('reset')) {
      return "CLEAR_MESSAGES"
    }

    // Help
    if (cmd.includes('help') || cmd.includes('what can you do')) {
      return "I can follow many commands! Try: 'calculate 15 + 27', 'tell me the time', 'flip a coin', 'roll a dice', 'random number between 1 and 100', 'count to 10', 'reverse hello', 'tell me a joke', 'motivate me', or ask me about anything!"
    }

    // Default response
    return `Command received: "${command}". I've processed your request! Try asking me to calculate something, tell the time, flip a coin, or type 'help' to see what I can do.`
  }

  const handleSend = () => {
    if (!input.trim() || isThinking) return

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsThinking(true)

    setTimeout(() => {
      const response = executeCommand(input)

      if (response === "CLEAR_MESSAGES") {
        setMessages([
          {
            id: Date.now(),
            type: 'agent',
            content: "Messages cleared! Ready for new commands.",
            timestamp: new Date()
          }
        ])
      } else {
        const agentMessage: Message = {
          id: Date.now() + 1,
          type: 'agent',
          content: response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, agentMessage])
      }

      setIsThinking(false)
    }, 800 + Math.random() * 700)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  const handleExampleClick = (example: string) => {
    setInput(example)
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🤖 Command Agent</h1>
        <p>Your intelligent assistant that follows your every command</p>
      </div>

      <div className="chat-container">
        <div className="messages">
          {messages.map(message => (
            <div key={message.id} className={`message message-${message.type}`}>
              <div className="message-label">
                {message.type === 'user' ? 'You' : 'Agent'}
              </div>
              <div className="message-bubble">
                {message.content}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="message message-agent">
              <div className="message-label">Agent</div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your command here..."
            disabled={isThinking}
          />
          <button onClick={handleSend} disabled={isThinking || !input.trim()}>
            Send
          </button>
        </div>
      </div>

      <div className="examples">
        <h3>💡 Try these commands:</h3>
        <ul>
          <li onClick={() => handleExampleClick('Calculate 42 + 58')}>Calculate 42 + 58</li>
          <li onClick={() => handleExampleClick('Tell me the time')}>Tell me the time</li>
          <li onClick={() => handleExampleClick('Flip a coin')}>Flip a coin</li>
          <li onClick={() => handleExampleClick('Random number between 1 and 100')}>Random number between 1 and 100</li>
          <li onClick={() => handleExampleClick('Tell me a joke')}>Tell me a joke</li>
        </ul>
      </div>
    </div>
  )
}
