import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Note } from '@/types';
import { CreditCard as Edit3, Trash2, Check, X, Bot, User } from 'lucide-react-native';

// Simple markdown parser for basic formatting
const parseMarkdown = (text: string) => {
  return text
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '•$1•')
    .replace(/__(.*?)__/g, '•$1•')
    // Italic text
    .replace(/\*(.*?)\*/g, '_$1_')
    .replace(/_(.*?)_/g, '_$1_')
    // Headers
    .replace(/^### (.*$)/gm, '📝 $1')
    .replace(/^## (.*$)/gm, '📋 $1')
    .replace(/^# (.*$)/gm, '📌 $1')
    // Code blocks
    .replace(/```(.*?)```/gs, '💻 $1 💻')
    .replace(/`(.*?)`/g, '⚡$1⚡')
    // Lists
    .replace(/^- (.*$)/gm, '• $1')
    .replace(/^\* (.*$)/gm, '• $1')
    .replace(/^\d+\. (.*$)/gm, '🔢 $1')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '🔗 $1')
    // Blockquotes
    .replace(/^> (.*$)/gm, '💬 $1');
};

interface NoteCardProps {
  note: Note;
  onUpdate: (noteId: string, updates: Partial<Note>) => void;
  onDelete: (noteId: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [editedTopic, setEditedTopic] = useState(note.topic);

  const handleSave = () => {
    if (editedContent.trim()) {
      onUpdate(note.id, {
        content: editedContent.trim(),
        topic: editedTopic.trim(),
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(note.content);
    setEditedTopic(note.topic);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete(note.id)
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topicContainer}>
          {isEditing ? (
            <TextInput
              style={styles.topicInput}
              value={editedTopic}
              onChangeText={setEditedTopic}
              placeholder="Topic"
            />
          ) : (
            <Text style={styles.topic}>{note.topic}</Text>
          )}
        </View>
        
        <View style={styles.sourceIndicator}>
          {note.source === 'auto' ? (
            <Bot size={14} color="#8B5CF6" />
          ) : (
            <User size={14} color="#3B82F6" />
          )}
        </View>
      </View>
      <View style={styles.content}>
        {isEditing ? (
          <TextInput
            style={styles.contentInput}
            value={editedContent}
            onChangeText={setEditedContent}
            multiline
            placeholder="Note content"
          />
        ) : (
          <Text style={styles.contentText}>
            {parseMarkdown(note.content)}
          </Text>
        )}
      </View>
      <View style={styles.footer}>
        <Text style={styles.timestamp}>
          {new Date(note.timestamp).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
        <View style={styles.actions}>
          {isEditing ? (
            <>
              <TouchableOpacity onPress={handleCancel} style={styles.actionButton}>
                <X size={18} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.actionButton}>
                <Check size={18} color="#10B981" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.actionButton}>
                <Edit3 size={16} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicContainer: {
    flex: 1,
  },
  topic: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  topicInput: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    paddingVertical: 2,
  },
  sourceIndicator: {
    marginLeft: 8,
  },
  content: {
    marginBottom: 12,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 22,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#1F2937',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
});
