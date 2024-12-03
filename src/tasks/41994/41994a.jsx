import React, { useState, useEffect } from 'react';
import { format, isPast, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


function App() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem('loanBooks');
    return savedBooks ? JSON.parse(savedBooks) : [];
  });
  const [viewFilter, setViewFilter] = useState({ status: 'all', dueDate: 'all' });
  const [newBook, setNewBook] = useState({ title: '', borrower: '', loanDate: format(new Date(), 'yyyy-MM-dd'), dueDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'), status: 'pending' });

  useEffect(() => {
    localStorage.setItem('loanBooks', JSON.stringify(books));
  }, [books]);

  const addBook = () => {
    if (newBook.title && newBook.borrower) {
      setBooks([...books, { ...newBook, id: Date.now() }]);
      setNewBook({ title: '', borrower: '', loanDate: format(new Date(), 'yyyy-MM-dd'), dueDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'), status: 'pending' });
    }
  };

  const updateBook = (id, field, value) => {
    setBooks(books.map(book => book.id === id ? { ...book, [field]: value } : book));
  };

  const deleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const filteredBooks = books.filter(book => 
    (viewFilter.status === 'all' || book.status === viewFilter.status) &&
    (viewFilter.dueDate === 'all' || 
      (viewFilter.dueDate === 'overdue' && isPast(new Date(book.dueDate)))
    )
  );

  const exportBooks = () => {
    const blob = new Blob([JSON.stringify(books, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'book_loans.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-4">Book Loan Tracker</h1>
      
      {/* Add Book Form */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add New Book Loan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input type="text" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} placeholder="Book Title" />
            <Input type="text" value={newBook.borrower} onChange={e => setNewBook({...newBook, borrower: e.target.value})} placeholder="Borrower Name" />
            <Input type="date" value={newBook.loanDate} onChange={e => setNewBook({...newBook, loanDate: e.target.value})} />
            <Input type="date" value={newBook.dueDate} onChange={e => setNewBook({...newBook, dueDate: e.target.value})} />
          </div>
          <Button className="mt-4" onClick={addBook}>Add Book</Button>
        </CardContent>
      </Card>

      {/* Filter Dropdown */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filter Status</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setViewFilter({...viewFilter, status: 'all'})}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setViewFilter({...viewFilter, status: 'pending'})}>Pending</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setViewFilter({...viewFilter, status: 'returned'})}>Returned</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setViewFilter({...viewFilter, status: 'overdue'})}>Overdue</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={exportBooks}>Export Books</Button>
      </div>

      {/* Book List */}
      {filteredBooks.map(book => (
        <BookItem key={book.id} book={book} updateBook={updateBook} deleteBook={deleteBook} />
      ))}

      {/* Visualization */}
      <Visualization books={books} />
    </div>
  );
}

function BookItem({ book, updateBook, deleteBook }) {
  const isOverdue = isPast(new Date(book.dueDate)) && book.status !== 'returned';

  return (
    <Card className="mb-2">
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p>Borrower: {book.borrower}</p>
            <p>Loan Date: {book.loanDate}</p>
            <p>Due Date: <span className={isOverdue ? 'text-red-500' : ''}>{book.dueDate}</span></p>
          </div>
          <div className="flex items-center space-x-2">
            <select value={book.status} onChange={(e) => updateBook(book.id, 'status', e.target.value)} className="p-1 border rounded">
              <option value="pending">Pending</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
            <Button onClick={() => deleteBook(book.id)}>Delete</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Visualization({ books }) {
  const overdueCount = books.filter(book => isPast(new Date(book.dueDate)) && book.status !== 'returned').length;
  const pendingCount = books.filter(book => book.status === 'pending').length;
  const returnedCount = books.filter(book => book.status === 'returned').length;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Loan Trends</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center">
          <div className="w-24">Overdue:</div>
          <div className="h-4 bg-red-500" style={{ width: `${overdueCount * 20}px` }}></div>
        </div>
        <div className="flex items-center">
          <div className="w-24">Pending:</div>
          <div className="h-4 bg-yellow-500" style={{ width: `${pendingCount * 20}px` }}></div>
        </div>
        <div className="flex items-center">
          <div className="w-24">Returned:</div>
          <div className="h-4 bg-green-500" style={{ width: `${returnedCount * 20}px` }}></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default App;