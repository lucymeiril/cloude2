package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:5173") // Vite 기본 포트 허용
public class TodoController {
    private final ConcurrentHashMap<Long, Todo> todos = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong();

    @GetMapping
    public List<Todo> getAllTodos() {
        return new ArrayList<>(todos.values());
    }

    @PostMapping
    public Todo addTodo(@RequestBody Todo todo) {
        Long id = idCounter.incrementAndGet();
        todo.setId(id);
        todos.put(id, todo);
        return todo;
    }

    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        Todo todo = todos.get(id);
        if (todo != null) {
            todo.setText(todoDetails.getText());
            todo.setCompleted(todoDetails.isCompleted());
        }
        return todo;
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todos.remove(id);
    }
}
