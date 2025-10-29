import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";
import {
    getDeletedNotes,
    Note,
    restoreNote,
    searchDeletedNotes,
} from "./database/notesDb";

export default function TrashScreen() {
  const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  async function loadDeleted() {
    const data = await getDeletedNotes();
    setDeletedNotes(data);
  }

  useEffect(() => {
    loadDeleted();
  }, []);

  async function handleSearch(text: string) {
    setSearch(text);
    if (text.trim() === "") {
      await loadDeleted();
    } else {
      const result = await searchDeletedNotes(text);
      setDeletedNotes(result);
    }
  }

  function confirmRestore(id: number) {
    Alert.alert(
      "Khôi phục ghi chú",
      "Bạn có muốn khôi phục ghi chú này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Khôi phục",
          onPress: async () => {
            await restoreNote(id);
            await loadDeleted();
            Alert.alert("✅", "Ghi chú đã được khôi phục thành công!");
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🗑 Thùng rác</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Tìm trong ghi chú đã xóa..."
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={deletedNotes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onLongPress={() => confirmRestore(item.id)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content}>{item.content}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>⬅ Quay lại</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#e67e22" },
  content: { color: "#555", marginVertical: 4 },
  date: { fontSize: 12, color: "#999", textAlign: "right" },
  backButton: {
    backgroundColor: "#2e86de",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  backText: { color: "#fff", fontWeight: "bold" },
});
