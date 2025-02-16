import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import Footer from '../../components/student/Footer';
import Rating from '../../components/student/Rating';
const Player = () => {

    const {enrolledCourses, calculateChapterTime} = useContext(AppContext)
    const {courseId} = useParams()
    const [courseData, setCourseData] = useState(null)
    const [openSections, setOpenSections] = useState({})
    const [playerData, setPlayerData] = useState(null)

    const getCourseData = ()=>{
        enrolledCourses.map((course)=>{
            if(course._id === courseId){
                setCourseData(course)
            }
        })
    }

    const toggleSection = (index)=>{
        setOpenSections((prev)=>(
            {...prev,
                [index]:!prev[index]
            }
        ))
    }
    useEffect(()=>{
        getCourseData()
    },[enrolledCourses])

    return (
    <>
        <div className='p-4 sm:[-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>

            <div className='text-gray-800'>
                <h2 className='text-xl font-semibold'>Course Structure</h2>
                <div className='pt-5'>
                        { courseData && courseData.courseContent.map((chapter,index)=> (
                            <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                                <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'
                                onClick={()=>toggleSection(index)}>
                                    <div className='flex items-center gap-2'>
                                        <img className={`transform transition-transform ${openSections [index] ? 'rotate-180' : ''}`} 
                                        src={assets.down_arrow_icon} alt="arrow icon" />
                                        <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                                    </div>
                                    <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                                </div>

                                <div className={`overflow-hidden transition-all duration-300 ${openSections[index]?'max-h-96':'max-h-0'}`}>
                                    <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                                        {chapter.chapterContent.map((lecture, i)=> (
                                            <li className='flex items-start gap-2 py-1' key={i}>
                                                <img src={false ? assets.blue_tick_icon : assets.play_icon} alt="play icon" 
                                                className='w-4 h-4 mt-1'/>
                                                <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                                                    <p>{lecture.lectureTitle}</p>
                                                    <div className='flex gap-2'>
                                                        {lecture.lectureUrl && <p
                                                        onClick={() => setPlayerData({ 
                                                            ...lecture, chapter: index+1, lecture: i+1
                                                        })}
                                                         className='text-blue-500 cursor-pointer'>Watch</p>}
                                                        <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, {units:['h','m']})}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                
                <div className='flex items-center gap-2 py-3 mt-10'>
                    <h1 className='text-xl font-bold'>Rate this Course:</h1>
                    <Rating initialRating={0}/>
                </div>
                

             </div>

            <div className='md:mt-10'>
                {playerData ? (
                    <div>
                        <YouTube videoId={playerData.lectureUrl.split('/').pop()}  iframeClassName='w-full aspect-video'/>
                        <div className='flex justify-between items-center mt-1'>
                            <p>
                                {playerData.chapter}.{playerData.lecture}{playerData.lectureTitle}
                            </p>
                            <button className='text-blue-600'>
                                {false ? 'Completed':'Mark Complete'}
                            </button>
                        </div>
                    </div>
                )
                :
                <img src={courseData ? courseData.courseThumbnail : ''} alt="" />
                }
                <div className="bg-white shadow-lg rounded-lg p-6 mt-10 max-w  mx-auto">
                    <h1 className="text-xl font-bold text-gray-900 mb-4">
                        Please complete the course to view your certificate
                    </h1>

                    <div className="border-t border-gray-300 pt-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            🎓 Certificate Details
                        </h2>
                        <p>🔹 <strong>Certificate ID:</strong> #123456789ABCDEF</p>
                        <p>🔹 <strong>Issued To:</strong> Nguyen Van A</p>
                        <p>🔹 <strong>Course:</strong> Blockchain Development with Cardano</p>
                        <p>🔹 <strong>Issuer:</strong> LMS Blockchain Academy</p>
                        <p>🔹 <strong>Date Issued:</strong> February 16, 2025</p>
                        <p>🔹 <strong>Status:</strong> ✅ Verified on Cardano Blockchain</p>
                        <p>
                            🔹 <strong>Blockchain Transaction:</strong> 
                            <a href="#" className="text-blue-600 hover:underline"> View on Explorer</a>
                        </p>
                        <p>
                            🔹 <strong>Download PDF:</strong> 
                            <a href="#" className="text-blue-600 hover:underline"> Download Here</a>
                        </p>
                        </div>
                </div>
            </div>
            
        </div>
        <Footer/>
    </>
    );
}

export default Player;
