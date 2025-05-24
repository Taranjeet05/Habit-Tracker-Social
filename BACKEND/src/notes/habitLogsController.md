# 🚀 Planning Steps for `habitLogsController` Logic

---

## 🔥 **`calculateStreakForHabit` Controller — Planning**

---

### 🎯 **Goal**

Calculate the current streak of consecutive days a user has completed a specific habit — including today if it was completed.

---

### 🧠 **Logic Plan (Step by Step)**

1. **📅 Get Today’s Date**
  - Format: `YYYY-MM-DD` (date only, no time).

2. **📥 Fetch All Completed Logs for the Habit**
  - **Filter:** `completed: true`
  - **Sort:** Descending by date (newest first).

3. **🔢 Initialize Streak Counter**
  - Start with `streak = 0`
  - Set `currentDay = today`

4. **🔄 Loop Through the Logs**
  - For each log:
    - **If** log’s date equals `currentDay`:
     - ➕ Increment `streak`
     - ⏪ Subtract one day from `currentDay`
    - **Else:**  
     - 🚫 Break (streak is broken)

5. **✅ Return Streak Count**

---

### 🧪 **Example**

| **Date**     | **Completed** |
| ------------ | :-----------: |
| 2025-05-22   |      ✅       | (today)
| 2025-05-21   |      ✅       |
| 2025-05-20   |      ❌       |
| 2025-05-19   |      ✅       |

> **Result:**  
> **Streak = 2** (for 21st and 22nd)

---

### 📝 **Express Controller Code Plan**

```js
// controllers/habitLogsController.js
import HabitLog from "../models/HabitLog.js";
import dayjs from "dayjs";

export const calculateStreakForHabit = async (req, res) => {
  const { habitId } = req.params;

  try {
   // 1. Get all completed logs for the habit, sorted newest first
   const logs = await HabitLog.find({ habit: habitId, completed: true })
    .sort({ date: -1 });

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

---

### 💡 **Tips & Enhancements**

- **Indexing:**  
  Ensure an index on `{ user: 1, habit: 1, date: 1 }` for fast queries.
- **Timezone:**  
  Use UTC or user’s timezone for accurate streaks.
- **Frontend:**  
  Display streak with a 🔥 icon for motivation!

---
