# 🚀 `habitLogsController` Logic — Stylish Planning Guide

Welcome! Here’s a **well-structured, stylish plan** for your `habitLogsController` logic. Use this as your reference for building, debugging, and scaling your habit log features.

---

## 🗂️ **Controller Functions Overview**

| **Function**             | **Purpose**                                   |
|--------------------------|-----------------------------------------------|
| `createHabitLog`         | Create a new log entry                        |
| `getHabitLogsByHabitId`  | Fetch all logs for a specific habit           |
| `getWeeklyGraphData`     | Return 7-day log data for graphing            |
| `getMonthlyGraphData`    | Return 6-month trend data for graphing        |
| `updateHabitLog`         | Update completion status or notes of a log    |
| `deleteHabitLog`         | Delete all logs for a habit                   |
| `calculateStreakForHabit`| Calculate current streak (🔥 Snapchat style)  |

---

## ✅ **Completed Controllers**

- `createHabitLog` &nbsp;:white_check_mark:

---

## 📝 **Controller Planning Steps**

---

### ✨ `getHabitLogsByHabitId`

> _Prepping for future features (admin panels, user history, debugging, etc.)._  
> **Goal:** Get all logs for a habit.

#### **Steps:**

1. **🔒 Authentication:**  
  - If not logged in: **Return:** _You Need to Login First_

2. **🆔 Validate habitId:**  
  - If missing: **Return:** _Habit Id is required_

3. **🔍 Find Logs:**  
  ```js
  const logs = await HabitLog.find({ habit: habitId, user: req.user.id });
  ```

4. **🗂️ Sort & Paginate:**  
  ```js
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const logs = await HabitLog.find({ habit: habitId, user: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  ```

5. **📊 Total Count for Pagination:**  
  ```js
  const totalLogs = await HabitLog.countDocuments({ habit: habitId, user: req.user.id });
  res.json({ logs, totalLogs, currentPage: page });
  ```

---

### 📊 `getWeeklyGraphData`

> _Return 7-day log data for a habit._

#### **Steps:**

1. **🔒 Authentication:**  
  - If not logged in: **Return:** _You Need to Login First_

2. **🆔 Validate habitId:**  
  - If missing: **Return:** _Habit Id is required_

3. **📅 Prepare Date Range:**  
  - Get today’s date (UTC, midnight)
  - Subtract 6 days for start of week
  - Create array of dates from (today - 6) to today

4. **🔎 Query HabitLog Model:**  
  - Filter by userId, habitId, and date within last 7 days
  - Group by date and count logs per day

  ```js
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const startDate = new Date(today);
  startDate.setUTCDate(today.getUTCDate() - 6);

  const logsByDay = await HabitLog.aggregate([
    { $match: { user: req.user.id, habit: habitId, createdAt: { $gte: startDate, $lte: today } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  // Fill missing days with count 0
  const result = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setUTCDate(startDate.getUTCDate() + i);
    const dateString = date.toISOString().slice(0, 10);
    const log = logsByDay.find((l) => l._id === dateString);
    result.push({ date: dateString, count: log ? log.count : 0 });
  }
  res.json(result);
  ```

#### 💡 **Tips**

- **Index:** `{ user: 1, habit: 1, date: 1 }` for fast queries.
- **Timezone:** Add UTC+userTimezone support if needed.
- **Frontend:** Use `totalLogs` for pagination.

---

### 📅 `getMonthlyGraphData`

> _Return user’s habit completion rate for each of the last 6 months._

#### **Progress Table Example**

| **Month**    | **Completion Rate** |
|--------------|:------------------:|
| December     |        34%         |
| January      |        63%         |
| February     |        25%         |
| March        |        45%         |
| April        |        83%         |
| May          |        46%         |

> 🌟 **Insight:**  
> Notice your strong improvement in April! Use this breakdown to spot trends, celebrate wins, and identify months to boost consistency.

#### **Steps:**

1. **🔒 Authentication:**  
  ```js
  return res.status(401).json({ message: "You Need to Login First 🚫" });
  ```

2. **🆔 Validate habitId:**  
  ```js
  return res.status(400).json({ message: "Habit Id is required ❗" });
  ```

3. **📅 Date Range for Last 6 Months:**  
  ```js
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 5);
  startDate.setDate(1);
  ```

4. **📊 Aggregation Pipeline:**  
  ```js
  const result = await HabitLog.aggregate([
    { $match: {
      userId: new mongoose.Types.ObjectId(req.user._id),
      habitId: new mongoose.Types.ObjectId(req.query.habitId),
      date: { $gte: startDate, $lte: endDate },
     }
    },
    { $group: {
      _id: { year: { $year: "$date" }, month: { $month: "$date" } },
      total: { $sum: 1 },
      completed: { $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] } },
     }
    },
    { $project: {
      month: "$_id.month",
      year: "$_id.year",
      completionRate: { $round: [{ $multiply: [{ $divide: ["$completed", "$total"] }, 100] }, 0] },
      _id: 0,
     }
    },
    { $sort: { year: 1, month: 1 } },
  ]);
  res.status(200).json(result);
  ```

#### **Example Output**

```json
[
  { "month": 12, "year": 2024, "completionRate": 34 },
  { "month": 1, "year": 2025, "completionRate": 63 },
  { "month": 2, "year": 2025, "completionRate": 25 }
]
```

---

### ✏️ `updateHabitLog`

> _Update completion status, notes, and updated date of an existing habit log._

#### **Steps:**

1. **🔒 Authentication:**  
  - If not logged in: **Return:** _You Need to Login First_

2. **🆔 Validate Inputs:**  
  - Confirm `habitId` in body and `id` (log ID) in URL params.
  - If missing: **Return:** _Habit Id and Log Id are required_

