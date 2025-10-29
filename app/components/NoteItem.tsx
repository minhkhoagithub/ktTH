import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Note } from "../screens/Home";

interface Props {
  note: Note;
}

export default function NoteItem({ note }: Props) {
  return (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.content}>{note.content}</Text>
      <Text style={styles.date}>{note.date}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e86de",
  },
  content: {
    fontSize: 15,
    color: "#555",
    marginVertical: 4,
  },
  date: {
    fontSize: 13,
    color: "#999",
    textAlign: "right",
  },
});
