import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Select,SelectItem} from "@/components/ui/select"
import {Alert,AlertDescription,AlertTitle} from "@/components/ui/alert"

const initialLeaves = [
  { id: 1, type: 'Annual', days: 21 },
  { id: 2, type: 'Sick', days: 15 },
  { id: 3, type: 'Personal', days: 5 },
];

function LeaveRequestForm({ onRequestSubmit }) {
  const [leaveType, setLeaveType] = useState('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please select start and end dates.');
      return;
    }
    onRequestSubmit({ type: leaveType, start: startDate, end: endDate });
    setStartDate('');
    setEndDate('');
    setError('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Leave</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select id="leaveType" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
              <SelectItem value="Annual">Annual</SelectItem>
              <SelectItem value="Sick">Sick</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
            </Select>

            <Label htmlFor="startDate">Start Date</Label>
            <Input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

            <Label htmlFor="endDate">End Date</Label>
            <Input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function LeaveBalance({ leaves }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Balance</CardTitle>
      </CardHeader>
      <CardContent>
        {leaves.map(leave => (
          <div key={leave.id} className="mb-2">
            <p>{leave.type}: {leave.days} days</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function LeaveApproval({ requests, onApprove, onDeny }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Leave Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          requests.map((req, index) => (
            <div key={index} className="flex items-center justify-between mb-4">
              <div>
                <p>{req.type} Leave</p>
                <p>{req.start} to {req.end}</p>
              </div>
              <div>
                <Button onClick={() => onApprove(index)} className="mr-2">Approve</Button>
                <Button onClick={() => onDeny(index)} variant="destructive">Deny</Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [leaves, setLeaves] = useState(initialLeaves);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const handleRequestSubmit = (request) => {
    setLeaveRequests([...leaveRequests, request]);
    setNotifications([...notifications, { type: 'info', message: 'Leave request submitted!' }]);
  };

  const handleApprove = (index) => {
    const approvedRequest = leaveRequests[index];
    setLeaves(prev => 
      prev.map(leave => leave.type === approvedRequest.type ? { ...leave, days: leave.days - 1 } : leave)
    );
    setLeaveRequests(leaveRequests.filter((_, i) => i !== index));
    setNotifications([...notifications, { type: 'success', message: 'Leave approved!' }]);
  };

  const handleDeny = (index) => {
    setLeaveRequests(leaveRequests.filter((_, i) => i !== index));
    setNotifications([...notifications, { type: 'error', message: 'Leave denied!' }]);
  };

  useEffect(() => {
    const timer = setTimeout(() => setNotifications([]), 5000);
    return () => clearTimeout(timer);
  }, [notifications]);

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">Employee Leave Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <LeaveRequestForm onRequestSubmit={handleRequestSubmit} />
        <LeaveBalance leaves={leaves} />
        <LeaveApproval requests={leaveRequests} onApprove={handleApprove} onDeny={handleDeny} />
      </div>
      <div className="mt-4">
        {notifications.map((note, idx) => (
          <Alert key={idx} variant={note.type === 'error' ? 'destructive' : note.type}>
            <AlertTitle>{note.type === 'error' ? 'Error' : 'Notice'}</AlertTitle>
            <AlertDescription>{note.message}</AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
}