3. **🔍 Find the Habit Log:**  
  - Match: `_id` (log ID), `habit` (habitId), `user` (logged-in user)
  - If not found: **Return:** _Habit Log not found_

4. **📝 Update Fields:**  
  - Update `completed`, `notes`, and `updatedAt` if provided.

5. **💾 Save & Return:**  
  - **Message:** _Habit Log updated successfully_
  - **Data:** updated log

#### **Example Response**

```json
{
  "message": "Habit Log updated successfully",
  "data": {
   "_id": "logId123",
   "habit": "habitId456",
   "user": "userId789",
   "completed": true,
   "notes": "Did extra reps today!",
   "updatedAt": "2024-06-10T12:34:56.789Z"
  }
}
```
---

### 🗑️ `deleteHabitLog` Controller — Planning

#### **Purpose**

- **Primary Route:** `DELETE /api/habits/:habitId`  
  ➜ Delete **all logs** associated with a habit.
- **Optional Route:** `DELETE /api/habits/log/:logId`  
  ➜ Delete a **specific single habit log**.

We’ll plan both routes separately for clarity.

---

#### 1️⃣ **DELETE `/api/habits/:habitId` — Delete All Logs of a Habit**

**Steps:**

1. **🔐 Check User Authentication**
   ```js
   if (!req.user) {
     return res.status(401).json({ message: "You need to login first 🔒" });
   }
   ```

2. **🆔 Validate `habitId`**
   ```js
   const { habitId } = req.params;
   if (!habitId) {
     return res.status(400).json({ message: "Habit ID is required ❗" });
   }
   ```

3. **🧹 Delete Logs from HabitLog Model**
   ```js
   const result = await HabitLog.deleteMany({
     habit: habitId,
     user: req.user._id,
   });
   ```

4. **✅ Return Response**
   ```js
   res.status(200).json({
     message: `Deleted ${result.deletedCount} log(s) for this habit 🧼`,
   });
   ```

---

#### 2️⃣ **DELETE `/api/habits/log/:logId` — Delete a Single Log**

**Steps:**

1. **🔐 Check User Authentication**
   ```js
   if (!req.user) {
     return res.status(401).json({ message: "You need to login first 🔒" });
   }
   ```

2. **🆔 Validate `logId`**
   ```js
   const { logId } = req.params;
   if (!logId) {
     return res.status(400).json({ message: "Log ID is required ❗" });
   }
   ```

3. **🔍 Check if Log Exists and Belongs to User**
   ```js
   const log = await HabitLog.findOne({ _id: logId, user: req.user._id });
   if (!log) {
     return res.status(404).json({ message: "Habit log not found ❌" });
   }
   ```

4. **🗑️ Delete the Log**
   ```js
   await log.deleteOne();
   ```

5. **✅ Return Response**
   ```js
   res.status(200).json({ message: "Habit log deleted successfully 🗑️" });
   ```

---

#### ✨ **Summary Table**

| **Route**                  | **Purpose**                | **Req Param** | **Action**                         |
|----------------------------|----------------------------|---------------|-------------------------------------|
| DELETE `/api/habits/:habitId`      | Delete all logs of a habit   | `habitId`     | `HabitLog.deleteMany(...)`          |
| DELETE `/api/habits/log/:logId`    | Delete one specific log      | `logId`       | `HabitLog.findOne` + `deleteOne()`  |

---


---

### 🔥 `calculateStreakForHabit` — Planning

#### **Goal**

Calculate the current streak of consecutive days a user has completed a specific habit — including today if completed.

#### **Logic Plan**

1. **📅 Get Today’s Date:**  
  - Format: `YYYY-MM-DD` (date only, no time)

2. **📥 Fetch All Completed Logs:**  
  - Filter: `completed: true`
  - Sort: Descending by date

3. **🔢 Initialize Streak Counter:**  
  - `streak = 0`
  - `currentDay = today`

4. **🔄 Loop Through Logs:**  
  - If log’s date equals `currentDay`:  
    - Increment `streak`
    - Subtract one day from `currentDay`
  - Else:  
    - Break (streak broken)

5. **✅ Return Streak Count**

#### **Example Table**

| **Date**   | **Completed** |         |
|------------|:-------------:|---------|
| 2025-05-22 |      ✅       | (today) |
| 2025-05-21 |      ✅       |         |
| 2025-05-20 |      ❌       |         |
| 2025-05-19 |      ✅       |         |

> **Result:**  
> **Streak = 2** (for 21st and 22nd)

#### **Express Controller Example**

```js
import HabitLog from "../models/HabitLog.js";
import dayjs from "dayjs";

export const calculateStreakForHabit = async (req, res) => {
  const { habitId } = req.params;

  try {
   const logs = await HabitLog.find({ habit: habitId, completed: true }).sort({ date: -1 });
   let streak = 0;
   let currentDay = dayjs().startOf("day");

   for (let log of logs) {
    const logDay = dayjs(log.date).startOf("day");
    if (logDay.isSame(currentDay)) {
      streak++;
      currentDay = currentDay.subtract(1, "day");
    } else {
      break;
    }
   }
   res.status(200).json({ streak });
  } catch (error) {
   console.error("Error calculating streak:", error);
   res.status(500).json({ message: "Failed to calculate streak 🚫" });
  }
};
```

#### 💡 **Enhancements**

- **Indexing:** `{ user: 1, habit: 1, date: 1 }` for fast queries.
- **Timezone:** Use UTC or user’s timezone for accuracy.
- **Frontend:** Display streak with a 🔥 icon for motivation!

---

> **Keep this as your go-to reference for building robust, scalable, and stylish habit log controllers!**
