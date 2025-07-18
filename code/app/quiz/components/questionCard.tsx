"use client"

import { useState, useEffect, useRef } from "react";
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import StarsEndOfQuiz from "@/app/components/starsEndOfQuiz";

type Question = {
  id: string;
  title: string;
  order: number;
  answers: {
      id: string;
      text: string;
      isCorrect: boolean;
      order: number;
  }[];
}

type QuestionCardProps = {
  currentQuestion: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerClick: (answerId: string, isCorrect: boolean) => void;
};

function QuestionBox({ text }: { text: string }) {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsTruncated(element.scrollHeight > element.clientHeight);
    }
  }, [text]);

  return (
    <div
      ref={textRef}
      className="flex items-center px-3 pt-2 pb-1.5 text-center h-[133px] md:max-h-[100px] overflow-hidden text-ellipsis line-clamp-3"
      title={isTruncated ? text : ""}
    >
      {text}
    </div>
  );
}

type AnswerProps = {
  text: string;
  selectedAnswer: string | null;
  isSelected: boolean;
  isCorrect: boolean;
  onClick: () => void;
  color: string;
}

function Answer({text, selectedAnswer, isSelected, isCorrect, onClick, color }: AnswerProps) {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    }
  }, [text]);

  return (
    <button
      ref={textRef}
      style={{ backgroundColor: color }}
      className="relative flex items-center justify-between text-white py-[19px] md:py-[14px] px-[10px] rounded-md drop-shadow-sm text-left
      max-h-[65px] md:max-h-[55px] overflow-hidden text-ellipsis whitespace-nowrap
      sm:hover:opacity-85 sm:active:opacity-85"
      title={isTruncated ? text : ""}
      onClick={onClick}
      disabled={selectedAnswer ? true : false} // Disable button after selecting an answer
    >
      {text}

      <span className="absolute right-[10px] top-1/2 -translate-y-1/2">
        {selectedAnswer && isCorrect ? 
          (
            <div className="bg-white rounded-full">
              <IoIosCheckmarkCircle className="text-correct w-8 h-8" />
            </div>
          ) 
        : isSelected ? 
          (
            <div className="bg-white rounded-full">
              <IoIosCloseCircle className="text-incorrect w-8 h-8" />
            </div>
          )
        : null
        }
      </span>
    </button>
  );
}

const answerColors = ["#D82C2C", "#3577BE", "#CDA735", "#2E9645"];


export default function QuestionCard({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerClick,
}: QuestionCardProps){
  const router = useRouter();
  return(
    <div className="flex flex-col bg-background-form rounded-md w-full md:w-[644px] px-4 md:px-[30px] pt-[15px] drop-shadow-md">
      <div className="flex justify-between items-center mb-[15px]">
        <span className="text-main-text">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <button 
          className="font-bold text-base bg-[#969DA5] text-white px-6 py-1 rounded-md sm:hover:bg-[#a9b1b8] sm:active:bg-[#a9b1b8] drop-shadow-sm"
          onClick={() => router.back()}
        >
          Quit
        </button>
      </div>
      <div className="flex justify-center items-center bg-off-white font-medium text-[20px] text-main-text md:h-[100px] rounded-md drop-shadow-md mb-[42px]">
        <QuestionBox text={currentQuestion.title}/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] md:gap-[9px] mb-[30px] text-[18px] font-medium">
        {currentQuestion.answers.map((answer, index) => (
          <Answer
            key={answer.id}
            text={answer.text}
            selectedAnswer={selectedAnswer}
            isSelected={selectedAnswer === answer.id}
            isCorrect={answer.isCorrect}
            onClick={() => onAnswerClick(answer.id, answer.isCorrect)}
            color={answerColors[index % answerColors.length]} 
          />
        ))}
      </div>
    </div>
  );
}

export function FinalBox({score, nOfQuestions, quizId}: {score: number, nOfQuestions: number, quizId: string}){
  const router = useRouter();
  const { data: session } = authClient.useSession();
  return(
    <div className="flex flex-col bg-background-form rounded-md w-4/5 sm:w-[438px] px-[15px] py-[15px] drop-shadow-md">
        <div className="flex justify-center items-center bg-off-white font-medium text-[20px] text-main-text h-[100px] rounded-md drop-shadow-md mb-[15px]">
          <QuestionBox text={`Your score: ${score}/${nOfQuestions}`}/>
        </div>
        {
          session &&
          <div className="flex flex-col sm:flex-row sm:space-x-2 mt-2 sm:mt-4 mb-4 sm:justify-center">
            <p className="font-medium text-lg text-main-text ml-2 sm:ml-0">Rate the Quiz!</p>
            <StarsEndOfQuiz quizId={quizId}/>
          </div>
        }
        <div className="flex justify-between sm:justify-evenly w-full space-x-2">
          <button 
            className="w-full sm:w-[88px] font-bold bg-accent text-main-text py-2 sm:py-1.5 rounded-md sm:hover:bg-[#ffd145] sm:active:bg-[#ffd145]"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
          <button 
            className="w-full sm:w-[88px] font-bold bg-correct text-white py-2 sm:py-1.5 rounded-md sm:hover:bg-[#48b561] sm:active:bg-[#48b561] "
            onClick={() => router.back()}
          >
            Exit
          </button>
        </div>
    </div>
  );
}