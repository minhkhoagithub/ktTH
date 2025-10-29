import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { addNote, getNotes, initDb } from "../database/notesDb";


export interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
}

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const titleRef = useRef<TextInput>(null);
  const contentRef = useRef<TextInput>(null);

  useEffect(() => {
    initDb();
    loadNotes();
  }, []);

  async function loadNotes() {
    const data = await getNotes();
    setNotes(data as Note[]);
  }

  async function handleAddNote() {
    if (!title.trim()) return alert("Vui lòng nhập tiêu đề!");
    await addNote(title, content);
    setTitle("");
    setContent("");
    setShowInput(false);
    await loadNotes();
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Note App</Text>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}
          >
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemContent}>{item.content}</Text>
            <Text style={styles.itemDate}>{item.date}</Text>
          </View>
        )}
      />

      {showInput && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.inputContainer}
        >
          <TextInput
            ref={titleRef}
            style={styles.input}
            placeholder="Nhập tiêu đề công việc..."
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            ref={contentRef}
            style={[styles.input, { height: 80 }]}
            placeholder="Nhập nội dung..."
            value={content}
            onChangeText={setContent}
            multiline
          />
          <TouchableOpacity style={styles.addButton2} onPress={handleAddNote}>
            <Text style={styles.addButtonText2}>Add</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowInput(!showInput)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  header: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginVertical: 16 },
  item: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  itemTitle: { fontSize: 18, fontWeight: "bold", color: "#2e86de" },
  itemContent: { color: "#555", marginVertical: 4 },
  itemDate: { fontSize: 12, color: "#999", textAlign: "right" },

  addButton: {
    position: "absolute",
    bottom: 30,
    right: 25,
    backgroundColor: "#2e86de",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: { fontSize: 30, color: "#fff", fontWeight: "bold" },

  inputContainer: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  addButton2: {
    backgroundColor: "#27ae60",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText2: { color: "#fff", fontWeight: "bold" },
});
