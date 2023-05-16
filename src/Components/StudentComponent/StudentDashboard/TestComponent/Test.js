

import axios from "axios";

import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import style from "../StudentDashboard.module.css";

import baseUrl from "../../../baseUrl";

function Test() {

    // ---------------------------------------------------------
    let { id } = useParams();
    let { category } = useParams();

    const [allQuestions , setAllQuestions] = useState([]);
    const [PassMarks ,setPassMarks] = useState("");
    const [totalQuestion , settotalQuestion] = useState("");
    const [totalMarks, settotalMarks] = useState("");
    const [answer , setAnswer] = useState("");
    const [time, setTime] = useState(100); // 90 minutes = 5400 seconds
    const [timer, setTimer] = useState(null);


    useEffect(() => {
        async function getAllQuestions(){
            let value = await axios.get(`${baseUrl}/exam/${id}/question`);
            setAllQuestions(value.data);
            console.log(value.data)
            console.log(value.data[0].ename.passMarks);
            setPassMarks(value.data[0].ename.passMarks);
            settotalQuestion(value.data[0].ename.totalQuestion);
            settotalMarks(value.data[0].ename.marks);
            setTime(parseInt(value.data[0].ename.time) * 60);

        }
        getAllQuestions();
    },[id]);

    useEffect(() => {
    if (time === 0) {
        clearInterval(timer);
        submitTest();
    }
    }, [time]);

    useEffect(() => {
    setTimer(setInterval(() => {
        setTime(prevTime => prevTime - 1);
    }, 1000));

    return () => clearInterval(timer);
    }, []);



    let  correctAnswer  = [] ;
    
    function onRadioButtonChange(e){
       setAnswer({
            ...answer, 
            [e.target.name] : e.target.value
    });
    }

   
      
       

    let count = 0;
    


    async function submitTest()
    {
        for(let i=0; i<allQuestions.length ;i++)
        {
             correctAnswer.push( allQuestions[i].answer);
        }


        console.log(answer);
        console.log(correctAnswer);

        let score = 0;
        let status = "";

        console.log(answer['answer'+1])

        for(let i=-1; i<allQuestions.length-1;i++)
        {
            let variable = "answer"+(i+1);
            if(correctAnswer[i] === answer[variable]) score++;

        }

        
            // if(correctAnswer[0] === answer.answer1) score++;
            // if(correctAnswer[1] === answer.answer2) score++;
            // if(correctAnswer[2] === answer.answer3) score++;
            // if(correctAnswer[3] === answer.answer4) score++;
            // if(correctAnswer[4] === answer.answer5) score++;
        
        console.log(score);

  
         if(score >= PassMarks) status="Pass";
         else status = "Fail";

        


        var date = new Date();
        var d =  date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() ;
        var t =  date.getHours() + ":" + date.getMinutes() +  ":" + date.getSeconds() ;
   
       let data={
         "status": status,
         "score": score,
         "email":{"email":sessionStorage.getItem("user")},    // email
         "edate": d+" "+t,
         "sname": {"name":category},   // --  subject name
         "totalMarks": totalMarks,
         "examId": {"id":id},         // exam id
         "totalQuestion": totalQuestion
       };

       console.log(data);
 
       await axios.post(`${baseUrl}/result` , data);
        history.push("/StudentDashboard/Result");
    }

     let history = useHistory();

    return (
        <div>
            <div id={style.displayBoxQuestionHeadingBox}>
                <h1>Answer all the questions</h1>
            </div>
            <div id={style.timer}><h2>Time Remaining: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')} </h2></div>

            {
                 
                allQuestions.map((data , i) => {
                        count++;
                    return (
                        <div id={style.displayBoxQuestionBox} key={i}>
                        <div id={style.divQuestion}> <span>{data.qname}</span> </div>
        
                        <div>
                            <input onChange={(e) => onRadioButtonChange(e)} value={data.optionOne}
                            id={style.option1} name={"answer"+count}   type="radio" />  
                            <label htmlFor="option1">{data.optionOne}</label>
                        </div>
        
                        <div>
                            <input onChange={(e) => onRadioButtonChange(e)} value={data.optionTwo}
                            id={style.option2} name={"answer"+count} type="radio" /> 
                            <label htmlFor="option2">{data.optionTwo}</label>
                        </div>
        
                        <div>
                            <input onChange={(e) => onRadioButtonChange(e)} value={data.optionThree}
                            id={style.option3} name={"answer"+count}  type="radio" /> 
                            <label htmlFor="option3">{data.optionThree}</label>
                        </div>
        
                        <div>
                            <input onChange={(e) => onRadioButtonChange(e)} value={data.optionFour}
                            id={style.option4} name={"answer"+count}  type="radio" /> 
                            <label htmlFor="option4">{data.optionFour}</label>
                        </div>
                    </div>
                    );
                  
                })
            }
            <div id={style.submitExam}><button onClick={submitTest}>Submit Exam</button></div>
        </div>
    );
}

export default Test