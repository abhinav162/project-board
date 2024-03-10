import React, { createContext, useState, useContext, useEffect } from 'react';
import initialData from '@/app/initial-data';

const TaskContext = createContext();

// const initialData = {
//     project: {
//         id: '',
//         title: '',
//     },
//     tasks: {
//     },
//     columns: {

//     },
//     columnOrder: []
// };


export const TaskProvider = ({ children }) => {
    const localStorageData = typeof localStorage !== 'undefined' ? localStorage.getItem('project-data') : null;


    useEffect(() => {
        if (localStorageData === undefined || localStorageData === null) {
            localStorage.setItem('project-data', JSON.stringify(initialData));
        }
    }, []);

    const [db, setDb] = useState(localStorageData ? JSON.parse(localStorageData) : initialData)

    useEffect(() => {
        localStorage.setItem('project-data', JSON.stringify(db));
    }, [db]);

    const checkIfEmpty = () => {
        return Object.keys(db.columns).length === 0;
    }

    const isProjectEmpty = () => {
        return db.project === undefined || Object.keys(db.project).length === 0;
    }

    const createProject = () => {
        let title = prompt('Enter Project Name');
        let newProjectID = ""

        if (isProjectEmpty()) {
            newProjectID = `project-1`;
        }
        else {
            newProjectID = `project-${Object.keys(db.project).length + 1}`;
        }

        let newProject = {
            id: newProjectID,
            title: title
        };

        let newDb = {
            ...db,
            project: newProject
        };

        setDb(newDb);
    }

    const deleteProject = (projectId) => {
        let newDb = {
            ...db,
            project: {},
            tasks: {},
            columns: {},
            columnOrder: []
        };

        setDb(newDb);
    }

    const addColumn = (title) => {
        let newColumnId = `column-${Object.keys(db.columns).length + 1}`;
        let newColumn = {
            id: newColumnId,
            title: title,
            taskIds: []
        };

        let newDb = {
            ...db,
            columns: { ...db.columns, [newColumnId]: newColumn },
            columnOrder: [...db.columnOrder, newColumnId]
        };

        setDb(newDb);
    }

    const addTask = (task, columnId) => {
        let newTaskId = `task-${Object.keys(db.tasks).length + 1}`;
        let newTask = { id: newTaskId, content: task };

        let newColumn = db.columns[columnId];
        newColumn.taskIds.push(newTaskId);

        let newDb = {
            ...db,
            tasks: { ...db.tasks, [newTaskId]: newTask },
            columns: { ...db.columns, [columnId]: newColumn }
        };

        console.log(newDb);
        setDb(newDb);
    }

    const updateDb = (newDb) => {
        localStorage.setItem('project-data', JSON.stringify(newDb));
        setDb(newDb);
    }

    const updateTask = (taskId, newContent) => {
        let newDb = {
            ...db,
            tasks: {
                ...db.tasks,
                [taskId]: {
                    ...db.tasks[taskId],
                    content: newContent
                }
            }
        };

        updateDb(newDb);
    }

    const updateColumn = (columnId) => {
        let newTitle = prompt('Enter new title for column');
        if (newTitle) {
            let newDb = {
                ...db,
                columns: {
                    ...db.columns,
                    [columnId]: {
                        ...db.columns[columnId],
                        title: newTitle
                    }
                }
            };

            updateDb(newDb);
        }
    }

    const deleteTask = (taskId, columnId) => {
        let newColumn = db.columns[columnId];
        newColumn.taskIds = newColumn.taskIds.filter(id => id !== taskId);

        let newDb = {
            ...db,
            columns: { ...db.columns, [columnId]: newColumn },
            tasks: { ...db.tasks, [taskId]: undefined }
        };

        updateDb(newDb);
    }

    const deleteColumn = (columnId) => {
        let tasksToDelete = db.columns[columnId].taskIds;
        let newTasks = { ...db.tasks };
        tasksToDelete.forEach(taskId => newTasks[taskId] = undefined);


        let newColumns = { ...db.columns };
        newColumns[columnId] = undefined;

        let newColumnOrder = db.columnOrder.filter(id => id !== columnId);

        let newDb = {
            ...db,
            tasks: newTasks,
            columns: newColumns,
            columnOrder: newColumnOrder
        };

        setDb(newDb);
    }

    return (
        <TaskContext.Provider value={{ db, addTask, addColumn, isBoardEmpty: checkIfEmpty(), updateDb, updateTask, deleteTask, deleteColumn, updateColumn, createProject, isProjectEmpty: isProjectEmpty(), deleteProject }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => useContext(TaskContext);
