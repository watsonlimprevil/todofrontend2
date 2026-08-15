import { useEffect, useState } from "react"
import { useActionData, useParams } from "react-router-dom"
import { API_URL } from "../api"
import { useNavigate } from "react-router-dom"
import App from "../App"

export default function Board(){
    const { id } = useParams()
    const [ lists , setLists ] = useState([])
    const [ createListModal , setCreateListModal] = useState(false)
    const [ title , setTitle ] = useState('')
    const [ renameTitle , setRenameTitle ] = useState('')
    const [ tasks , setTasks] = useState('')
    const [ listTitle , setlistTitle ] = useState('')
    const [ taskTitle , setTasktitle] = useState('')
    const [renameModal , setRenameModal ] = useState(false)
    const nav = useNavigate()
  useEffect(() => {
    async function loadBoards (){
        const res = await fetch(`${API_URL}/lists/${id}` , {
            headers : {'Content-type' : 'application/json'}
        })
        const data = await res.json();
        const listWithTasks = await Promise.all(
            data.map(async (list) => {
                const tasksList = await fetch(`${API_URL}/tasks/${list.id}`, {
                    headers : {'Content-type' : 'application/json'}
                })
                const tasks = await tasksList.json();
                return {...list , tasks}
            })
        )
        setLists(listWithTasks)
    }
        loadBoards()
      },[id]);

      async function addList(){
        const res = await fetch(`${API_URL}/lists/${id}`, {
            method : 'POST',
            headers : {'Content-type' : 'application/json'},
            body : JSON.stringify({title : listTitle})
        })
        const data = await res.json();
       setLists(prev => [...prev , {...data , tasks:[]}])
      }

      async function deleteList(listId){
        const res = await fetch(`${API_URL}/lists/${listId}` , {
            method : 'DELETE' ,
            headers : {'Content-type' : 'application/json'}
        })

        setLists(list => list.filter(p => p.id !== listId))
      }

      async function renameList(listId){
        const res = await fetch(`${API_URL}/lists/${listId}` , {
            method : 'PATCH' ,
            headers : {'Content-type' : 'application/json'},
            body : JSON.stringify({title : renameTitle})
        })
        const updated = await res.json()

        setLists(prev => 
            prev.map(list => 
                list.id === listId ?
               {...list, title: updated.title}
                : list
            )
        )
      }

      async function addTask(listId , taskId){
        const res = await fetch(`${API_URL}/tasks/${listId}` , {
            method : 'POST' ,
            headers : {'Content-type' : 'application/json'},
            body : JSON.stringify({title : taskTitle})
        })
        const data = await res.json();

        setLists(prev => 
            prev.map(list =>
                list.id === listId ?
                {...list , tasks: [...list.tasks , data]}
                : list
            )
        )
      }

      async function deleteTask(taskId , listId){
        const res = await fetch(`${API_URL}/tasks/${taskId}` , {
            method : 'DELETE',
            headers : {'Content-type' : 'application/json'}
        })
        setLists(prev => 
            prev.map(list => 
                list.id === listId ?
                {...list , tasks : list.tasks.filter(p => p.id !==taskId)}
                : list
            )
        )
      }

      return(
        <div>
            <button onClick={() => nav('/boards')}>Back To Boards</button>
            <h3>board{id}</h3>
            <button 
            style={{
                background : '#2e2e',
                cursor : 'pointer'
            }}
            onClick={()=> setCreateListModal(true)}
            >New List</button>

            {createListModal && (
                <CreateList />
            )}
            {list.map(list=> 
                <div> 
                    <h3>{list.title}</h3>
                    <button 
                    onClick={ () => {
                        setRenameModal(true);
                        setRenameTitle(list.id)
                    }}
                    style={{
                        backgroundColor : 'blue'
                    }}

                    >
                        rename List
                    </button>
                    <button
                   onClick={() => deleteList(list.id)}
                    >Delete List</button>

                    {list.tasks.map(list => (
                        <Task />
                    ))}
                </div>
            )}



        </div>
      )
}