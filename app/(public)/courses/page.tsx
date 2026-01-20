import { ReturnCourses } from '@/app/data/course-not-admin/get-all-course'
import React, { Suspense } from 'react'
import { PublicCourseCart, PublicCourseSkeleton } from '../_components/PublicCourseCart'

export default function PublicCoursesRoute(){
    return (
        <div className='mt-5'>
            <div className='flex flex-col space-y-2 mb-10'>
                <h1 className='text-3xl font-bold tracking-tight md:text-4xl '>Explore Courses</h1>
                <p className='text-muted-foreground'>Discover our wide range of courses to help you achieve your learning goals</p>
            </div>
            <Suspense fallback={<LoadingSkeleton/>}>
            <RenderCourses/>
            </Suspense>
        </div>
    )
}

async function RenderCourses(){
    const data=await ReturnCourses()
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 '>
            {data.map((course)=>(
                <PublicCourseCart key={course.id} data={course}/>
            ))}
        </div>
    )
}

function LoadingSkeleton(){
    return(
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {
                Array.from({length:9}).map((_,index)=>(
                    <PublicCourseSkeleton key={index}/>
                ))
            }
        </div>
    )
}