"use client";

import { useState } from "react";
import { ScrollView, Platform } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "solito/navigation";
import {
  Box,
  Button,
  ButtonText,
  Input,
  InputField,
  Text,
  useToast,
  Toast,
  ToastTitle,
} from "@app-template/ui";
import { AuthGuard } from "../components/auth-guard";
import { Screen } from "../components/screen";
import { TaskCheckbox } from "../components/task-checkbox";
import { useAuth } from "../auth";
import { getUserFacingErrorMessage } from "../auth/errors";
import { api } from "../db/api";

export function TasksScreen() {
  return (
    <AuthGuard>
      <TasksContent />
    </AuthGuard>
  );
}

function TasksContent() {
  const { token } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const tasks = useQuery(api.tasks.list, token ? { token } : "skip");
  const createTask = useMutation(api.tasks.create);
  const toggleTask = useMutation(api.tasks.toggle);
  const removeTask = useMutation(api.tasks.remove);

  const [title, setTitle] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!token || !title.trim()) return;
    setCreating(true);
    try {
      await createTask({ token, title: title.trim() });
      setTitle("");
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action="success">
            <ToastTitle>Task added</ToastTitle>
          </Toast>
        ),
      });
    } catch (err: unknown) {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>
              {getUserFacingErrorMessage(err, "Failed to add task")}
            </ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (taskId: string) => {
    if (!token) return;
    setPendingId(taskId);
    try {
      await toggleTask({ token, taskId: taskId as never });
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (taskId: string, taskTitle: string) => {
    if (!token) return;
    const confirmed =
      Platform.OS === "web"
        ? globalThis.confirm?.(`Delete "${taskTitle}"?`) ?? true
        : true;
    if (!confirmed) return;

    setPendingId(taskId);
    try {
      await removeTask({ token, taskId: taskId as never });
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action="muted">
            <ToastTitle>Task deleted</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setPendingId(null);
    }
  };

  return (
    <Screen className="flex-1 flex-col bg-background-50">
      <Box className="bg-background-0 border-b border-outline-200 px-6 py-4 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-typography-900">Tasks</Text>
        <Button action="primary" variant="outline" size="md" onPress={() => router.back()}>
          <ButtonText>Back</ButtonText>
        </Button>
      </Box>

      <ScrollView contentContainerStyle={{ padding: 24, maxWidth: 640, width: "100%", alignSelf: "center" }}>
        <Text className="text-typography-500 mb-4">
          A sample Convex feature — add, complete, and delete tasks.
        </Text>

        <Box className="flex-row gap-2 mb-6 items-start">
          <Box className="flex-1">
            <Input variant="outline" size="md" className="flex-1">
              <InputField
                placeholder="New task..."
                value={title}
                onChangeText={setTitle}
                onSubmitEditing={handleCreate}
              />
            </Input>
          </Box>
          <Button
            action="primary"
            size="md"
            isDisabled={creating || !title.trim()}
            onPress={handleCreate}
          >
            <ButtonText>{creating ? "Adding..." : "Add"}</ButtonText>
          </Button>
        </Box>

        {tasks === undefined ? (
          <Text className="text-typography-500">Loading tasks...</Text>
        ) : tasks.length === 0 ? (
          <Text className="text-typography-500">No tasks yet. Add one above.</Text>
        ) : (
          <Box className="gap-3">
            {tasks.map((task) => (
              <Box
                key={task._id}
                className="bg-background-0 border border-outline-200 rounded-2xl p-4 flex-row items-center gap-3"
              >
                <TaskCheckbox
                  checked={task.done}
                  onChange={() => handleToggle(task._id)}
                  accessibilityLabel={`Mark ${task.title} as ${task.done ? "incomplete" : "complete"}`}
                />
                <Text
                  className={`flex-1 text-base ${
                    task.done
                      ? "text-typography-400 line-through"
                      : "text-typography-900"
                  }`}
                >
                  {task.title}
                </Text>
                <Button
                  action="primary"
                  variant="outline"
                  size="sm"
                  isDisabled={pendingId === task._id}
                  onPress={() => handleDelete(task._id, task.title)}
                >
                  <ButtonText>Delete</ButtonText>
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </ScrollView>
    </Screen>
  );
}
