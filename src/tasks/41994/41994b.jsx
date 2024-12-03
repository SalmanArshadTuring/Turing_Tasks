import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const LOAN_STATUS = {
  PENDING: "Pending",
  RETURNED: "Returned",
  OVERDUE: "Overdue",
};

const BookLoanForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    title: "",
    borrower: "",
    loanDate: "",
    dueDate: "",
    status: LOAN_STATUS.PENDING,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="title"
        placeholder="Book Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <Input
        name="borrower"
        placeholder="Borrower Name"
        value={formData.borrower}
        onChange={handleChange}
        required
      />
      <Input
        name="loanDate"
        type="date"
        value={formData.loanDate}
        onChange={handleChange}
        required
      />
      <Input
        name="dueDate"
        type="date"
        value={formData.dueDate}
        onChange={handleChange}
        required
      />
      <Select name="status" value={formData.status} onChange={handleChange}>
        {Object.values(LOAN_STATUS).map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </Select>
      <Button type="submit">Submit</Button>
    </form>
  );
};

const LoanList = ({ loans, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Borrower</TableHead>
          <TableHead>Loan Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loans.map((loan, index) => (
          <TableRow key={index}>
            <TableCell>{loan.title}</TableCell>
            <TableCell>{loan.borrower}</TableCell>
            <TableCell>{loan.loanDate}</TableCell>
            <TableCell>{loan.dueDate}</TableCell>
            <TableCell>{loan.status}</TableCell>
            <TableCell>
              <Button onClick={() => onEdit(index)} className="mr-2">
                Edit
              </Button>
              <Button onClick={() => onDelete(index)} variant="destructive">
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const LoanStats = ({ loans }) => {
  const totalLoans = loans.length;
  const overdueLoans = loans.filter((loan) => loan.status === LOAN_STATUS.OVERDUE).length;
  const returnedLoans = loans.filter((loan) => loan.status === LOAN_STATUS.RETURNED).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div>Total Loans: {totalLoans}</div>
          <div>Overdue: {overdueLoans}</div>
          <div>Returned: {returnedLoans}</div>
        </div>
        <div className="mt-4 flex h-20">
          <div
            className="bg-blue-500"
            style={{ width: `${(totalLoans / totalLoans) * 100}%` }}
          ></div>
          <div
            className="bg-red-500"
            style={{ width: `${(overdueLoans / totalLoans) * 100}%` }}
          ></div>
          <div
            className="bg-green-500"
            style={{ width: `${(returnedLoans / totalLoans) * 100}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [loans, setLoans] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState({ status: "", borrower: "" });

  useEffect(() => {
    const storedLoans = localStorage.getItem("bookLoans");
    if (storedLoans) {
      setLoans(JSON.parse(storedLoans));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bookLoans", JSON.stringify(loans));
  }, [loans]);

  const handleSubmit = (formData) => {
    if (editIndex !== null) {
      const updatedLoans = [...loans];
      updatedLoans[editIndex] = formData;
      setLoans(updatedLoans);
      setEditIndex(null);
    } else {
      setLoans([...loans, formData]);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedLoans = loans.filter((_, i) => i !== index);
    setLoans(updatedLoans);
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredLoans = loans.filter((loan) => {
    return (
      (filter.status === "" || loan.status === filter.status) &&
      (filter.borrower === "" || loan.borrower.toLowerCase().includes(filter.borrower.toLowerCase()))
    );
  });

  const exportLoans = () => {
    const dataStr = JSON.stringify(loans, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "book_loans.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Book Loan Tracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Add/Edit Loan</CardTitle>
          </CardHeader>
          <CardContent>
            <BookLoanForm
              onSubmit={handleSubmit}
              initialData={editIndex !== null ? loans[editIndex] : null}
            />
          </CardContent>
        </Card>
        <LoanStats loans={loans} />
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Loan List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-2">
            <Input
              name="borrower"
              placeholder="Filter by borrower"
              value={filter.borrower}
              onChange={handleFilterChange}
            />
            <Select name="status" value={filter.status} onChange={handleFilterChange}>
              <option value="">All Status</option>
              {Object.values(LOAN_STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
            <Button onClick={exportLoans}>Export Loans</Button>
          </div>
          <LoanList loans={filteredLoans} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  );
}