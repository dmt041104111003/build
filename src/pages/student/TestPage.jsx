import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Timer from "../../components/student/Timer";
import QuestionList from "../../components/student/QuestionList";
import QuestionDetail from "../../components/student/QuestionDetail";
import Swal from "sweetalert2";

const TestPage = () => {
    const { courseId, testId } = useParams();
    const { allCourses } = useContext(AppContext);
    
    const [timeUp, setTimeUp] = useState(false);
    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [warningCount, setWarningCount] = useState(0);

    const firstLoad = useRef(true);

    useEffect(() => {
        if (allCourses.length > 0) {
            const foundCourse = allCourses.find(c => c.courseId === courseId);
            if (!foundCourse) return;

            const foundTest = foundCourse.tests.find(t => t.testId === testId);
            setTest(foundTest || null);
        }
    }, [courseId, testId, allCourses]);
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) return; // Chỉ cảnh báo khi tab bị ẩn
            if (!firstLoad.current) {
                triggerWarning();
            }
        };
    
        const handleBlur = () => {
            if (!firstLoad.current) {
                triggerWarning();
            }
        };
    
        window.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
    
        // Đặt firstLoad.current thành false sau khi component đã render xong
        const timer = setTimeout(() => {
            firstLoad.current = false;
        }, 1500); // Tăng lên 1.5s để tránh lỗi
    
        return () => {
            clearTimeout(timer);
            window.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
        };
    }, []);

    const calculateScore = () => {
        if (!test || !test.questions) return 0; // Kiểm tra test trước khi truy cập test.questions
        
        let score = 0;
        test.questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
                score += 1;
            }
        });
    
        return score;
    };
    
    
    

    const handleSubmit = () => {
        if (submitted || timeUp) return;

        Swal.fire({
            title: "Bạn có chắc muốn nộp bài?",
            text: "Bạn sẽ không thể thay đổi câu trả lời sau khi nộp!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, nộp bài!",
            cancelButtonText: "Hủy"
        }).then((result) => {
            if (result.isConfirmed) {
                const finalScore = calculateScore();
                setScore(finalScore);
                setSubmitted(true);

                Swal.fire({
                    title: "Đã nộp bài!",
                    text: `Bạn đã hoàn thành bài kiểm tra. Điểm số của bạn: ${finalScore} / ${test.questions.length}`,
                    icon: "success"
                });
            }
        });
    };


    const triggerWarning = () => {
        if (submitted || timeUp || warningCount >= 3) return;
    
        setWarningCount(prevCount => {
            const newCount = prevCount + 1;
            Swal.fire({
                title: newCount >= 3 ? "Bạn đã vi phạm quá nhiều lần!" : "Cảnh báo!",
                text: newCount >= 3 
                    ? "Bài kiểm tra của bạn sẽ bị tự động nộp." 
                    : `Bạn vừa rời khỏi trang làm bài! (${newCount}/3 cảnh báo)`,
                icon: newCount >= 3 ? "error" : "warning",
                confirmButtonText: "Tôi hiểu"
            });
    
            if (newCount >= 3) {
                if (!test || !test.questions) {
                    Swal.fire({
                        title: "Lỗi!",
                        text: "Không thể nộp bài do lỗi tải dữ liệu. Vui lòng thử lại.",
                        icon: "error"
                    });
                    return prevCount; // Không tăng warningCount nếu test chưa tải xong
                }
    
                const finalScore = calculateScore();
                setScore(finalScore);
                setSubmitted(true);
                setTimeUp(true);
    
                Swal.fire({
                    title: "Vi phạm!",
                    text: `Bài kiểm tra đã tự động nộp. Điểm của bạn: ${finalScore} / ${test.questions.length}`,
                    icon: "info"
                });
            }
            return newCount;
        });
    };
    

    if (!test) return <p className="text-red-500 text-center mt-10">Test không tồn tại hoặc đang tải...</p>;

    const handleSelect = (questionIndex, option) => {
        setAnswers(prevAnswers => ({ ...prevAnswers, [questionIndex]: option }));
    };

   
    
    const handleTimeUp = () => {
        if (!submitted) {
            const finalScore = calculateScore();
            setScore(finalScore);
            setSubmitted(true);
            setTimeUp(true);

            Swal.fire({
                title: "Hết giờ!",
                text: `Bài kiểm tra đã tự động nộp. Điểm của bạn: ${finalScore} / ${test.questions.length}`,
                icon: "info"
            });
        }
    };

    return (
        <div className="w-full mx-auto p-6 bg-white">
            <div className="flex items-center">
                {submitted && (
                    <div className="text-lg font-bold text-gray-800">
                        Điểm của bạn: {score} / {test.questions.length}
                    </div>
                )}

                <button
                    className="ml-auto bg-red-600 text-white px-4 py-2 text-base rounded hover:bg-blue-700 w-auto"
                    onClick={handleSubmit}
                    disabled={submitted}
                >
                    {submitted ? "Đã nộp bài" : "Nộp bài"}
                </button>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-4">{test.title}</h1>

            <Timer duration={600} onTimeUp={handleTimeUp} submitted={submitted} />

            <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="col-span-1">
                    <QuestionList 
                        questions={test.questions} 
                        currentQuestion={currentQuestion} 
                        onSelectQuestion={setCurrentQuestion} 
                        answers={answers} 
                    />
                </div>
                <div className="col-span-3">
                    <QuestionDetail 
                        question={test.questions[currentQuestion]} 
                        questionIndex={currentQuestion} 
                        selectedAnswer={answers[currentQuestion]} 
                        onSelect={handleSelect} 
                    />
                </div>
            </div>
        </div>
    );
};

export default TestPage;
