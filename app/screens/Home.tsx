import React from "react";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import NoteItem from "../components/NoteItem";

// Kiểu dữ liệu Note
export interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
}

export default function HomeScreen() {
  const notes: Note[] = [
    {
      id: 1,
      title: "Học React Native",
      content: "Ôn lại useState, useEffect",
      date: "28/10/2025",
    },
    {
      id: 2,
      title: "Làm bài thực hành",
      content: "Tạo Note App với SQLite",
      date: "28/10/2025",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Note App</Text>

      <View style={styles.listContainer}>
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <NoteItem note={item} />}
        />
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDFD",
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#333",
  },
  listContainer: {
    flex: 1,
  },
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },
});
