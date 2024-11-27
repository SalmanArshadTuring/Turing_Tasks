import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch"; // Assuming you have a Switch component for toggle

const LeaveRequestForm = ({ onSubmit }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ startDate, endDate, reason, type });
    setStartDate("");
    setEndDate("");
    setReason("");
    setType("");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Request Leave</CardTitle>
        <CardDescription>Fill out the form to request leave</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
            required
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
            required
          />
          <Input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason"
            required
          />
          <Select value={type} onValueChange={setType} required>
            <SelectTrigger>
              <SelectValue placeholder="Leave Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vacation">Vacation</SelectItem>
              <SelectItem value="sick">Sick Leave</SelectItem>
              <SelectItem value="personal">Personal Leave</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full">Submit Request</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const LeaveApprovalSystem = ({ requests, onApprove, onDeny, isAdmin }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Leave Approval System</CardTitle>
        <CardDescription>Manage employee leave requests</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request, index) => (
              <TableRow key={index}>
                <TableCell>{request.employee}</TableCell>
                <TableCell>{request.startDate}</TableCell>
                <TableCell>{request.endDate}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
                  {isAdmin && request.status === "Pending" && (
                    <>
                      <Button onClick={() => onApprove(index)} className="mr-2">Approve</Button>
                      <Button onClick={() => onDeny(index)} variant="destructive">Deny</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const LeaveBalanceTracker = ({ balance }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Leave Balance</CardTitle>
        <CardDescription>Your current leave balance</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Vacation</TableCell>
              <TableCell>{balance.vacation} days</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Sick Leave</TableCell>
              <TableCell>{balance.sick} days</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Personal Leave</TableCell>
              <TableCell>{balance.personal} days</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const NotificationAlert = ({ message }) => {
  return (
    <Alert className="mb-4">
      <AlertTitle>Notification</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default function App() {
  const [requests, setRequests] = useState([]);
  const [balance, setBalance] = useState({ vacation: 15, sick: 10, personal: 5 });
  const [notification, setNotification] = useState("");
  const [isAdmin, setIsAdmin] = useState(true); // Admin toggle state

  const handleLeaveRequest = (request) => {
    const newRequest = { ...request, employee: "John Doe", status: "Pending" };
    setRequests([...requests, newRequest]);
    setNotification("Leave request submitted successfully!");
  };

  const handleApprove = (index) => {
    const updatedRequests = [...requests];
    updatedRequests[index].status = "Approved";
    setRequests(updatedRequests);
    updateLeaveBalance(updatedRequests[index]);
    setNotification("Leave request approved!");
  };

  const handleDeny = (index) => {
    const updatedRequests = [...requests];
    updatedRequests[index].status = "Denied";
    setRequests(updatedRequests);
    setNotification("Leave request denied!");
  };

  const updateLeaveBalance = (request) => {
    const days =
      (new Date(request.endDate) - new Date(request.startDate)) / (1000 * 60 * 60 * 24) + 1;
    setBalance((prevBalance) => ({
      ...prevBalance,
      [request.type]: prevBalance[request.type] - days,
    }));
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Employee Leave Management System</h1>
      
      {/* Admin Toggle Switch */}
      <div className="flex justify-center mb-4">
        <label className="mr-2">Admin:</label>
        <Switch checked={isAdmin} onCheckedChange={() => setIsAdmin(!isAdmin)} />
      </div>

      {notification && <NotificationAlert message={notification} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <LeaveRequestForm onSubmit={handleLeaveRequest} />
        <LeaveBalanceTracker balance={balance} />
      </div>
      <LeaveApprovalSystem
        requests={requests}
        onApprove={handleApprove}
        onDeny={handleDeny}
        isAdmin={isAdmin}
      />
    </div>
  );
}
