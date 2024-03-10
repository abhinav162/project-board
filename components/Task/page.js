import React, { useState, useEffect } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import axiosInstance from '@/axios';
import { useTaskContext } from '@/store/TaskContext';
import EditIcon from '../svg/EditIcon';
import DeleteIcon from '../svg/DeleteIcon';

function Task(props) {
    return (
        <Draggable key={props?.task?.id} draggableId={props?.task?.id?.toString()} index={props.index}>
            {(provided, snapshot) => (
                <Container
                    {...props}
                    innerRef={provided.innerRef}
                    provided={provided}
                    snapshot={snapshot}
                >
                    {props.task?.content}
                </Container>
            )
            }
        </Draggable>
    )
}

export default Task;

const Container = (props) => {
    const { tid, provided, innerRef, children, snapshot, columnId } = props
    const isDragging = snapshot.isDragging;

    const [task, setTask] = useState(children)
    const [isEditing, setIsEditing] = useState(false)
    const [showBtns, setShowBtns] = useState(false)
    console.log("tid:", tid, "colId:", columnId)

    const cssClasses = `
        mt-2
        p-2
        text-sm
        font-medium
        rounded
        border
        bg-white
        ${isDragging ? "" : " "}
        drop-shadow-md
        flex
        justify-between
        items-center
    `

    const { db, updateTask, deleteTask } = useTaskContext()

    useEffect(() => {
        if (db) {
            // console.log(db)
        }
    }, [db])

    return (
        <>
            {isEditing ? (
                <div className={``}>
                    <input
                        className={`w-full h-11 ${cssClasses} border-gray-500 drop-shadow-none`}
                        type="text"
                        value={task}
                        onChange={(e) => {
                            setTask(e.target.value)
                        }}
                        onBlur={() => {
                            if (task.length > 0) {
                                setIsEditing(false)
                                updateTask(tid, task)
                            } else {
                                alert('Task cannot be empty')
                            }
                        }}
                    />
                </div>
            ) : (
                <div className={`${cssClasses} h-11`} ref={innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onMouseOver={() => setShowBtns(true)} onMouseLeave={() => setShowBtns(false)}>
                    {children}
                    {
                        showBtns && (
                            <div className=' h-min flex rounded bg-gray-100 border  border-gray-300'>
                                <button
                                    className='text-xs p-1 rounded-s text-gray-600 hover:bg-gray-300'
                                    onClick={() => {
                                        setIsEditing(true)
                                    }}
                                >
                                    <EditIcon />
                                </button>
                                <button
                                    className='text-xs p-1 rounded-e border-s border-gray-300 text-gray-600 hover:bg-gray-300'
                                    onClick={() => {
                                        console.log('delete')
                                        deleteTask(tid, columnId)
                                    }}
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        )
                    }
                </div>
            )}
        </>
    )
}