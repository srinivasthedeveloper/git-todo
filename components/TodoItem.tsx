import React from "react";
import { Button, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export interface Todo {
  id: string;
  title: string;
  isClosed?: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onComplete,
  onDelete,
  onEdit,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View
      style={{
        flexDirection: "row",
        display: "flex",
        gap: 10,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.95);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={() => {
          onComplete(todo.id);
        }}
      >
        <Animated.View style={[animatedStyle]}>
          <Text
            style={{
              textDecorationLine: todo?.isClosed ? "line-through" : "none",
              opacity: todo?.isClosed ? 0.5 : 1,
            }}
          >
            {todo.title}
          </Text>
        </Animated.View>
      </Pressable>
      <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
        <Button
          title="Edit"
          onPress={() => {
            onEdit(todo);
          }}
        />
        <Button
          title="Delete"
          onPress={() => {
            onDelete(todo.id);
          }}
          color={"red"}
        />
      </View>
    </View>
  );
};

export default TodoItem;
