"use client";

import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Database, Server, Layout, Zap, Search, RefreshCw, Trash2, Key, Layers,
  Settings, Activity, Globe, Shield, Rocket, Sparkles, Terminal, FileCode,
  Box, Workflow, List, HardDrive, Cpu, ShieldCheck, Check, Copy,
  ChevronLeft, ChevronRight, Play, Eye, AlertCircle, Target, FastForward,
  Link as LinkIcon, Lock as LockIcon, Globe2, Cloud, ArrowRight,
} from 'lucide-react';

/* ─── SLIDE DATA ─────────────────────────────────────────────────── */
interface Slide {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  accent: string;
  bg: string;
  content: string[];
  lab: string;
  syntax: string;
  code: string;
  icon: React.ElementType;
}

const slides: Slide[] = [
  {
    id: "00", title: "The Memory Vault", subtitle: "Why Databases Exist",
    tag: "Overview", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "A database persists data beyond a single server session",
      "Without a DB, all data vanishes when the server restarts",
      "CRUD — Create, Read, Update, Delete — the four operations",
      "Every app you use (Instagram, Spotify) runs on databases",
    ],
    lab: "If you build a chat app, what 3 data points MUST be stored in a DB?",
    syntax: `// Without DB: data lives in RAM (lost on restart)\nconst users = []; // ❌ gone on crash\n\n// With DB: data persists\nawait User.create(...); // ✅ permanent`,
    code: `// What a database gives you:\n\n// 1. Persistence — data survives restarts\n// 2. Querying   — find exactly what you need\n// 3. Integrity  — enforce rules on data shape\n// 4. Scale      — handle millions of records\n// 5. Backup     — point-in-time recovery\n\n// The three most common databases:\n//   MongoDB    → NoSQL / Document\n//   PostgreSQL → SQL / Relational\n//   Redis      → In-memory / Cache\n\nconsole.log("Data lives here forever.");`,
    icon: Database,
  },
  {
    id: "01", title: "SQL vs NoSQL", subtitle: "Choosing a Paradigm",
    tag: "Concepts", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    content: [
      "SQL — rigid tables with fixed columns (PostgreSQL, MySQL)",
      "NoSQL — flexible JSON documents (MongoDB, DynamoDB)",
      "SQL enforces strict relationships and constraints",
      "NoSQL favours speed of development and horizontal scale",
    ],
    lab: "Is a social media post better stored as a Table row or a JSON Document?",
    syntax: `/* SQL: fixed schema */\n| id | name  | email           |\n\n/* NoSQL: flexible document */\n{ name: "Ratha", email: "r@dev.pw" }`,
    code: `/* SQL Table — every row has the same columns */\nCREATE TABLE users (\n  id    SERIAL PRIMARY KEY,\n  name  VARCHAR(100) NOT NULL,\n  email VARCHAR(255) UNIQUE NOT NULL\n);\n\n/* MongoDB Document — each can differ */\n{\n  "_id":   ObjectId("65e9b8f1a2b3"),\n  "name":  "Ratha",\n  "email": "r@dev.pw",\n  "socials": {           // nested object — no SQL equivalent!\n    "twitter": "@ratha",\n    "github":  "ratha-dev"\n  },\n  "skills": ["Node", "React", "MongoDB"] // embedded array!\n}`,
    icon: Layers,
  },
  {
    id: "02", title: "Why MongoDB?", subtitle: "The Modern Standard",
    tag: "Concepts", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Stores data as BSON — binary JSON, exactly like JS objects",
      "Dynamic schema — add fields to one doc without touching others",
      "Horizontal sharding — split data across many servers",
      "Powers Twitter, Uber, Forbes, and Adobe at scale",
    ],
    lab: "Research the MERN stack and explain what the 'M' stands for.",
    syntax: `// MERN Stack:\n// M — MongoDB\n// E — Express\n// R — React\n// N — Node.js`,
    code: `// MongoDB speaks native JavaScript\n\n// Your JS object:\nconst post = {\n  title:   "Hello World",\n  author:  "Ratha",\n  tags:    ["tech", "web"],\n  views:   0,\n  created: new Date(),\n};\n\n// Saved to MongoDB as-is — no translation!\nawait Post.create(post);\n\n// Read back — exactly the same shape\nconst found = await Post.findOne({ title: "Hello World" });\nconsole.log(found.tags); // ["tech", "web"]`,
    icon: Globe,
  },
  {
    id: "03", title: "Document Structure", subtitle: "The Anatomy of Data",
    tag: "Concepts", tagColor: "#a78bfa", accent: "#8b5cf6",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(139,92,246,0.12) 0%, transparent 60%)",
    content: [
      "A Document is the basic unit of storage — like a row in SQL",
      "Documents within the same collection can have different fields",
      "Values can be strings, numbers, booleans, arrays, or nested objects",
      "The _id field is always present and uniquely identifies the document",
    ],
    lab: "Create a JSON object representing your favourite movie with at least 4 fields.",
    syntax: `// Document = JSON object stored in MongoDB\n{ "key": value, "nested": { "key": value } }`,
    code: `// A complete MongoDB document\n{\n  "_id":    ObjectId("65e9b8f1a2b3c4d5e6f7a8b9"),\n  "title":  "Inception",\n  "year":   2010,\n  "rating": 8.8,\n  "genres": ["Action", "Sci-Fi", "Thriller"],\n  "director": {\n    "name":      "Christopher Nolan",\n    "birthYear": 1970\n  },\n  "cast": [\n    { "actor": "Leonardo DiCaprio", "role": "Dom Cobb" },\n    { "actor": "Ken Watanabe",      "role": "Saito"    }\n  ],\n  "createdAt": ISODate("2024-01-15T10:00:00Z")\n}`,
    icon: Layout,
  },
  {
    id: "04", title: "MongoDB Atlas", subtitle: "Cloud Database",
    tag: "Setup", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 25% 55%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Atlas is the officially managed cloud MongoDB service",
      "Handles backups, security patches, and performance tuning",
      "Free M0 tier — perfect for learning and side projects",
      "You get a connection string starting with mongodb+srv://",
    ],
    lab: "Sign up for MongoDB Atlas and create your first free cluster.",
    syntax: `mongodb+srv://<user>:<password>@cluster0.abc.mongodb.net/<dbname>`,
    code: `// .env\nMONGO_URI=mongodb+srv://admin:pass@cluster0.abc.mongodb.net/myapp\n\n// Connect in Node.js with Mongoose:\nconst mongoose = require('mongoose');\n\nasync function connectDB() {\n  try {\n    await mongoose.connect(process.env.MONGO_URI);\n    console.log("✅ MongoDB Atlas connected!");\n  } catch (err) {\n    console.error("❌ Connection failed:", err.message);\n    process.exit(1);\n  }\n}\n\nconnectDB();`,
    icon: Globe2,
  },
  {
    id: "05", title: "Collections", subtitle: "Grouping Documents",
    tag: "Concepts", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 70% 60%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: [
      "A Collection groups related documents — like a folder of files",
      "Database → Collection → Document (the three-level hierarchy)",
      "Collections are created automatically when you insert a document",
      "Naming convention: lowercase plural (users, products, orders)",
    ],
    lab: "For an e-commerce site, list 5 collections you would need.",
    syntax: `// Hierarchy:\n// myapp (database)\n//   users       (collection)\n//   products    (collection)\n//   orders      (collection)`,
    code: `// E-commerce database structure:\n\n// myshop/users\n{ name: "Ratha", email: "r@dev.pw", role: "customer" }\n\n// myshop/products\n{ name: "Laptop", price: 999, stock: 50, category: "tech" }\n\n// myshop/orders\n{\n  customerId: ObjectId("65e..."),\n  items: [{ productId: ObjectId("..."), qty: 1 }],\n  total: 999,\n  status: "shipped"\n}\n\n// myshop/reviews\n{ productId: ObjectId("..."), rating: 5, body: "Great!" }`,
    icon: List,
  },
  {
    id: "06", title: "The _id Field", subtitle: "Unique Identity",
    tag: "Concepts", tagColor: "#fb7185", accent: "#f43f5e",
    bg: "radial-gradient(ellipse at 40% 25%, rgba(244,63,94,0.12) 0%, transparent 60%)",
    content: [
      "Every MongoDB document must have a unique _id field",
      "MongoDB auto-generates an ObjectId if you don't provide one",
      "ObjectId is a 24-character hex string — globally unique",
      "It encodes: timestamp + machine ID + process ID + counter",
    ],
    lab: "Why is it a catastrophe if two different users share the same _id?",
    syntax: `ObjectId("65e9b8f1a2b3c4d5e6f7a8b9")\n//         ^^^^^^^^ = timestamp (creation time!)`,
    code: `const mongoose = require('mongoose');\n\n// MongoDB generates this automatically:\nconst id = new mongoose.Types.ObjectId();\nconsole.log(id.toString());\n// "65e9b8f1a2b3c4d5e6f7a8b9" (24 hex chars)\n\n// Extract creation time from ObjectId:\nconsole.log(id.getTimestamp());\n// 2024-03-07T08:00:01.000Z\n\n// Every document gets one:\n{\n  "_id": ObjectId("65e9b8f1a2b3c4d5e6f7a8b9"), // auto!\n  "name": "Admin"\n}`,
    icon: Key,
  },
  {
    id: "07", title: "Mongoose", subtitle: "The ODM Layer",
    tag: "Mongoose", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 55% 65%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Mongoose is an Object Document Mapper for Node.js + MongoDB",
      "Adds Schema validation so broken data can't enter the DB",
      "Provides a clean API: Model.find(), .create(), .findById()",
      "Handles type casting — converts '10' (string) to 10 (number)",
    ],
    lab: "Explain why you'd want 'rules' on a theoretically 'flexible' database.",
    syntax: `npm install mongoose\n\nmongoose.connect(process.env.MONGO_URI);`,
    code: `const mongoose = require('mongoose');\n\n// 1. Connect\nawait mongoose.connect(process.env.MONGO_URI);\n\n// 2. Define a schema (the rules)\nconst userSchema = new mongoose.Schema({\n  name:  String,\n  email: String,\n  score: Number,\n});\n\n// 3. Create a model (the tool)\nconst User = mongoose.model('User', userSchema);\n\n// 4. Use it!\nconst user = await User.create({ name: "Ratha", email: "r@dev.pw", score: 0 });\nconsole.log(user._id); // MongoDB auto-generated`,
    icon: Zap,
  },
  {
    id: "08", title: "Schema Basics", subtitle: "The Blueprint",
    tag: "Mongoose", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 20% 40%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: [
      "A Schema defines the shape and rules for documents",
      "Prevents a 'price' field from accidentally storing a string",
      "Schema types: String, Number, Boolean, Date, Array, ObjectId",
      "Schemas are the contract between your app and MongoDB",
    ],
    lab: "Write a schema for a 'Student' with name, age, and email fields.",
    syntax: `const schema = new mongoose.Schema({\n  field: Type,\n  field: { type: Type, options... }\n});`,
    code: `const mongoose = require('mongoose');\nconst { Schema } = mongoose;\n\nconst productSchema = new Schema({\n  name:        String,\n  description: String,\n  price:       Number,\n  inStock:     Boolean,\n  tags:        [String],        // array of strings\n  createdAt:   Date,\n  seller: {\n    name:  String,\n    email: String,\n  },                            // nested object\n});\n\nconst Product = mongoose.model('Product', productSchema);\n\n// Mongoose ensures 'price' is always a Number:\nawait Product.create({ name: "Laptop", price: "999" });\n//                                           ^^^^^ cast to 999 (number)`,
    icon: FileCode,
  },
  {
    id: "09", title: "Data Types", subtitle: "Primitive Rules",
    tag: "Mongoose", tagColor: "#22d3ee", accent: "#06b6d4",
    bg: "radial-gradient(ellipse at 65% 35%, rgba(6,182,212,0.12) 0%, transparent 60%)",
    content: [
      "String — text values, with optional trim and lowercase",
      "Number — integers and floats (no separate types)",
      "Boolean — true or false",
      "Date — stored as ISODate; use Date.now as a default",
    ],
    lab: "What Mongoose type would you use for 'isSubscribed'?",
    syntax: `String | Number | Boolean | Date\nBuffer | Mixed | ObjectId | Array`,
    code: `const itemSchema = new mongoose.Schema({\n  // Primitives\n  title:      { type: String,  trim: true },\n  price:      { type: Number,  min: 0 },\n  discount:   { type: Number,  max: 100 },\n  available:  { type: Boolean },\n  releaseDate:{ type: Date },\n\n  // Special types\n  thumbnail:  { type: Buffer },       // raw binary\n  extra:      { type: mongoose.Schema.Types.Mixed }, // anything\n  owner:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },\n\n  // Arrays\n  tags:       [String],\n  ratings:    [Number],\n  comments:   [{ body: String, author: String }],\n});`,
    icon: Settings,
  },
  {
    id: "10", title: "Required & Validation", subtitle: "Field Strictness",
    tag: "Mongoose", tagColor: "#4ade80", accent: "#22c55e",
    bg: "radial-gradient(ellipse at 35% 60%, rgba(34,197,94,0.12) 0%, transparent 60%)",
    content: [
      "required: true — blocks the save if the field is missing",
      "Mongoose throws a ValidationError with a clear message",
      "min / max — numeric range validation",
      "minlength / maxlength — string length validation",
    ],
    lab: "Mark 'email' as required and validate its minimum length is 5.",
    syntax: `name: { type: String, required: [true, 'Name is required!'] }`,
    code: `const userSchema = new mongoose.Schema({\n  name: {\n    type:     String,\n    required: [true, 'Name is required'],\n    minlength: [2, 'Name too short'],\n    maxlength: 100,\n    trim:      true,\n  },\n  age: {\n    type: Number,\n    min:  [0,   'Age cannot be negative'],\n    max:  [150, 'Unlikely age'],\n  },\n  email: {\n    type:     String,\n    required: true,\n    unique:   true,\n    lowercase: true,\n  },\n});\n\n// If 'name' is missing:\ntry {\n  await User.create({ email: "x@x.com" });\n} catch (err) {\n  console.log(err.message); // "Name is required"\n}`,
    icon: ShieldCheck,
  },
  {
    id: "11", title: "Defaults & Enums", subtitle: "Sensible Presets",
    tag: "Mongoose", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 70% 50%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "default — auto-fills a field when no value is provided",
      "Use Date.now (without parentheses) for timestamp defaults",
      "enum — restricts a string to a specific list of values",
      "Prevents typos like 'Admun' instead of 'admin'",
    ],
    lab: "Create an enum for 'difficulty' with values: easy, medium, hard.",
    syntax: `role:   { type: String, default: 'student' }\nstatus: { type: String, enum: ['active', 'banned'] }`,
    code: `const userSchema = new mongoose.Schema({\n  // Defaults\n  role:      { type: String,  default: 'student' },\n  score:     { type: Number,  default: 0 },\n  joined:    { type: Date,    default: Date.now },   // no ()\n  active:    { type: Boolean, default: true },\n\n  // Enum — only these values allowed\n  status: {\n    type:    String,\n    enum:    ['pending', 'active', 'suspended'],\n    default: 'pending',\n  },\n\n  plan: {\n    type: String,\n    enum: {\n      values:  ['free', 'pro', 'enterprise'],\n      message: '{VALUE} is not a valid plan',\n    },\n  },\n});`,
    icon: RefreshCw,
  },
  {
    id: "12", title: "Timestamps", subtitle: "Automatic Time Tracking",
    tag: "Mongoose", tagColor: "#c084fc", accent: "#a855f7",
    bg: "radial-gradient(ellipse at 25% 35%, rgba(168,85,247,0.12) 0%, transparent 60%)",
    content: [
      "Pass { timestamps: true } as the second Schema argument",
      "Mongoose auto-adds createdAt and updatedAt fields",
      "updatedAt is refreshed automatically on every save()",
      "Saves you from manually tracking dates in every schema",
    ],
    lab: "Enable timestamps on your 'Post' schema and verify createdAt is set.",
    syntax: `new Schema({ ... }, { timestamps: true });\n// Adds: createdAt, updatedAt automatically`,
    code: `const postSchema = new mongoose.Schema(\n  {\n    title:     { type: String, required: true },\n    body:      { type: String, required: true },\n    published: { type: Boolean, default: false },\n  },\n  { timestamps: true } // ← second argument\n);\n\n// Saved document will have:\n{\n  "_id":       ObjectId("..."),\n  "title":     "Hello World",\n  "body":      "My first post",\n  "published": false,\n  "createdAt": ISODate("2024-01-15T08:00:00Z"), // auto!\n  "updatedAt": ISODate("2024-01-15T08:00:00Z"), // auto!\n}`,
    icon: Activity,
  },
  {
    id: "13", title: "Mongoose Models", subtitle: "The Active Tool",
    tag: "Mongoose", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 55% 30%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: [
      "A Model is a class built from a Schema — your DB interface",
      "It provides all CRUD methods: find, create, update, delete",
      "Model name 'Post' → collection 'posts' (auto-pluralised)",
      "Always capitalise model names: User, Post, Product, Order",
    ],
    lab: "If the model name is 'Category', what will the collection be called?",
    syntax: `const User = mongoose.model('User', userSchema);\n// model name ↑  →  collection: 'users'`,
    code: `// Define Schema\nconst taskSchema = new mongoose.Schema(\n  { title: String, done: { type: Boolean, default: false } },\n  { timestamps: true }\n);\n\n// Create Model\nconst Task = mongoose.model('Task', taskSchema);\n// ↑ Maps to the 'tasks' collection automatically\n\n// Now use the model anywhere in your app:\nconst all    = await Task.find();\nconst one    = await Task.findById(id);\nconst task   = await Task.create({ title: "Learn Mongoose" });\nconst updated = await Task.findByIdAndUpdate(id, { done: true });\nawait Task.findByIdAndDelete(id);`,
    icon: Box,
  },
  {
    id: "14", title: "Create Documents", subtitle: "Inserting Data",
    tag: "CRUD", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 40% 65%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Model.create($data) — inserts and returns the saved document",
      "All DB operations are async — always use await",
      "The returned document includes the auto-generated _id",
      "Use try/catch to handle validation and duplicate key errors",
    ],
    lab: "Write code to create a new User with name 'Steve' and email 's@jobs.com'.",
    syntax: `const doc = await Model.create({ field: value });\nconsole.log(doc._id); // auto-generated`,
    code: `// Single create\nconst user = await User.create({\n  name:  "Steve",\n  email: "s@jobs.com",\n  score: 0,\n});\nconsole.log(user._id);    // ObjectId auto-set\nconsole.log(user.joined); // Date.now default applied\n\n// Bulk insert\nconst users = await User.insertMany([\n  { name: "Alice", email: "a@test.com" },\n  { name: "Bob",   email: "b@test.com" },\n]);\nconsole.log(\`Inserted \${users.length} users\`);\n\n// Or: new + save pattern\nconst task = new Task({ title: "Ship it" });\ntask.priority = "high"; // add fields before saving\nawait task.save();`,
    icon: Zap,
  },
  {
    id: "15", title: "Read — Find All", subtitle: "Fetching Lists",
    tag: "CRUD", tagColor: "#60a5fa", accent: "#3b82f6",
    bg: "radial-gradient(ellipse at 65% 25%, rgba(59,130,246,0.12) 0%, transparent 60%)",
    content: [
      "Model.find() — returns all documents as an array",
      "Model.find({ filter }) — returns documents matching the filter",
      "find() always returns an array (empty [] if nothing matches)",
      "Chain .sort(), .limit(), .select() to refine results",
    ],
    lab: "Fetch all users whose 'active' field is true.",
    syntax: `const docs = await Model.find();\nconst filtered = await Model.find({ field: value });`,
    code: `// Get all users\nconst allUsers = await User.find();\n\n// Get only active users\nconst active = await User.find({ active: true });\n\n// Select specific fields (projection)\nconst names = await User.find({}, 'name email -_id');\n\n// Sort + limit\nconst top5 = await User\n  .find({ active: true })\n  .sort({ score: -1 })   // highest score first\n  .limit(5);\n\n// Count documents\nconst total = await User.countDocuments({ active: true });\nconsole.log(\`\${total} active users\`);`,
    icon: Search,
  },
  {
    id: "16", title: "Read — Find One", subtitle: "Precise Retrieval",
    tag: "CRUD", tagColor: "#a78bfa", accent: "#8b5cf6",
    bg: "radial-gradient(ellipse at 25% 60%, rgba(139,92,246,0.12) 0%, transparent 60%)",
    content: [
      "Model.findById(id) — fetch a single document by its _id",
      "Model.findOne({ filter }) — returns the first match",
      "Both return null (not an error) if the document doesn't exist",
      "Always check for null before accessing the result",
    ],
    lab: "Write a route that takes an id from the URL and returns that user.",
    syntax: `const doc = await Model.findById(id);\nif (!doc) return res.status(404).json({ error: "Not found" });`,
    code: `// Find by ID\nconst user = await User.findById(req.params.id);\n\nif (!user) {\n  return res.status(404).json({ error: "User not found" });\n}\n\nres.json(user);\n\n// Find by any field\nconst byEmail = await User.findOne({ email: req.body.email });\n\n// findOne returns null if nothing matches\nconst missing = await User.findOne({ name: "Nobody" });\nconsole.log(missing); // null  ← not an error!\n\n// findById with selected fields\nconst slim = await User.findById(id).select('name email score');`,
    icon: Target,
  },
  {
    id: "17", title: "Comparison Operators", subtitle: "Advanced Filters",
    tag: "Querying", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 70% 55%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "$gt / $lt — greater than / less than",
      "$gte / $lte — greater-or-equal / less-or-equal",
      "$ne — not equal to a value",
      "$in — value must be in a given array",
    ],
    lab: "Find all products with price greater than 100 and less than 500.",
    syntax: `{ price: { $gt: 100 } }\n{ age: { $gte: 18, $lte: 65 } }`,
    code: `// Greater than\nconst expensive = await Product.find({ price: { $gt: 100 } });\n\n// Range query\nconst midRange = await Product.find({\n  price: { $gte: 50, $lte: 200 },\n});\n\n// Not equal\nconst notBanned = await User.find({ status: { $ne: 'banned' } });\n\n// In a list\nconst staff = await User.find({\n  role: { $in: ['admin', 'moderator', 'editor'] },\n});\n\n// Not in a list\nconst regular = await User.find({\n  role: { $nin: ['admin', 'moderator'] },\n});`,
    icon: Activity,
  },
  {
    id: "18", title: "Logical Operators", subtitle: "Combining Conditions",
    tag: "Querying", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 40% 30%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: [
      "$or — at least one condition must match",
      "$and — all conditions must match (usually implicit)",
      "$nor — none of the conditions must match",
      "$not — inverts the effect of a sub-expression",
    ],
    lab: "Find users who are either 'admin' OR 'moderator'.",
    syntax: `{ $or: [{ cond1 }, { cond2 }] }\n{ $and: [{ cond1 }, { cond2 }] }`,
    code: `// OR — either admin or moderator\nconst staff = await User.find({\n  $or: [\n    { role: 'admin' },\n    { role: 'moderator' },\n  ],\n});\n\n// AND — active AND has a verified email\nconst verified = await User.find({\n  $and: [\n    { active: true },\n    { emailVerified: true },\n  ],\n});\n// Shorthand (implicit AND):\nconst same = await User.find({ active: true, emailVerified: true });\n\n// Complex: expensive OR (tech AND in-stock)\nconst interesting = await Product.find({\n  $or: [\n    { price: { $gt: 1000 } },\n    { category: 'tech', inStock: true },\n  ],\n});`,
    icon: Workflow,
  },
  {
    id: "19", title: "Sorting & Pagination", subtitle: "Managing Lists",
    tag: "Querying", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 60% 70%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      ".sort({ field: 1 }) — ascending; -1 for descending",
      ".limit(n) — return at most n documents",
      ".skip(n) — skip the first n documents (for pagination)",
      "Combine skip + limit to implement page-based pagination",
    ],
    lab: "Fetch page 2 of posts (10 per page) sorted by newest first.",
    syntax: `.sort({ createdAt: -1 }).skip(10).limit(10)`,
    code: `// Sort by score, newest first\nconst leaderboard = await User\n  .find({ active: true })\n  .sort({ score: -1, createdAt: -1 })\n  .limit(10);\n\n// Pagination helper\nconst page  = parseInt(req.query.page)  || 1;\nconst limit = parseInt(req.query.limit) || 10;\nconst skip  = (page - 1) * limit;\n\nconst [posts, total] = await Promise.all([\n  Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),\n  Post.countDocuments(),\n]);\n\nres.json({\n  data:       posts,\n  page,\n  totalPages: Math.ceil(total / limit),\n  total,\n});`,
    icon: List,
  },
  {
    id: "20", title: "Update Documents", subtitle: "Modifying Data",
    tag: "CRUD", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 20% 55%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: [
      "findByIdAndUpdate(id, data) — find and modify in one step",
      "{ new: true } — return the updated document (not the old one)",
      "{ runValidators: true } — enforce schema rules on update",
      "$set — update specific fields without touching the rest",
    ],
    lab: "Change a user's role to 'pro' and get the updated document back.",
    syntax: `Model.findByIdAndUpdate(id, update, { new: true, runValidators: true })`,
    code: `// Basic update\nconst updated = await User.findByIdAndUpdate(\n  req.params.id,\n  { role: 'pro', score: 100 },\n  { new: true, runValidators: true }\n);\n\n// Use $set to be explicit\nconst patched = await User.findByIdAndUpdate(\n  id,\n  { $set: { name: "New Name" } }, // only touches 'name'\n  { new: true }\n);\n\n// Update many at once\nconst result = await User.updateMany(\n  { active: false },             // filter\n  { $set: { status: 'dormant' }} // changes\n);\nconsole.log(\`Modified \${result.modifiedCount} users\`);`,
    icon: RefreshCw,
  },
  {
    id: "21", title: "Atomic Operators", subtitle: "$inc, $push, $pull",
    tag: "CRUD", tagColor: "#f472b6", accent: "#ec4899",
    bg: "radial-gradient(ellipse at 65% 40%, rgba(236,72,153,0.12) 0%, transparent 60%)",
    content: [
      "$inc — increment a number directly in the DB (race-condition safe)",
      "$push — append a value to an array field",
      "$pull — remove a value from an array field",
      "$addToSet — push only if the value doesn't already exist",
    ],
    lab: "Increment a post's 'likes' by 1 atomically.",
    syntax: `{ $inc: { score: 10 } }\n{ $push: { tags: 'news' } }\n{ $pull: { tags: 'old' } }`,
    code: `// ❌ WRONG — race condition if two requests overlap:\nconst user = await User.findById(id);\nuser.score = user.score + 10;\nawait user.save();\n\n// ✅ CORRECT — atomic, happens entirely in MongoDB:\nawait User.findByIdAndUpdate(id, { $inc: { score: 10 } });\n\n// Push a new comment ID onto a post\nawait Post.findByIdAndUpdate(postId, {\n  $push: { comments: commentId },\n});\n\n// Remove a tag\nawait Post.findByIdAndUpdate(postId, {\n  $pull: { tags: 'deprecated' },\n});\n\n// Add a follower (no duplicates)\nawait User.findByIdAndUpdate(userId, {\n  $addToSet: { followers: followerId },\n});`,
    icon: Zap,
  },
  {
    id: "22", title: "Delete Documents", subtitle: "Removing Data",
    tag: "CRUD", tagColor: "#fb7185", accent: "#f43f5e",
    bg: "radial-gradient(ellipse at 30% 25%, rgba(244,63,94,0.12) 0%, transparent 60%)",
    content: [
      "findByIdAndDelete(id) — removes a single document",
      "deleteMany({ filter }) — removes all matching documents",
      "Deletion is permanent — consider soft-delete (active: false)",
      "Always confirm the document exists before deleting",
    ],
    lab: "Create a DELETE /api/tasks/:id route that removes the task.",
    syntax: `await Model.findByIdAndDelete(id);\nawait Model.deleteMany({ status: 'done' });`,
    code: `// Delete one\nconst deleted = await Task.findByIdAndDelete(req.params.id);\n\nif (!deleted) {\n  return res.status(404).json({ error: "Task not found" });\n}\n\nres.status(204).send(); // 204 No Content\n\n// Delete many\nconst result = await Task.deleteMany({ done: true });\nconsole.log(\`Deleted \${result.deletedCount} tasks\`);\n\n// Soft delete (safer alternative)\nawait User.findByIdAndUpdate(id, {\n  $set: { active: false, deletedAt: new Date() }\n});\n// Now queries can exclude: User.find({ active: true })`,
    icon: Trash2,
  },
  {
    id: "23", title: "Mongoose Middleware", subtitle: "Hooks: pre & post",
    tag: "Mongoose", tagColor: "#a78bfa", accent: "#8b5cf6",
    bg: "radial-gradient(ellipse at 55% 60%, rgba(139,92,246,0.12) 0%, transparent 60%)",
    content: [
      "pre('save') — runs before a document is saved",
      "post('save') — runs after a successful save",
      "Common use: hash passwords before storing them",
      "Call next() to pass control to the next middleware or save",
    ],
    lab: "Write a pre('save') hook that logs 'Saving user…' to the console.",
    syntax: `schema.pre('save', async function(next) {\n  // 'this' = the document being saved\n  next();\n});`,
    code: `const bcrypt = require('bcryptjs');\n\nuserSchema.pre('save', async function(next) {\n  // Only hash if password was changed\n  if (!this.isModified('password')) return next();\n\n  this.password = await bcrypt.hash(this.password, 12);\n  next();\n});\n\nuserSchema.pre('save', function(next) {\n  this.updatedAt = Date.now();\n  next();\n});\n\n// Post hook — runs after successful save\nuserSchema.post('save', function(doc) {\n  console.log(\`User \${doc.name} saved successfully\`);\n});`,
    icon: Workflow,
  },
  {
    id: "24", title: "Virtuals", subtitle: "Computed Properties",
    tag: "Mongoose", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 20% 40%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Virtuals exist in your JS code but are NOT stored in MongoDB",
      "Great for computed values: fullName, age from birthDate",
      "Saves DB space by avoiding redundant stored data",
      "Set { toJSON: { virtuals: true } } to include them in responses",
    ],
    lab: "Create a virtual 'fullName' combining 'firstName' and 'lastName'.",
    syntax: `schema.virtual('fullName').get(function() {\n  return \`\${this.first} \${this.last}\`;\n});`,
    code: `const userSchema = new mongoose.Schema(\n  {\n    firstName:  String,\n    lastName:   String,\n    birthYear:  Number,\n  },\n  { toJSON: { virtuals: true } } // include in JSON output\n);\n\n// Computed fullName\nuserSchema.virtual('fullName').get(function() {\n  return \`\${this.firstName} \${this.lastName}\`;\n});\n\n// Computed age\nuserSchema.virtual('age').get(function() {\n  return new Date().getFullYear() - this.birthYear;\n});\n\nconst user = await User.findById(id);\nconsole.log(user.fullName); // "Ratha Dev"\nconsole.log(user.age);      // 24  — not stored in DB`,
    icon: Sparkles,
  },
  {
    id: "25", title: "Custom Validation", subtitle: "Business Rules",
    tag: "Mongoose", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 65% 55%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Built-in validators (required, min, enum) cover common cases",
      "validate: { validator: fn } for complex custom logic",
      "The validator function receives the value and returns true/false",
      "A failed validator throws a ValidationError with your message",
    ],
    lab: "Validate that a 'phone' field matches a numeric pattern.",
    syntax: `validate: {\n  validator: (v) => /pattern/.test(v),\n  message:   "Invalid format"\n}`,
    code: `const userSchema = new mongoose.Schema({\n  email: {\n    type: String,\n    validate: {\n      validator: (v) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v),\n      message:   (props) => \`"\${props.value}" is not a valid email\`,\n    },\n  },\n  password: {\n    type: String,\n    validate: {\n      validator: (v) => v.length >= 8,\n      message:   'Password must be at least 8 characters',\n    },\n  },\n  username: {\n    type: String,\n    validate: {\n      validator: async function(v) {\n        const exists = await User.findOne({ username: v });\n        return !exists; // false = invalid\n      },\n      message: 'Username already taken',\n    },\n  },\n});`,
    icon: ShieldCheck,
  },
  {
    id: "26", title: "Indexing", subtitle: "Query Performance",
    tag: "Performance", tagColor: "#38bdf8", accent: "#0ea5e9",
    bg: "radial-gradient(ellipse at 40% 25%, rgba(14,165,233,0.12) 0%, transparent 60%)",
    content: [
      "Without indexes, MongoDB scans every document (COLLSCAN)",
      "With an index, MongoDB jumps directly to the match (IXSCAN)",
      "unique: true forces no duplicate values in that field",
      "Compound indexes cover multi-field queries efficiently",
    ],
    lab: "Why should you always index the 'email' field in a users collection?",
    syntax: `schema.index({ field: 1 });  // 1 = asc, -1 = desc\n{ type: String, unique: true }`,
    code: `const userSchema = new mongoose.Schema({\n  email:  { type: String, unique: true },  // built-in index\n  name:   String,\n  score:  Number,\n  role:   String,\n});\n\n// Single field index\nuserSchema.index({ score: -1 }); // sort leaderboard fast\n\n// Compound index (for combined queries)\nuserSchema.index({ role: 1, score: -1 });\n// Speeds up: User.find({ role: 'admin' }).sort({ score: -1 })\n\n// Text index for search\nuserSchema.index({ name: 'text', bio: 'text' });\n// Enables: User.find({ $text: { $search: "ratha" } })\n\n// TTL index — auto-delete after 24 hours\nschema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });`,
    icon: FastForward,
  },
  {
    id: "27", title: "References (Ref)", subtitle: "Linking Collections",
    tag: "Relations", tagColor: "#c084fc", accent: "#a855f7",
    bg: "radial-gradient(ellipse at 60% 65%, rgba(168,85,247,0.12) 0%, transparent 60%)",
    content: [
      "Store the _id of another document to create a relationship",
      "type: Schema.Types.ObjectId + ref: 'ModelName' sets it up",
      "ref must exactly match the model name string",
      "This is the NoSQL equivalent of a foreign key in SQL",
    ],
    lab: "In an Instagram clone, where would you store the User ID — on the Post or Comment?",
    syntax: `author: { type: Schema.Types.ObjectId, ref: 'User' }`,
    code: `const commentSchema = new mongoose.Schema({\n  body:   { type: String, required: true },\n  likes:  { type: Number, default: 0 },\n  author: {\n    type: mongoose.Schema.Types.ObjectId,\n    ref:  'User',    // ← must match mongoose.model('User', ...)\n    required: true,\n  },\n});\n\nconst postSchema = new mongoose.Schema({\n  title:    String,\n  body:     String,\n  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },\n  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],\n  tags:     [String],\n}, { timestamps: true });`,
    icon: LinkIcon,
  },
  {
    id: "28", title: "populate()", subtitle: "Resolving References",
    tag: "Relations", tagColor: "#4ade80", accent: "#22c55e",
    bg: "radial-gradient(ellipse at 20% 50%, rgba(34,197,94,0.12) 0%, transparent 60%)",
    content: [
      "References store IDs — populate() swaps them for real documents",
      "Chain .populate('field') after .find() or .findById()",
      "Pass a string of field names as second arg to select only those",
      "Nested populate: populate({ path: 'author', populate: 'avatar' })",
    ],
    lab: "Find a post and populate its author's name and email only.",
    syntax: `Post.findById(id).populate('author', 'name email')`,
    code: `// Basic populate\nconst post = await Post.findById(id)\n  .populate('author', 'name email'); // only name + email\n\nconsole.log(post.author.name); // "Ratha" — not just an ID!\n\n// Multiple fields\nconst full = await Post.findById(id)\n  .populate('author',   'name avatar')\n  .populate('comments');\n\n// Nested populate — get comment authors too\nconst deep = await Post.findById(id).populate({\n  path:     'comments',\n  populate: { path: 'author', select: 'name' },\n});\n\n// Get all posts with author info\nconst posts = await Post.find().populate('author', 'name');`,
    icon: Layers,
  },
  {
    id: "29", title: "Embedded Documents", subtitle: "Nesting vs Referencing",
    tag: "Relations", tagColor: "#fb923c", accent: "#f97316",
    bg: "radial-gradient(ellipse at 65% 35%, rgba(249,115,22,0.12) 0%, transparent 60%)",
    content: [
      "Embed when data 'always' belongs to its parent (order items)",
      "Reference when data is shared between many documents (users)",
      "Embedded = faster reads (no extra query); Reference = normalised",
      "Rule of thumb: if you never query the child alone, embed it",
    ],
    lab: "Are blog post 'tags' better as embedded strings or a referenced Tag collection?",
    syntax: `// Embed\nitems: [{ name: String, qty: Number, price: Number }]\n\n// Reference\nauthor: { type: ObjectId, ref: 'User' }`,
    code: `// ✅ EMBED — order line items always travel with the order\nconst orderSchema = new mongoose.Schema({\n  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },\n  items: [{\n    name:       String,\n    quantity:   Number,\n    unitPrice:  Number,\n    sku:        String,\n  }],\n  shippingAddress: {\n    street: String,\n    city:   String,\n    zip:    String,\n  },\n  total:  Number,\n  status: { type: String, enum: ['pending','shipped','delivered'] },\n}, { timestamps: true });\n\n// ✅ REFERENCE — a post's author is a shared User document\nconst postSchema = new mongoose.Schema({\n  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },\n});`,
    icon: Box,
  },
  {
    id: "30", title: "Aggregation Pipeline", subtitle: "Data Processing",
    tag: "Advanced", tagColor: "#818cf8", accent: "#6366f1",
    bg: "radial-gradient(ellipse at 35% 70%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    content: [
      "Aggregation passes documents through a series of stages",
      "$match — filter documents (like find())",
      "$group — combine documents and compute totals/averages",
      "$project — reshape output fields; $sort, $limit for ordering",
    ],
    lab: "Write a pipeline that finds the average price per product category.",
    syntax: `Model.aggregate([\n  { $match: { stage: 1 } },\n  { $group: { _id: '$field', total: { $sum: '$num' } } }\n])`,
    code: `// Sales report: total revenue per category\nconst report = await Product.aggregate([\n  // Stage 1: only published products\n  { $match: { published: true } },\n\n  // Stage 2: group by category, sum revenue\n  {\n    $group: {\n      _id:     '$category',\n      total:   { $sum:  '$price' },\n      average: { $avg:  '$price' },\n      count:   { $sum:  1 },\n      maxPrice:{ $max:  '$price' },\n    },\n  },\n\n  // Stage 3: sort by total revenue\n  { $sort: { total: -1 } },\n\n  // Stage 4: top 5 only\n  { $limit: 5 },\n\n  // Stage 5: rename _id to category\n  { $project: { category: '$_id', total: 1, count: 1, _id: 0 } },\n]);`,
    icon: Activity,
  },
  {
    id: "31", title: "Error Handling", subtitle: "Robust DB Code",
    tag: "Patterns", tagColor: "#fb7185", accent: "#f43f5e",
    bg: "radial-gradient(ellipse at 55% 25%, rgba(244,63,94,0.12) 0%, transparent 60%)",
    content: [
      "Always wrap DB calls in try/catch",
      "Error code 11000 = duplicate key (unique constraint violated)",
      "ValidationError — schema rules failed; inspect err.errors",
      "CastError — an invalid ObjectId was passed to findById()",
    ],
    lab: "Catch a duplicate email error and return a 409 status to the client.",
    syntax: `if (err.code === 11000) res.status(409).json({ error: '...' });`,
    code: `async function createUser(req, res) {\n  try {\n    const user = await User.create(req.body);\n    res.status(201).json(user);\n\n  } catch (err) {\n    // Duplicate key (unique field already exists)\n    if (err.code === 11000) {\n      const field = Object.keys(err.keyValue)[0];\n      return res.status(409).json({\n        error: \`\${field} already in use\`,\n      });\n    }\n\n    // Schema validation failed\n    if (err.name === 'ValidationError') {\n      const messages = Object.values(err.errors).map(e => e.message);\n      return res.status(422).json({ errors: messages });\n    }\n\n    // Invalid ObjectId (CastError)\n    if (err.name === 'CastError') {\n      return res.status(400).json({ error: 'Invalid ID format' });\n    }\n\n    // Catch-all\n    res.status(500).json({ error: 'Internal server error' });\n  }\n}`,
    icon: AlertCircle,
  },
  {
    id: "32", title: "Transactions", subtitle: "All-or-Nothing Operations",
    tag: "Advanced", tagColor: "#34d399", accent: "#10b981",
    bg: "radial-gradient(ellipse at 70% 60%, rgba(16,185,129,0.12) 0%, transparent 60%)",
    content: [
      "Transactions ensure multiple writes succeed or all are rolled back",
      "Essential for bank transfers, order + inventory updates",
      "Start a session, beginTransaction, commit or abort",
      "ACID: Atomicity, Consistency, Isolation, Durability",
    ],
    lab: "Why is a transaction essential for a bank transfer operation?",
    syntax: `const session = await mongoose.startSession();\nsession.startTransaction();\n// ... operations ...\nawait session.commitTransaction();`,
    code: `async function transferFunds(fromId, toId, amount) {\n  const session = await mongoose.startSession();\n  session.startTransaction();\n\n  try {\n    // Deduct from sender\n    await Account.findByIdAndUpdate(\n      fromId,\n      { $inc: { balance: -amount } },\n      { session }                       // pass the session!\n    );\n\n    // Add to receiver\n    await Account.findByIdAndUpdate(\n      toId,\n      { $inc: { balance: +amount } },\n      { session }\n    );\n\n    // Both succeeded — commit\n    await session.commitTransaction();\n    console.log("Transfer complete ✅");\n\n  } catch (err) {\n    // Either failed — roll BOTH back\n    await session.abortTransaction();\n    throw err;\n  } finally {\n    session.endSession();\n  }\n}`,
    icon: ShieldCheck,
  },
  {
    id: "33", title: "Best Practices", subtitle: "Professional Standards",
    tag: "Patterns", tagColor: "#fbbf24", accent: "#f59e0b",
    bg: "radial-gradient(ellipse at 25% 45%, rgba(245,158,11,0.12) 0%, transparent 60%)",
    content: [
      "Always use { timestamps: true } on every schema",
      "Never store passwords in plain text — always hash with bcrypt",
      "Index every field you query or sort by frequently",
      "Use .lean() for read-only queries — returns plain JS objects, faster",
    ],
    lab: "Audit your last project — did you index all frequently queried fields?",
    syntax: `// .lean() returns plain objects, not Mongoose docs\nconst users = await User.find().lean();\n// ~2× faster for read-only operations`,
    code: `// ✅ Checklist: Professional MongoDB patterns\n\n// 1. Timestamps on every schema\nnew Schema({ ... }, { timestamps: true });\n\n// 2. Never store plain passwords\nuserSchema.pre('save', async function(next) {\n  if (this.isModified('password'))\n    this.password = await bcrypt.hash(this.password, 12);\n  next();\n});\n\n// 3. Index query fields\nschema.index({ email: 1 });\nschema.index({ createdAt: -1, status: 1 });\n\n// 4. Lean queries for read-only endpoints\nconst posts = await Post.find().lean();    // ~2× faster\n\n// 5. Select only needed fields\nconst slim = await User.find().select('name email');\n\n// 6. Close connection gracefully\nprocess.on('SIGINT', async () => {\n  await mongoose.connection.close();\n  process.exit(0);\n});`,
    icon: Rocket,
  },
  {
    id: "FA", title: "Final Project", subtitle: "Social Media DB Design",
    tag: "Assignment", tagColor: "#fde047", accent: "#eab308",
    bg: "radial-gradient(ellipse at 50% 50%, rgba(234,179,8,0.15) 0%, transparent 60%), radial-gradient(ellipse at 10% 90%, rgba(249,115,22,0.08) 0%, transparent 50%)",
    content: [
      "Collections: User, Post, Comment, Follow (with references)",
      "Embedded comments as sub-docs inside Post documents",
      "unique index on User.email; text index on Post.title + body",
      "Virtuals: fullName on User, commentCount on Post",
      "Timestamps and soft-delete (deletedAt) on every schema",
    ],
    lab: "Design, build, and seed a Social Media database with all five collections.",
    syntax: `// Final challenge:\nUser → Post → Comment (embedded)\n          ↓\n       Follow (reference)`,
    code: `/* CONGRATULATIONS! 🎓\n\n   You've mastered the entire\n   MongoDB & Mongoose stack:\n\n   ✅ Document structure & collections\n   ✅ Schemas, types, validation\n   ✅ Full CRUD operations\n   ✅ Advanced querying ($gt, $or, $in)\n   ✅ Sorting, pagination, projection\n   ✅ References + populate()\n   ✅ Embedded sub-documents\n   ✅ Aggregation pipelines\n   ✅ Middleware (pre/post hooks)\n   ✅ Virtuals & custom validators\n   ✅ Indexing for performance\n   ✅ Transactions for safety\n\n   You are officially a\n   Database Architect. 💎\n*/`,
    icon: Sparkles,
  },
];

