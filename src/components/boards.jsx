import { useNavigate } from "react-router-dom";
import { useState , useEffect} from "react";
import EditingBoards from "./EditintBoardsModal";
import { API_URL, AuthHeader } from "../api";

export default function boards(){
    const nav = useNavigate()
    const [boards , setBoards] = useState([]);
    const [showEditingModal , setShowEditingModal] = useState(null);
    const [title , setTitle] = useState('');
    const [description , setDescription] = useState('')
    const [createBoardModal , setCreateBoardModal] = useState(false)


    async function addBoard(){
        const res = await fetch(`${API_URL}/boards`, {
            method : 'POST',
            headers : {'Content-type' : 'application/json'},
            ...AuthHeader(),
            body: JSON.stringify({title , description})
         })
        const data = await res.json();
        setBoards(board => [...board , data])
        }

    async function deleteBoard(id){
        const res = await fetch(`${API_URL}/boards/${id}`,{
            method: 'DELETE',
            headers: {'Content-type' : 'application/json'},
            ...AuthHeader(),
        })
        setBoards(prev => prev.filter(p => p.id !== id))
    }


    async function refreshboards(){
        const res = await fetch(`${API_URL}/boards` , {
            headers:{'Content-type' : 'application/json'},
            ...AuthHeader()
        })
        const data = await res.json();
        setBoards(data)
    }

    async function renameBoard(id , board){
        const res = await fetch(`${API_URL}/boards/${id}`, {
            method: 'PATCH',
            headers : {'content-type' : 'application/json'},
            body: JSON.stringify({title})
        })
        refreshboards()
    }


    return(
        <div>
        <div>
            <h2>Your Boards</h2>
             <button onClick={()=> setCreateBoardModal(true)}>Create Board</button>

            {createBoardModal && (
                <div>
                 <input 
                value={description}
                onChange={e => setDescription(e.target.value)}
                />
                   <input 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        />
                        <button style={{backgroundColor : '#1e1e'}} onClick={addBoard}>Create</button>
                        <button style={{backgroundColor : 'red'}} onClick={() => setCreateBoardModal(false)}>Cancel</button>
                    </div>
                    )}
                    </div>
                      {boards.map(board => (
                       <div>
                        <span onClick={ () => nav(`/boards/${board.id}`)}>
                        {board.title}
                         </span>
                         <button onClick={()=> deleteBoard(board.id)}>Delete</button>
                          <button onClick={() => setShowEditingModal(board)}>Edit</button>
                         </div>
                           ))}

                          {showEditingModal && (
                         <EditingBoards 
                         board={showEditingModal}
                          onsave={renameBoard}
                          onclose={() => setShowEditingModal(null)}
                         />
                          )}
           </div>
    )


}