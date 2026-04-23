import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, query, where, doc, getDoc, setDoc } from "firebase/firestore";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase Config
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "firebase-applet-config.json"), "utf8"));
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "stayflow-secret-key-2024";

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Middleware: Auth Check
const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
};

// --- AUTH APIs ---

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

  try {
    const userRef = doc(db, "users_basic", email);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await setDoc(userRef, { name, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRef = doc(db, "users_basic", email);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return res.status(400).json({ message: "Invalid credentials" });

    const user = userSnap.data();
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: email, name: user.name }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

// --- HOTEL APIs ---

app.get("/api/hotels", async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "hotels"));
    const hotels = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
});

// --- BOOKING APIs ---

app.post("/api/bookings", authenticateToken, async (req, res) => {
  const { hotelId, hotelName, hotelLocation, price, date } = req.body;
  const userId = req.user.id;

  try {
    const bookingData = {
      userId,
      hotelId,
      hotelName,
      hotelLocation,
      price,
      date,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "bookings_basic"), bookingData);
    res.status(201).json({ id: docRef.id, ...bookingData });
  } catch (error) {
    res.status(500).json({ message: "Booking failed" });
  }
});

app.get("/api/my-bookings", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const q = query(collection(db, "bookings_basic"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
