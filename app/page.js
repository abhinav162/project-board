"use client";

import React, { useContext } from 'react'
import { useState } from 'react'
import initialData from './initial-data'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from '@/containers/Column/page';
import { TaskProvider, useTaskContext } from '@/store/TaskContext';
import ProjectBoard from '@/containers/ProjectBoard/page';

export default function Home() {
  return (
    <>
      <TaskProvider>
        <h1 className='text-2xl text-gray-800 m-auto font-bold p-5 pb-0'>Project Board</h1>
        <ProjectBoard />
      </TaskProvider>
    </>
  )
}
