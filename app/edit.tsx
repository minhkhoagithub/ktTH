import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { getNotes, Note, updateNote } from "./database/notesDb";

export default function EditNote() {
  const { id } = useLocalSearchParams(); // lấy id từ URL (?id=...)
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function loadNote() {
       const notes = (await getNotes()) as Note[]; // 👈 ép kiểu rõ ràng
      const note = notes.find((n: Note) => n.id === Number(id)); // 👈 chỉ định n: Note
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      }
    }
    loadNote();
  }, [id]);

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề!");
      return;
    }
    await updateNote(Number(id), title, content);
    Alert.alert("Thành công", "Cập nhật công việc thành công!");
    router.back(); // quay lại danh sách
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Sửa công việc</Text>

      <TextInput
        style={styles.input}
        placeholder="Tiêu đề công việc"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Nội dung"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#2e86de",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
