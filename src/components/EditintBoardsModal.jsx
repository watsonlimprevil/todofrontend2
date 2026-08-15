import { useState } from "react";

export default function EditingBoards({board ,  onsave , onclose}){
   const [title , setTitle] = useState(board.title);

   return(
    <div className="modal-overlay">
        <div className="modal-content"></div>
        <h2>Edit Board</h2>

         <input
         type="text"
         value={title}
         onChange={e => setTitle(e.target.value)}
         className="modal-input"
          />
        <div className="modal-btn">
            <button className="save-btn"
            onClick={() => onsave(board.id)}
            >
                Save
            </button>

            <button className="cancel-btn" onClick={onclose}>
                Cancel
            </button>
        </div>
    </div>
   )
}