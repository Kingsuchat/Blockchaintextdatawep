import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { ethers } from "ethers";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;

// ABI ของ Smart Contract HelloWorld
const contractABI = [
  "event UpdatedMessages(string oldStr, string newStr)",
  "function message() public view returns (string memory)",
  "function update(string memory newMessage) public"
];

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// **ฟัง Event เมื่อมีการอัปเดตข้อความ**
contract.on("UpdatedMessages", (oldMessage, newMessage) => {
  console.log(`🔄 Message updated from "${oldMessage}" to "${newMessage}"`);
});

// **Route: อัปเดตข้อความลงใน Smart Contract**
app.post("/setMessage", async (req, res) => {
  try {
    const { newMessage } = req.body;
    const tx = await contract.update(newMessage);
    await tx.wait();
    res.json({ success: true, message: "Message updated successfully!" });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// **Route: ดึงข้อความจาก Smart Contract**
app.get("/getMessage", async (req, res) => {
  try {
    const message = await contract.message();
    res.json({ success: true, message });
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