/* ─── JS/MONGO SYNTAX HIGHLIGHTER ────────────────────────────────── */
const JS_KEYWORDS = new Set([
  'const','let','var','function','return','if','else','async','await',
  'new','this','true','false','null','undefined','try','catch','throw',
  'require','class','extends','for','of','in','typeof','import','export',
]);

const HighlightedCode = ({ code }: { code: string }) => {
  const tokenizeLine = (line: string): React.ReactNode => {
    if (line.trimStart().startsWith('//') || line.trimStart().startsWith('/*') || line.trimStart().startsWith('*'))
      return <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>;

    const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_$][a-zA-Z0-9_$]*\b)/g);
    return parts.map((part, i) => {
      if (!part) return null;
      if (JS_KEYWORDS.has(part)) return <span key={i} style={{ color: '#f87171', fontWeight: 700 }}>{part}</span>;
      if (/^["'`]/.test(part)) return <span key={i} style={{ color: '#86efac' }}>{part}</span>;
      if (/^\d/.test(part)) return <span key={i} style={{ color: '#c084fc' }}>{part}</span>;
      if (/^[A-Z]/.test(part)) return <span key={i} style={{ color: '#fbbf24' }}>{part}</span>;
      return <span key={i} style={{ color: '#e2e8f0' }}>{part}</span>;
    });
  };

  return (
    <div className="font-mono text-sm leading-6 whitespace-pre"
      style={{ fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace" }}>
      {code.split('\n').map((line, i) => (
        <div key={i} className="min-h-[1.5rem]">{tokenizeLine(line)}</div>
      ))}
    </div>
  );
};

/* ─── SYNTAX PANEL ───────────────────────────────────────────────── */
const SyntaxPanel = ({ syntax, accent }: { syntax: string; accent: string }) => {
  if (!syntax) return null;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${accent}30`, background: `${accent}08` }}>
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: `${accent}20` }}>
        <FileCode className="w-3 h-3" style={{ color: accent }} />
        <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: accent }}>Syntax Reference</span>
      </div>
      <div className="p-3 text-xs leading-6 font-mono whitespace-pre text-zinc-300 overflow-x-auto"
        style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
        {syntax.split('\n').map((line, i) => (
          <div key={i} className="min-h-[1.5rem]">
            {line.trimStart().startsWith('//') || line.trimStart().startsWith('#')
              ? <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{line}</span>
              : line}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── CODE VIEWER ────────────────────────────────────────────────── */
const CodeViewer = ({ code, accent }: { code: string; accent: string }) => {
  const [copied, setCopied] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lines = code.split('\n');

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const syncScroll = () => {
    if (taRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = taRef.current.scrollTop;
      highlightRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/8 flex-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/60" />
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 rounded px-2 py-1 ml-1">
            <FileCode className="w-3 h-3" style={{ color: accent }} />
            <span className="text-[10px] font-mono text-zinc-400">model.js</span>
          </div>
        </div>
        <button onClick={copy}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${copied ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'}`}>
          {copied ? <><Check className="w-3 h-3" />Copied!</> : <><Copy className="w-3 h-3" />Copy</>}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-none w-9 bg-[#0d1117] border-r border-white/5 pt-4 pb-4 flex flex-col items-end pr-2 overflow-hidden select-none">
          {lines.map((_, i) => (
            <div key={i} className="text-[11px] font-mono text-zinc-600 leading-6 min-h-[1.5rem]">{i + 1}</div>
          ))}
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div ref={highlightRef} className="absolute inset-0 overflow-auto p-4 pointer-events-none" style={{ scrollbarWidth: 'none' }}>
            <HighlightedCode code={code} />
          </div>
          <textarea ref={taRef} readOnly value={code} onScroll={syncScroll}
            className="absolute inset-0 w-full h-full bg-transparent text-transparent resize-none outline-none p-4 font-mono text-sm leading-6 border-none overflow-auto selection:bg-emerald-500/25"
            style={{ fontFamily: "'JetBrains Mono',monospace", whiteSpace: 'pre', overflowWrap: 'normal' }}
            spellCheck={false} wrap="off" />
        </div>
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
function DbLessonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSlide = Math.max(0, Math.min(parseInt(searchParams.get('slide') || '1') - 1, slides.length - 1));

  const [current, setCurrent] = useState(initialSlide);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dir, setDir] = useState(1);

  const slide = slides[current];
  const IconComp = slide.icon;
  const progress = ((current + 1) / slides.length) * 100;

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('slide', (current + 1).toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [current]);

  const goTo = useCallback((idx: number, direction: number) => {
    if (isAnimating) return;
    setDir(direction);
    setIsAnimating(true);
    setTimeout(() => { setCurrent(idx); setIsAnimating(false); }, 300);
  }, [isAnimating]);

  const next = () => goTo((current + 1) % slides.length, 1);
  const prev = () => goTo((current - 1 + slides.length) % slides.length, -1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, isAnimating]);

  const variants = {
    enter: (d: number) => ({ x: d * 50, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:  (d: number) => ({ x: d * -50, opacity: 0, scale: 0.97 }),
  };

  return (
    <div className="min-h-screen text-white flex flex-col overflow-hidden"
      style={{ background: '#080c14', fontFamily: "'Inter','DM Sans',system-ui,sans-serif" }}>

      <div className="fixed inset-0 pointer-events-none transition-all duration-700" style={{ background: slide.bg }} />
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 70%)' }} />

      {/* ── HEADER ── */}
      <header className="relative z-20 flex items-center gap-4 px-6 py-3 border-b border-white/8 bg-black/20 backdrop-blur-xl flex-none">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 flex-none"
          style={{ background: `${slide.accent}20` }}>
          <IconComp className="w-3.5 h-3.5" style={{ color: slide.accent }} />
        </div>
        <div className="flex-none">
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-bold">Module 07 · Weeks 13–14</p>
          <p className="text-xs font-black text-white tracking-tight">MongoDB & Mongoose Masterclass</p>
        </div>

        <div className="flex-1 mx-6 hidden md:block">
          <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: slide.accent }} />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
            style={{ color: slide.tagColor, borderColor: `${slide.tagColor}40`, background: `${slide.tagColor}12` }}>
            {slide.tag}
          </span>
          <span className="text-xs font-mono text-zinc-600 ml-1">
            {current + 1}<span className="text-zinc-800">/{slides.length}</span>
          </span>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* LEFT */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={`left-${current}`} custom={dir} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="flex-none lg:w-[400px] xl:w-[440px] flex flex-col justify-between p-6 lg:p-8 lg:border-r border-white/8 overflow-y-auto">

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="text-4xl font-black tabular-nums leading-none flex-none pt-1"
                  style={{ color: `${slide.accent}35`, fontFamily: "'JetBrains Mono',monospace" }}>
                  {slide.id}
                </div>
                <div>
                  <h1 className="text-xl xl:text-2xl font-black leading-tight text-white">{slide.title}</h1>
                  <p className="text-sm text-zinc-400 font-medium mt-0.5">{slide.subtitle}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {slide.content.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-none" style={{ background: slide.accent }} />
                    <p className="text-sm text-zinc-300 leading-relaxed font-medium">{item}</p>
                  </motion.div>
                ))}
              </div>

              <SyntaxPanel syntax={slide.syntax} accent={slide.accent} />

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-xl border p-3.5 flex gap-2.5"
                style={{ background: `${slide.accent}0a`, borderColor: `${slide.accent}28` }}>
                <Play className="w-3.5 h-3.5 flex-none mt-0.5" style={{ color: slide.accent }} />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: slide.accent }}>Lab Exercise</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{slide.lab}</p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center gap-3 mt-6 lg:mt-0">
              <button onClick={prev}
                className="p-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 active:scale-95 transition-all flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-bold hidden sm:inline">Prev</span>
              </button>
              <button onClick={next}
                className="flex-1 py-2.5 px-4 rounded-xl font-black text-xs active:scale-95 transition-all flex items-center justify-center gap-2"
                style={{ background: slide.accent, color: '#000' }}>
                {current === slides.length - 1 ? 'Restart' : 'Next Lesson'}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* RIGHT */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 lg:p-5 gap-3">
          <div className="flex items-center justify-between flex-none">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/8">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest"
                style={{ background: `${slide.accent}25`, color: slide.accent }}>
                <FileCode className="w-3 h-3" /> Implementation
              </div>
            </div>
            <div className="text-[9px] font-mono text-zinc-700 hidden lg:flex items-center gap-1">
              <kbd className="px-1 py-0.5 border border-zinc-800 rounded text-[8px]">←</kbd>
              <kbd className="px-1 py-0.5 border border-zinc-800 rounded text-[8px]">→</kbd>
              navigate
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`code-${current}`}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden rounded-xl border border-white/8">
              <CodeViewer code={slide.code} accent={slide.accent} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── FOOTER DOTS ── */}
      <footer className="relative z-20 flex justify-center items-center gap-1.5 py-3 border-t border-white/8 bg-black/20 backdrop-blur-xl flex-none flex-wrap px-4">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i, i > current ? 1 : -1)}
            title={slides[i].title}
            className="rounded-full transition-all duration-300"
            style={{ width: i === current ? 20 : 5, height: 5, background: i === current ? slide.accent : 'rgba(255,255,255,0.12)' }} />
        ))}
      </footer>
    </div>
  );
}

export default function DbLesson() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
          <p className="text-zinc-600 text-sm font-mono">Loading DB Lab...</p>
        </div>
      </div>
    }>
      <DbLessonContent />
    </Suspense>
  );
}