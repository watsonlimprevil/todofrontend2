import { useEffect, useState } from "react"
import { useActionData, useParams } from "react-router-dom"
import { API_URL } from "../api"
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
                const tasks = await res.json();
                return {...list , tasks}
            })
        )
        setLists(listWithTasks)
    }
        loadBoards()
      },[id]);


      async function addLists(){
        const res = await fetch(`${API_URL}/lists/${id}` , {
            method: 'POST',
            headers : {'Content-type' : 'application/json'},
            body : JSON.stringify({title : listTitle})
        })

        const data = await res.json();
        setLists(prev => [...prev , {data , task:[]}])
      }

      async function deleteList(listId){
         await fetch(`${API_URL}/lists/${listId}` , {
            method : 'DELETE' ,
            headers : {'Content-type' : 'application/json'}
        });
        setLists(prev => prev.filter(list => list.id !== listId))
      }


      async function renameList (listId){
        const res = await fetch(`${API_URL}/lists/${listId}`,{
            method : 'Patch',
            headers : {'Content-type' : 'application/json'},
            body : JSON.stringify({title: renameTitle})
        })
        const data = await res.json();

        setLists(prev => 
            prev.map(list => 
                list.id === listId ?
               list.title = data.title
             : list)
        )
      }


      async function addTask(listId , taskId){
        const res = await fetch(`${API_URL}/tasks/${listId}` , {
            method : 'POST' ,
            headers : {'Content-type' : 'application/json'},
            body : JSON.stringify({title : taskTitle})
        })
        const data = await res.json()

        setLists(prev =>
            prev.map(list =>
                list.id === listId ?
                [...prev , (...list , task:data)]
            )
        )
      }
}