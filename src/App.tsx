import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ฟังก์ชันดึงข้อความจาก Smart Contract
  const fetchMessage = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.get("http://localhost:5000/getMessage");
      setMessage(response.data.message);
    } catch (err) {
      console.error("Error fetching message:", err);
      setError("Error fetching data.");
    }
    setLoading(false);
  };

  // ฟังก์ชันอัปเดตข้อความไปยัง Smart Contract
  const updateMessage = async () => {
    if (!newMessage.trim()) {
      setError("Message cannot be empty!");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post("http://localhost:5000/setMessage", { newMessage });
      setSuccess("Message updated successfully!");
      setNewMessage("");
      fetchMessage(); // รีโหลดข้อมูลใหม่หลังอัปเดต
    } catch (err) {
      console.error("Error updating message:", err);
      setError("Error updating data.");
    }
    setLoading(false);
  };

  // โหลดข้อความอัตโนมัติเมื่อหน้าเว็บโหลด
  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <div className="container">
      <h1>Smart Contract Message</h1>

      {/* แสดงสถานะโหลดข้อมูล */}
      {loading && <p>Loading...</p>}

      {/* แสดงข้อความที่ดึงมาจาก Smart Contract */}
      {message && (
        <div className="api-response">
          <h3>Stored Message:</h3>
          <p>{message}</p>
        </div>
      )}

      {/* แสดงข้อความแจ้งเตือน (Error / Success) */}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {/* กล่องใส่ข้อความใหม่ และปุ่มอัปเดต */}
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter new message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="input-box"
        />
        <button onClick={updateMessage} className="update-button">
          Update Message
        </button>
      </div>

      {/* ปุ่มรีโหลดข้อความ */}
      <button onClick={fetchMessage} className="fetch-button">
        Refresh Message
      </button>
    </div>
  );
}

export default App;
