import {
  completeIssue,
  createIssue,
  deleteIssue,
  getIssues,
  updateIssue,
} from "@/utils/githubapi";
import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, TextInput, View } from "react-native";
import TodoItem, { Todo } from "./TodoItem";

const TodoList: React.FC = () => {
  const [todoItem, setTodoItem] = useState<Todo>({
    title: "",
    id: "",
  });
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleComplete = (id: string) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        completeIssue(Number(id), !todo.isClosed);
        todo.isClosed = !todo.isClosed;
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const handleDelete = (id: string) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    deleteIssue(Number(id));
  };

  const handleUpdate = (todo: Todo) => {
    if (todo?.id) {
      const newTodos = todos.map((t) => {
        if (t.id === todo.id) {
          t.title = todo.title;
          updateIssue(Number(todo.id), todo.title);
        }
        return t;
      });
      setTodos(newTodos);
    } else {
      setTodos([...todos, { ...todo, id: (todos.length + 1).toString() }]);
      createIssue(todo.title);
    }
    setTodoItem({
      title: "",
      id: "",
    });
  };

  const getAllIssues = async () => {
    const issues = await getIssues();
    setTodos(issues);
  };

  useEffect(() => {
    getAllIssues();
  }, []);

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TextInput
          placeholder="Add a todo"
          placeholderTextColor={"gray"}
          onChange={(e) => {
            setTodoItem({
              title: e.nativeEvent.text,
              id: todoItem.id,
            });
          }}
          style={{
            flex: 1,
            padding: 5,
            borderBottomWidth: 1,
            borderBottomColor: "black",
          }}
          value={todoItem.title}
        />
        <Button
          title={todoItem?.id !== "" ? "Update Todo" : "Add Todo"}
          onPress={() => {
            if (!todoItem) {
              Alert.alert("Please enter a todo");
              return;
            }
            handleUpdate(todoItem);
          }}
          color={todoItem?.id !== "" ? "" : "green"}
        />
        {todoItem?.id !== "" && (
          <Button
            title="Cancel"
            onPress={() => {
              setTodoItem({
                title: "",
                id: "",
              });
            }}
            color={"red"}
          />
        )}
      </View>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onComplete={handleComplete}
            onDelete={handleDelete}
            onEdit={(todo) => {
              setTodoItem(todo);
            }}
          />
        )}
        style={{
          marginTop: 20,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default TodoList;
