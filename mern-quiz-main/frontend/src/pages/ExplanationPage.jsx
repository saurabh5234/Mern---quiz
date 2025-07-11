import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, Info, CheckCircle } from "lucide-react";
import { jsPDF } from "jspdf";

const ExplanationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [userSelections, setUserSelections] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quizzes/edit/${id}`, {
          credentials: "include", // Include cookies for authentication
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch quiz details: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data.questions?.length > 0) {
          setQuestions(data.data.questions);
        } else {
          setError("No questions available for this quiz.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const savedSelections = JSON.parse(localStorage.getItem(`userSelections_${id}`));
    if (savedSelections) {
      setUserSelections(savedSelections);
    }

    fetchQuizDetails();
  }, [id]);

  const downloadAllQuestionsPDF = () => {
    const doc = new jsPDF();

    // Set margins and line height
    const leftMargin = 15;
    const rightMargin = 15;
    const maxWidth = 180; // 210 (A4 width) - leftMargin - rightMargin
    const lineHeight = 7;
    let yPosition = 20; // Initial Y position

    // Watermark function
    const addWatermark = () => {
      doc.setFontSize(40);
      doc.setTextColor(200, 200, 200); // Light gray color
      doc.setGState(new doc.GState({ opacity: 0.2 })); // 20% opacity
      doc.text("support@vighnesh.is-a.dev", 105, 150, {
        angle: 45,
        align: 'center'
      });
      // Reset styles
      doc.setGState(new doc.GState({ opacity: 1 }));
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
    };

    // Add title to the PDF
    doc.setFontSize(20);
    doc.text("Quiz Explanation Report", 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Total Questions: ${questions.length}`, 105, 25, { align: 'center' });
    yPosition += 20;

    // Add watermark to first page
    addWatermark();

    questions.forEach((question, index) => {
      // Add page break if needed (leave 20mm margin at bottom)
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
        // Add watermark to new page
        addWatermark();
      }

      // Question header - split into multiple lines if too long
      doc.setFontSize(16);
      const questionLines = doc.splitTextToSize(
        `Question ${index + 1} (Marks: ${question?.marks || 1}): ${question?.questionText || ''}`,
        maxWidth
      );
      questionLines.forEach(line => {
        doc.text(line, leftMargin, yPosition);
        yPosition += lineHeight;
      });

      // User answer
      doc.setFontSize(12);
      const userAnswer = question?.options?.[userSelections[question._id]] || 'Not answered';
      const correctAnswer = question?.options?.[question.correctAnswerIndex] || '';

      // Calculate maximum label width
      const labelWidth = Math.max(
        doc.getStringUnitWidth("Your Answer: ") * doc.internal.scaleFactor,
        doc.getStringUnitWidth("Correct Answer:   ") * doc.internal.scaleFactor
      ) + 10; // Add 5px padding

      // Your Answer
      doc.setTextColor(0, 0, 0); // Black
      doc.text("Your Answer: ", leftMargin, yPosition);
      if (userSelections[question._id] === question.correctAnswerIndex) {
        doc.setTextColor(0, 128, 0); // Green for correct
      } else {
        doc.setTextColor(255, 0, 0); // Red for incorrect
      }
      // Use splitTextToSize for long answers
      const userAnswerLines = doc.splitTextToSize(userAnswer, maxWidth - labelWidth);
      doc.text(userAnswerLines, leftMargin + labelWidth, yPosition);
      yPosition += lineHeight * userAnswerLines.length;

      // Correct Answer
      doc.setTextColor(0, 0, 0); // Black
      doc.text("Correct Answer: ", leftMargin, yPosition);
      doc.setTextColor(0, 128, 0); // Green
      const correctAnswerLines = doc.splitTextToSize(correctAnswer, maxWidth - labelWidth);
      doc.text(correctAnswerLines, leftMargin + labelWidth, yPosition);
      yPosition += lineHeight * correctAnswerLines.length;

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Explanation header
      doc.text(`Explanation:`, leftMargin, yPosition);
      yPosition += lineHeight;

      // Split explanation into multiple lines if needed
      const explanation = question?.explanation || 'No explanation provided.';
      const explanationLines = doc.splitTextToSize(explanation, maxWidth);
      explanationLines.forEach(line => {
        doc.text(line, leftMargin + 5, yPosition);
        yPosition += lineHeight;
      });

      // Add image if available
      if (question?.explanationImages?.length > 0) {
        yPosition += 5;
        doc.text('Explanation Image:', leftMargin, yPosition);
        yPosition += lineHeight;

        try {
          // This would need proper image handling in a real implementation
          const img = new Image();
          img.src = question.explanationImages[0];
          doc.addImage(img, 'JPEG', leftMargin, yPosition, 180, 100);
          yPosition += 100;
        } catch (error) {
          console.error('Error adding image:', error);
          doc.text('[Could not load image]', leftMargin + 5, yPosition);
          yPosition += 20;
        }
      }

      // Add spacing between questions
      yPosition += 15;
    });

    // Save the PDF
    doc.save(`quiz_explanations_${id}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-300">Loading explanations...</p>
      </div>
    );
  }

  if (error || !questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Info className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{error || "No Questions Available"}</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const userSelectedIndex = userSelections[currentQuestion._id];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header with progress */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Results
          </button>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <span className="inline-block px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-md mb-3">
              Question {currentIndex + 1}
            </span>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {currentQuestion?.questionText} (Marks: {currentQuestion?.marks || 1})
            </h2>
            <div className={`p-3 rounded-lg ${userSelectedIndex === currentQuestion.correctAnswerIndex ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
              <p>Your Answer: {currentQuestion?.options?.[userSelectedIndex]}</p>
            </div>
            <div className="flex items-start space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <CheckCircle className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium">Correct Answer:</p>
                <p>{currentQuestion?.options?.[currentQuestion.correctAnswerIndex]}</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Explanation</h3>
              <p className="text-gray-700 dark:text-gray-300">{currentQuestion?.explanation}</p>

              {currentQuestion?.explanationImages?.length > 0 && (
                <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={currentQuestion.explanationImages[0] || "/placeholder.svg"}
                    alt="Explanation Image"
                    className="w-full max-h-80 object-contain"
                  />
                </div>
              )}
            </div>

            {/* Download PDF Button - now downloads all questions */}
            <button
              onClick={downloadAllQuestionsPDF}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Download All Questions as PDF
            </button>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
            className={`flex items-center px-5 py-2.5 rounded-lg font-medium ${currentIndex === 0 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
            disabled={currentIndex === questions.length - 1}
            className={`flex items-center px-5 py-2.5 rounded-lg font-medium ${currentIndex === questions.length - 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplanationPage;