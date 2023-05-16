import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams ,NavLink } from "react-router-dom";

import style from "../StudentDashboard.module.css";
import baseUrl from "../../../baseUrl";

function Exam() {
  const { category } = useParams();
  const [allExam, setAllExam] = useState([]);

  useEffect(() => {
    async function getAllExams() {
      console.log(`Making a GET request to ${baseUrl}/exam`);
      let value = await axios.get(`${baseUrl}/exam`);
      console.log(`Response from ${baseUrl}/exam:`, value.data);
      setAllExam(value.data);
    }
    getAllExams();
  }, []);

  const filteredExams = allExam.filter(data => data.name.name === category);
  console.log(`All exams:`, allExam);
  console.log(`Exams filtered by category "${category}":`, filteredExams);

  return (
    <>
      <div id={style.displayBoxHeadingBox}>
        <h1>All {category} Exam</h1>
      </div>
      {
        filteredExams.length > 0 ?
          filteredExams.map((data, i) => (
            <div id={style.displayBoxExamBox} key={i}>
              <div id={style.div1}> <span>{data.name.name}</span> </div>
              <div id={style.div2}> <span>Exam ID: {data.id}</span> </div>
              <div id={style.div2}> <span>Exam Description: {data.desc}</span> </div>
              <div id={style.div3}><span>Pass Marks:{data.passMarks}</span> </div>
              <div id={style.div4}><span>Total Marks:{data.marks}</span></div>
              <div id={style.div4}><span>Total Time:{data.time} min</span></div>
              <div id={style.div5}>
                <NavLink exact to={`/StudentDashboard/Exam/${category}/${data.id}`}>
                  <button>Go to Exam</button>
                </NavLink>
              </div>
            </div>
          )) :
          <div>
            <h2>No exams found for category "{category}" </h2>
            </div>
      }
    </>
  );
}

export default Exam;
