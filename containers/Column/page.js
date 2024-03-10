import React, { useState, useEffect } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Task from '@/components/Task/page'
import { useTaskContext } from '@/store/TaskContext'
import DeleteIcon from '@/components/svg/DeleteIcon'
import EditIcon from '@/components/svg/EditIcon'

function Column(props) {
    const { addTask } = useTaskContext()
    const { column, tasks, tbi } = props

    const addTaskInColumn = () => {
        let newTaskContent = prompt('Enter task content')
        if (newTaskContent) {
            addTask(newTaskContent, column.id)
        }
    }

    return (
        <Draggable key={column.id} draggableId={column.id.toString()} index={tbi}>
            {(provided) => (
                <Container
                    innerRef={provided.innerRef}
                    provided={provided}
                >
                    <Title
                        colId={column.id}
                        tbi={tbi}
                        provided={provided}
                    >
                        {column?.title} {tasks.length}
                    </Title>

                    <Droppable droppableId={column?.id} type='task'>
                        {(provided, snapshot) => (
                            <TaskList
                                innerRef={provided.innerRef}
                                provided={provided}
                                snapshot={snapshot}
                            >
                                {tasks?.map((task, index) => <Task key={task?.id} tid={task?.id} columnId={column.id} task={task} index={index} />)}
                                {provided.placeholder}
                            </TaskList>
                        )
                        }
                    </Droppable>
                    <button className="add-task w-full p-2 text-left mt-2 rounded hover:bg-gray-200" onClick={addTaskInColumn}>+ New</button>
                </Container>
            )}
        </Draggable>
    )
}

export default Column

const Title = (props) => {
    const { deleteColumn, updateColumn } = useTaskContext()
    const { colId, tbi, children, provided } = props
    const [showBtns, setShowBtns] = useState(false)

    const titleBgs = [
        'bg-pink-100',
        'bg-blue-100',
        'bg-green-100',
        'bg-yellow-100',
        'bg-purple-100',
        'bg-red-100',
        'bg-indigo-100',
    ]

    let titleBg = titleBgs[tbi] ? titleBgs[tbi] : titleBgs[tbi - titleBgs.length]

    return (
        <div className='flex h-6 gap-3 items-center' {...provided.dragHandleProps} onMouseEnter={() => setShowBtns(true)} onMouseLeave={() => setShowBtns(false)}>
            <h3
                className={`p-1 pl-2 pr-2 w-fit text-sm/3 rounded font-medium ${titleBg}`}
            >
                {children[0]}
            </h3>
            <p className='text-sm text-gray-400'>{children[2]}</p>

            {showBtns &&
                <div className=' flex items-center ml-auto text-gray-600 rounded bg-gray-100 border border-gray-300'>
                    <button className='text-xs p-1 rounded-s text-gray-600 hover:bg-gray-300' onClick={() => updateColumn(colId)}>
                        <EditIcon />
                    </button>
                    <button className='text-xs p-1 rounded-e border-s border-gray-300 text-gray-600 hover:bg-gray-300' onClick={() => deleteColumn(colId)}>
                        <DeleteIcon />
                    </button>
                </div>}
        </div>
    )
}

const Container = (props) => {
    const { children, innerRef, provided } = props;
    return (
        <div className='flex-none columns-3xs mr-4' ref={innerRef} {...provided.draggableProps}>
            {children}
        </div>
    )
}

function TaskList(props) {
    const { innerRef, provided, snapshot } = props
    const isDraggingOver = false;

    return (
        <ul className={`grow min-h-1 ${isDraggingOver ? " bg-purple-200" : ""}`} ref={innerRef} {...provided.droppableProps} >
            {props.children}
        </ul>
    )
}