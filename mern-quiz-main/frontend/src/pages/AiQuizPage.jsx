import { useState } from "react";
import {
    Loader2,
    AlertCircle,
    FileText,
    Info,
    List,
    Hash,
    Sparkles,
    CheckCircle,
    LayoutGrid,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AIQuizPage = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        difficulty: "easy",
        numQuestions: 5,
    });

    const [loading, setLoading] = useState(false);
    const [quizGenerated, setQuizGenerated] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setQuizGenerated(false);
        setAccessDenied(false);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/quizzes/generate-quiz`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                    credentials: "include", // Include cookies for authentication
                }
            );

            const data = await response.json();

            if (response.ok) {
                toast.success("Test generated successfully!");
                setQuizGenerated(true);
            } else if (response.status === 403) {
                setAccessDenied(true);
            } else {
                toast.error(data.message || "Failed to generate Test."); // 👈 Show toast only for other errors
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const handleNavigateToDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Page Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <Sparkles className="text-blue-500" />
                Generate AI Quiz
            </h1>
            <p className="text-sm  text-gray-900 dark:text-white mb-8 flex items-center gap-3">

                (Currently we are on vercels free serverless plan,
                so it may sometimes generate quiz for 5 questions only,or not
                because of gateway timeout problem, will solve it soon)
            </p>

            {/* Conditional Rendering */}
            {quizGenerated ? (
                <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-6 rounded-lg flex flex-col items-center">
                    <CheckCircle className="h-12 w-12 mb-4" />
                    <h2 className="text-xl font-bold">Test Generated Successfully!</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        You can view and manage your quiz from the dashboard.
                    </p>
                    <button
                        onClick={handleNavigateToDashboard}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <LayoutGrid className="h-5 w-5" />
                        Go to Dashboard
                    </button>
                </div>
            ) : accessDenied ? (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-6 rounded-lg flex flex-col items-center">
                    <AlertCircle className="h-12 w-12 mb-4" />
                    <h2 className="text-xl font-bold">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                        This feature is not yet activated for your account.
                        <br />
                        Please contact{" "}
                        <a
                            href="mailto:vighnupawar2004@gmail.com"
                            className="text-blue-600 underline"
                        >
                            vighnupawar2004@gmail.com
                        </a>{" "}
                        to request access.
                    </p>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6"
                >
                    {/* Title Input */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                            <FileText className="inline-block mr-2 text-blue-500" />
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            placeholder="Enter quiz title"
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                            <Info className="inline-block mr-2 text-green-500" />
                            Topics to cover
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            placeholder="Enter quiz description"
                            required
                        />
                    </div>

                    {/* Difficulty Select */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                            <List className="inline-block mr-2 text-yellow-500" />
                            Difficulty Level
                        </label>
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                        >
                            <option value="easy">🟢 Easy</option>
                            <option value="medium">🟠 Medium</option>
                            <option value="hard">🔴 Hard</option>
                        </select>
                    </div>

                    {/* Number of Questions */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                            <Hash className="inline-block mr-2 text-purple-500" />
                            Number of Questions
                        </label>
                        <input
                            type="number"
                            name="numQuestions"
                            value={formData.numQuestions}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            min="1"
                            max="50"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin inline-block" />
                        ) : (
                            "Generate Quiz"
                        )}
                    </button>
                </form>
            )}
        </div>
    );
};

export default AIQuizPage;
