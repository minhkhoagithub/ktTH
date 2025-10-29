// import React from "react";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import HomeScreen from "./screens/Home";

// export default function Index() {
//   return (
//      <SafeAreaProvider>
//       <HomeScreen />
//     </SafeAreaProvider>
//   );
// }

import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { addNote, deleteNote, getNotes, initDb, Note, searchNotes } from "./database/notesDb";

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  async function loadNotes() {
    const data = await getNotes();
    setNotes(data as Note[]);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  useEffect(() => {
    initDb();
    loadNotes();
  }, []);

  // Dùng useFocusEffect để refresh khi quay lại từ trang edit
  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, [])
  );

  async function handleAddNote() {
    if (!title.trim()) return alert("Vui lòng nhập tiêu đề!");
    await addNote(title, content);
    setTitle("");
    setContent("");
    setShowInput(false);
    await loadNotes();
  }

  async function handleSearch(text: string) {
    setSearch(text);
    if (text.trim() === "") {
      await loadNotes();
    } else {
      const result = await searchNotes(text);
      setNotes(result);
    }
  }

  function confirmDelete(id: number) {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa công việc này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            await deleteNote(id);
            await loadNotes();
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Note App</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm ghi chú..."
        value={search}
        onChangeText={handleSearch}
      />
      <TouchableOpacity
  style={styles.trashButton}
  onPress={() => router.push("/trash")}
>
  <Text style={styles.trashButtonText}>🗑 Thùng rác</Text>
</TouchableOpacity>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push({ pathname: "/edit", params: { id: item.id } })}
            onLongPress={() => confirmDelete(item.id)}
          >
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemContent}>{item.content}</Text>
            <Text style={styles.itemDate}>{item.date}</Text>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {showInput && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            placeholder="Nhập tiêu đề..."
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
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
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  trashButton: {
  backgroundColor: "#e74c3c",
  paddingVertical: 10,
  borderRadius: 8,
  alignItems: "center",
  marginBottom: 10,
},
trashButtonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
},
});

