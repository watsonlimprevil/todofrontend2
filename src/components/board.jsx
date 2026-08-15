import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../Api/client";
import { DragDropContext } from "@hello-pangea/dnd";

import List from "../components/List";
import CreateListModal from "../components/CreateListModal";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskDetailsModal from "../components/TaskDetailsModal";
import EditBoardModal from "../components/EditBoardModal";
import { BoardProvider } from "./BoardContext";
import { API_URL } from "../api";

export default function Board(){
    const { id } = useParams();
    const nav = useNavigate();

    const [ lists , setLists ] = useState([]);

    const [ listsTitle , setListTitle ] = useState('');
    const [showListModal , setShowListModal] = useState(false);
    const [titleToEdit , setTitleToEdit] = useState('');
    const [showRenameListModal , setShowRenameListModal] = useState(false);
    const [renameListId , setRenameListId] = useState(null);
    const [selectedTask , setSelectedTask] = useState(null);
    const [showTaskModal , setShowTaskModal] = useState(false);
    const [taskTitle , setTaskTitle] = useState('');
    const [activeListId , setActiveListId] = useState(null);

    const [showTaskDetailsModal , setShowTaskDetailsModal] = useState(false);
    const [showSubtasksModal , setShowSubtaskModal] = useState(false);

    useEffect(()=>{
       async function loadBoard(){
        const listsFromServer = await(`${API_URL}/lists/${id}`,{
           header: {'Content-type' : 'application/json'}
        })
        const updatedlists = await listsFromServer.json();
        const listWithTasks = await Promise.all(
            lists.map(async (list) => {
                const res = await fetch(`${API_URL}/tasks/${list.id}`,{
                    headers:{'Content-type' : 'application/json'}
                })
                const tasks = await listWithTasks.json()
                return {...list , tasks}
            })
        )

        setLists(updatedlists)
       }

       loadBoard
    },[id]);

    async function handleCreateList(){
        const res = await fetch(`${API_URL}/lists/${id}` , {
            method : 'POST',
            headers : {'Content-type' : 'application/json'},
            body: JSON.stringify({title : listsTitle})
        })

        const data = await res.json()

        setLists(prev => [...prev , {...data , tasks : []}])
    }


    function openTaskModal(listId){
        setActiveListId(listId);
        setShowTaskModal(true)
    }

    async function handleCreateTask(){
        const res = await fetch(`${API_URL}/tasks/${activeListId}`,{
            method : 'POST' ,
            body : JSON.stringify({title : taskTitle})
        });

        const newTask = await res.json();

        const updatedLists = lists.map((list) =>{
            list.id === activeListId 
            ? {...list , tasks: [...(list.tasks || []) , newTask]}
            : list
        })
        setLists(updatedLists);
        setShowTaskModal(false);
        setTaskTitle("")
    }

    async function handleToggleCompleted(task , value){
        const updated = await fetch(`${API_URL}/tasks/${task.id}`,{
            method : 'PATCH',
            body: JSON.stringify({
                title: task.title,
                description: task.description,
                priority: task.priority,
                due_date: task.due_date,
                completed : value,
                list_id: task.list_id
            })
        });

        const newLists = lists.map((list) => ({
            ...list,
            tasks: list.tasks.map((t) => (t.id === updated.id ? updated : t))
        }))
        setLists(newLists)
    }

    async function handleDeleteList(listId){
        if(!window.confirm('Delete this lisr')) return

        await fetch(`${API_URL}/list/${listId}`,{
            method: 'DELETE'
        })

        const updated = lists.filter((list) => list.id !==listId)
        setLists(updated)
    }


    async function handleRenameList(){
        const res = await fetch(`${API_URL}/lists/${renameListId}`, {
            method : 'PATCH',
            body : JSON.stringify({title : titleToEdit})
        });
        const updatedlist = await res.json();
        const updatedLists = lists.map((list)=>
        list.id === renameListId ? { ...list , ...updatedLists} : list);

        setLists(updatedLists);
        setShowRenameListModal(false);
        setTitleToEdit('');
    }


    async function handleDeleteTask(taskId , listId){
        await fetch(`${API_URL}/tasks/${taskId}`, {
            method : 'DELETE'
        })

        const updatedLists = lists.map((list) => 
        list.id === listId 
        ? { ...list , tasks:list.tasks.filter((task)=> task.id !== taskId)} : list
        )
        setLists(updatedLists)
    }

    async function handleUpdateTask(){
        const res = await fetch(`${API_URL}/tasks/${selectedTask.id}`, {
            method : 'PATCH',
            body : JSON.stringify({
                title : selectedTask.title,
                description: selectedTask.description,
                priority: selectedTask.priority,
                due_date: selectedTask.due_date,
                completed : selectedTask.completed
            })
        });

        const updated = await res.json()

        const newLists = lists.map((list) =>{
            if(list.id !== selectedTask.list_id) return list;

            return {
                ...list,
                tasks: list.tasks.map((t)=> (t.id === updated.id ? updated : t))
            }
        });

        setLists(newLists);
        setShowTaskDetailsModal(false);
        setSelectedTask(null);

    }


    function handleDrageEnd(result){
        const { source , destination } = result;

        if(!destination) return;

        const sourceListId = parseInt(source.droppableId);
        const destListId = parseInt(destination.droppableId);

        const sourceList = lists.find((list) => list.id === sourceListId)
        const destList = lists.find((list)=> list.id === destListId)

        const sourceTasks = Array.from(sourceList.tasks || []);
        const [movedTask] = sourceTasks.splice(source.index , 1);

        if(sourceListId === destListId){
            sourceTasks.splice(destination.index , 0 , movedTask)
            const reindexed = sourceTasks.map((task, index)=> ({
                ...task,
                position: index
            }));

           const updatedLists = lists.map((list) =>
        list.id === sourceListId ? {...list , tasks: reindexed} : list
        )
        setLists(updatedLists)
        }else{
            const destTasks = Array.from(destList.tasks || [])
            destTasks.splice(destination.index , 0 , movedTask)

            const reindexedSource = sourceTasks.map((task, index) => ({
                ...task,
                position: index
            }));

            const reindexedDest = destTasks.map((task , index)=>({
                ...task,
                position: index
            }));
            const updatedLists = lists.map((list) => {
                if(list.id === sourceList)
                    return {...list , tasks: reindexedSource};
                if(list.id === destListId)
                    return{...list , tasks: reindexedDest};
                return list
            })
            setLists(updatedLists)
        }
    }


    return(
        <BoardProvider 
        value={{
            setSelectedTask ,
            setShowTaskDetailsModal ,
            handleToggleCompleted,
            handleDeleteTask
          }}
          >
            <div className="board-page" style={{ padding : '20px'}}>
                <button 
                style={{
                    padding : '10px 20px',
                    background: 'linear-gradient(135deg , #2a2a2a, #3d3d3d)',
                    border : 'none',
                    borderRadius : '8px',
                    cursor : 'pointer',
                    marginBottom : '20px',
                    color : 'white',
                    fontWeight : '500'
                }}
                onClick={() => nav('/boards')}
                >
                    Back to boarss
                </button>
                <h1>Board #{id}</h1>
                <button 
                onClick={()=> setShowListModal(true)}
                style={{
                    padding : '10px 20px',
                    background : '#2196fe',
                    border : 'none',
                    borderRadius:'6px',
                    cursor : 'pointer',
                    marginBottom: '20px'
                }}
                >
                    + New List
                </button>

                {showListModal && (
                    <CreateListModal 
                        listTitle={listTitle}
                        setListTitle={setListTitle}
                        onCreate={handleCreateList}
                        onClose={() => {
                        setShowListModal(false);
                        setListTitle("");
                        }}
                    />
                )}
                {showTaskModal && (
                    <CreateTaskModal 
                       listTitle={listTitle}
                       setListTitle={setListTitle}
                       onCreate={handleCreateList}
                       onClose={() => {
                        setShowListModal(false);
                        setListTitle("");
                    }}
                    />
                   )}

                   {showTaskDetailsModal && selectedTask &&(
                    <TaskDetailsModal 
                     task={selectedTask}
                     setTask={setSelectedTask}
                     onSave={handleUpdateTask}
                      onClose={() => {
                      setShowTaskDetailsModal(false);
                     setSelectedTask(null);
                      }}
                     showSubtasksModal={showSubtasksModal}
                      setShowSubtasksModal={setShowSubtasksModal}
                    
                    />
                   )}

                   <DragDropContext onDragEnd={handleDrageEnd}>
                    <div style={{display : 'flex' gap : '20px', marginTop : '20px'}}>
                        {lists.map((list) => (
                            <List
                            key={list.id}
                             list={list}
                             onRename={(id) => {
                             setRenameListId(id);
                             setShowRenameListModal(true);
                             }}
                             onDelete={handleDeleteList}
                             onAddTask={openTaskModal}
                           showRenameListModal={showRenameListModal}
                             renameListId={renameListId}   
                              TitleToEdit={TitleToEdit}
                              setTitleToEdit={setTitleToEdit}
                              handleRenameList={handleRenameList}
                              />
                             ))}
                            </div>
                
                   </DragDropContext>

            </div>

        </BoardProvider>
    )

}