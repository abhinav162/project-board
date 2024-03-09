import React, { useState, useEffect } from 'react'
import Column from '@/containers/Column/page';
import { useTaskContext } from '@/store/TaskContext';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

function ProjectBoard(props) {
    const { db, addColumn, updateDb, isBoardEmpty } = useTaskContext()

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({})

    useEffect(() => {
        if (db) {
            setData(db)
            setLoading(false)
        }
    }, [db])

    console.log(data)   

    const handleAddColumn = () => {
        let newColumnTitle = prompt('Enter column title')
        if (newColumnTitle) {
            addColumn(newColumnTitle)
        }
    }

    const onDragEnd = result => {
        const { destination, source, draggableId, type } = result;

        if (!destination) {
            return
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        if (type === 'column') {
            const newColumnOrder = Array.from(data.columnOrder);
            newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, draggableId);

            const newState = {
                ...data,
                columnOrder: newColumnOrder
            }

            setData(newState)
            updateDb(newState)
            return
        }

        const start = data.columns[source.droppableId];
        const finish = data.columns[destination.droppableId];

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                taskIds: newTaskIds
            }

            const newState = {
                ...data,
                columns: {
                    ...data.columns,
                    [newColumn.id]: newColumn
                }
            }

            setData(newState)
            updateDb(newState)
            return;
        }

        // moving from one column to another
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);

        const newStart = {
            ...start,
            taskIds: startTaskIds,
        }

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
        }

        const newState = {
            ...data,
            columns: {
                ...data.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            }
        }

        setData(newState)
        updateDb(newState)
    }

    return (
        <DragDropContext
            onDragEnd={onDragEnd}
        >
            {loading && <h1>Loading...</h1>}
            {(!loading && !isBoardEmpty) && <Droppable droppableId='all-clm' direction='horizontal' type='column'>
                {(provided) => (
                    <Container
                        data={data}
                        setData={setData}
                        innerRef={provided.innerRef}
                        provided={provided}
                        handleAddColumn={handleAddColumn}
                    >
                        {provided.placeholder}
                    </Container>
                )}
            </Droppable>}
            {
                (!loading && isBoardEmpty) && <button
                    className='flex justify-center items-center h-full w-full'
                    onClick={handleAddColumn}
                >
                    <h1 className='text-2xl bg-gray-100 p-3 pl-6 pr-6 rounded-md text-center hover:bg-gray-200'>+ Create Project Board</h1>
                </button>
            }
        </DragDropContext>
    )
}

export default ProjectBoard

const Container = (props) => {
    const { data, innerRef, provided, handleAddColumn } = props

    return (
        <main className='flex justify-start p-5 overflow-x-scroll' ref={innerRef} {...provided.droppableProps}>
            {
                data?.columnOrder?.map((columnId, tbi) => {
                    const column = data.columns[columnId];
                    const tasks = column?.taskIds?.map(taskId => data.tasks[taskId]);

                    return <Column tbi={tbi} key={column?.id} column={column} tasks={tasks} />
                })
            }
            <button className='w-11 text-2xl rounded hover:bg-gray-200' onClick={handleAddColumn}>+</button>
        </main>
    )
}