import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const API_URL = 'http://localhost:8080/api/todos'

  // 초기 데이터 가져오기
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error('Error fetching todos:', err))
  }, [])

  const addTodo = async (e) => {
    e.preventDefault()
    if (inputValue.trim() === '') return

    const newTodo = {
      text: inputValue,
      completed: false,
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      })
      const savedTodo = await res.json()
      setTodos([...todos, savedTodo])
      setInputValue('')
    } catch (err) {
      console.error('Error adding todo:', err)
    }
  }

  const toggleTodo = async (id) => {
    const todoToToggle = todos.find((t) => t.id === id)
    const updatedTodo = { ...todoToToggle, completed: !todoToToggle.completed }

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      })
      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)))
    } catch (err) {
      console.error('Error toggling todo:', err)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      setTodos(todos.filter((t) => t.id !== id))
    } catch (err) {
      console.error('Error deleting todo:', err)
    }
  }

  return (
    <div className="todo-container">
      <h1>Todo List (Full-Stack)</h1>
      <form onSubmit={addTodo} className="todo-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add</button>
      </form>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)} className="delete-btn">
              Delete
            </button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p className="empty-msg">No tasks yet. Add one!</p>}
    </div>
  )
}

export default App
