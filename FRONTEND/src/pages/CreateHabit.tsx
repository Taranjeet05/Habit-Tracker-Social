import HabitForm from "../components/Habits/Habit-Form/HabitForm";

const CreateHabit = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Habit</h1>
      <HabitForm />
    </div>
  );
};

export default CreateHabit;
