import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CheckIcon } from '../components/Icons';
import { colors, withAlpha } from '../theme';
import { Task } from '../types/pomodoro';

interface TasksViewProps {
  size: number;
  tasks: Task[];
  activeTaskId: string;
  accentColor: string;
  onSelectTask: (id: string) => void;
  onToggleTaskDone: (id: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  size,
  tasks,
  activeTaskId,
  accentColor,
  onSelectTask,
  onToggleTaskDone,
}) => {
  const scale = size / 220;

  return (
    <View style={[styles.container, { width: size * 0.78, height: size * 0.62 }]}>
      <Text style={[styles.headerTitle, { fontSize: Math.round(9 * scale) }]}>
        TAREA DE ENFOQUE
      </Text>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingVertical: Math.round(3 * scale) },
        ]}
      >
        {tasks.map((task) => {
          const isSelected = task.id === activeTaskId;
          return (
            <Pressable
              key={task.id}
              onPress={() => onSelectTask(task.id)}
              onLongPress={() => onToggleTaskDone(task.id)}
              style={[
                styles.taskCard,
                {
                  paddingHorizontal: Math.round(8 * scale),
                  paddingVertical: Math.round(5.5 * scale),
                  marginBottom: Math.round(4 * scale),
                  borderColor: isSelected ? accentColor : colors.border,
                  backgroundColor: isSelected
                    ? withAlpha(accentColor, 0.16)
                    : colors.surface,
                },
              ]}
            >
              <View style={styles.taskRow}>
                <Pressable
                  onPress={() => onToggleTaskDone(task.id)}
                  style={[
                    styles.checkCircle,
                    {
                      width: Math.round(15 * scale),
                      height: Math.round(15 * scale),
                      borderRadius: Math.round(7.5 * scale),
                      borderColor: task.done ? colors.mint : accentColor,
                      backgroundColor: task.done ? colors.mint : 'transparent',
                    },
                  ]}
                >
                  {task.done ? (
                    <CheckIcon size={Math.round(10 * scale)} color="#000000" />
                  ) : null}
                </Pressable>

                <Text
                  numberOfLines={1}
                  style={[
                    styles.taskTitle,
                    {
                      fontSize: Math.round(9.5 * scale),
                      textDecorationLine: task.done ? 'line-through' : 'none',
                      color: task.done ? colors.textMute : colors.text,
                    },
                  ]}
                >
                  {task.title}
                </Text>

                <View
                  style={[
                    styles.sessionBadge,
                    {
                      paddingHorizontal: Math.round(4.5 * scale),
                      paddingVertical: Math.round(1 * scale),
                      backgroundColor: withAlpha(accentColor, 0.18),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.sessionBadgeText,
                      { fontSize: Math.round(8 * scale), color: accentColor },
                    ]}
                  >
                    {task.sessions}×
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.textDim,
    fontWeight: '800',
    letterSpacing: 0.9,
    marginBottom: 3,
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    width: '100%',
  },
  taskCard: {
    width: '100%',
    borderRadius: 999,
    borderWidth: 1,
  },
  taskRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  checkCircle: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTitle: {
    flex: 1,
    fontWeight: '600',
  },
  sessionBadge: {
    borderRadius: 999,
  },
  sessionBadgeText: {
    fontWeight: '800',
  },
});
