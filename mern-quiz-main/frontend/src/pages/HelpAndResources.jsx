import React from "react";
import {
    Info, UserPlus, PencilLine, Brain, BookOpenCheck,
    FileText, Settings, LifeBuoy, Mail
} from "lucide-react";

const sections = [
    {
        icon: <UserPlus className="text-green-500" />,
        title: "Getting Started",
        items: [
            "Create an account or log in",
            "Access dashboard to manage your quizzes",
            "Explore manual and AI quiz generation",
        ],
    },
    {
        icon: <PencilLine className="text-purple-500" />,
        title: "Creating Quizzes",
        items: [
            "Create manually or generate with AI",
            "Add questions, options, correct answer & explanation",
            "Optionally upload images",
        ],
    },
    {
        icon: <Brain className="text-pink-500" />,
        title: "AI Quiz Generator",
        items: [
            "Enter a topic, number of questions & difficulty level",
            "AI will generate the quiz for you",
            "Review, edit, and publish instantly",
        ],
    },
    {
        icon: <BookOpenCheck className="text-blue-400" />,
        title: "Attempting Quizzes",
        items: [
            "Join via link or enter quiz ID",
            "Timer starts automatically",
            "Receive your score and explanations instantly",
        ],
    },
    {
        icon: <FileText className="text-indigo-500" />,
        title: "Results & Explanation",
        items: [
            "Review answers with correct options highlighted",
            "Download explanation as PDF",
        ],
    },
    {
        icon: <Settings className="text-yellow-500" />,
        title: "Account & Settings",
        items: [
            "Manage profile",
            "Logout securely",
            "Delete your quizzes",
        ],
    },
    {
        icon: <LifeBuoy className="text-red-500" />,
        title: "Troubleshooting",
        items: [
            "Quiz not loading or AI failed? Try refreshing",
            "Check internet or try re-logging",
        ],
    },
];

const HelpAndResources = () => {
    return (
        <div className="w-full px-4 mx-auto sm:px-6 lg:px-8 py-10 bg-white dark:bg-gray-900 transition-colors duration-300">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-10 flex items-center gap-3">
                <Info className="text-blue-500 dark:text-blue-400" />
                Help & Resources
            </h1>

            <div className="grid sm:grid-cols-2 gap-6">
                {sections.map((section, idx) => (
                    <div
                        key={idx}
                        className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-[1.01]"
                    >
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-3 text-gray-900 dark:text-white">
                            {section.icon}
                            {section.title}
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                            {section.items.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Contact Section */}
            <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 text-gray-900 dark:text-white">
                    <Mail className="text-blue-700 dark:text-blue-400" />
                    Contact Support
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                    Email us at:
                    <span className="font-bold ml-2 text-gray-900 dark:text-white">
                        support@vighnesh.is-a.dev
                    </span>
                </p>
            </div>
        </div>
    );
};

export default HelpAndResources;
