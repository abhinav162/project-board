"use client";

import React, { useContext } from 'react'
import { useState } from 'react'
import initialData from './initial-data'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from '@/containers/Column/page';
import dynamic from 'next/dynamic';
import { TaskProvider, useTaskContext } from '@/store/TaskContext';
// import ProjectBoard from '@/containers/ProjectBoard/page';

const ProjectBoard = dynamic(() => import('@/containers/ProjectBoard/page'), {
  ssr: false
})

export default function Home() {
  return (
    <>
      <TaskProvider>
        <h1 className=' mb-4 text-center text-2xl text-gray-800 m-auto p-5 pb-0'>Project Board</h1>
        <ProjectBoard />
      </TaskProvider>
    </>
  )
}
