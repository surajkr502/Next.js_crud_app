"use client";

import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const NotesClient = ({ initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes || []);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const createNote = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Title and Content are required");
      return;
    }

    setLoading(true);

    try {
      const { data: result } = await axios.post("/api/notes", {
        title,
        content,
      });

      if (result.success) {
        setNotes((prev) => [result.data, ...prev]);

        setTitle("");
        setContent("");

        toast.success("Note created successfully");
      }
    } catch (error) {
      console.error("Create Note Error:", error);
      toast.error(
        error.response?.data?.error || "Failed to create note"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setNotes((prev) => prev.filter((note) => note._id !== id));
        toast.success("Note deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete note");
    }
  };

  const updateNote = async (id) => {
    if (!editTitle.trim() || !editContent.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setNotes((prev) =>
          prev.map((note) =>
            note._id === id ? result.data : note
          )
        );

        setEditingId(null);
        setEditTitle("");
        setEditContent("");

        toast.success("Note updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={createNote}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Create New Note
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
            required
          />

          <textarea
            placeholder="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-md"
          >
            {loading ? "Creating..." : "Create Note"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Your Notes ({notes.length})
        </h2>

        {notes.length === 0 ? (
          <p className="text-gray-500">
            No Notes Yet. Create Your First Note Above.
          </p>
        ) : (
          notes.map((note, index) => (
            <div
              key={note?._id?.toString() || index}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              {editingId === note._id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />

                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateNote(note._id)}
                      disabled={loading}
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>

                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">
                      {note.title}
                    </h3>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(note)}
                        className="text-blue-500"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteNote(note._id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-2">
                    {note.content}
                  </p>

                  <p className="text-sm text-gray-500">
                    Created:{" "}
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>

                  {note.updatedAt &&
                    note.updatedAt !== note.createdAt && (
                      <p className="text-sm text-gray-500">
                        Updated:{" "}
                        {new Date(
                          note.updatedAt
                        ).toLocaleDateString()}
                      </p>
                    )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesClient;