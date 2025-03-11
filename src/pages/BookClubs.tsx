import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function BookClub() {
  const [books, setBooks] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", discussion: "What are your thoughts on Gatsby’s pursuit of the American Dream?", comments: [] },
    { id: 2, title: "1984", author: "George Orwell", discussion: "How relevant is Orwell’s vision in today’s world?", comments: [] },
  ]);

  const [newBook, setNewBook] = useState({ title: "", author: "", discussion: "" });

  const handleBookSubmit = () => {
    if (newBook.title.trim() && newBook.author.trim() && newBook.discussion.trim()) {
      setBooks([...books, { ...newBook, id: books.length + 1, comments: [] }]);
      setNewBook({ title: "", author: "", discussion: "" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📖 Book Club</h1>
      <p className="text-gray-600 mb-6">Join discussions on books and share your insights!</p>

      {/* Add New Book Discussion */}
      <Card className="mb-6 p-4 shadow-lg">
        <CardContent>
          <h2 className="text-lg font-semibold">Suggest a Book</h2>
          <Input
            placeholder="Book Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            className="mt-2"
          />
          <Input
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            className="mt-2"
          />
          <Textarea
            placeholder="Discussion Topic"
            value={newBook.discussion}
            onChange={(e) => setNewBook({ ...newBook, discussion: e.target.value })}
            className="mt-2"
          />
          <Button onClick={handleBookSubmit} className="mt-2">
            Add Book
          </Button>
        </CardContent>
      </Card>

      {/* Book Discussion List */}
      {books.map((book) => (
        <Card key={book.id} className="mb-4 p-4 shadow-md">
          <CardContent>
            <h3 className="text-lg font-semibold">{book.title} - {book.author}</h3>
            <p className="text-gray-700 italic">Discussion: {book.discussion}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}






