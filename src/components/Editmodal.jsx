export default function EditModal({rename , setRename , handleRename  , setShowlistModal}){
    <div className="edit modal">
        <input 
        value={rename}
        onChange={e => setRename(e.target.value)}
        placeholder="enter a new name"
        />
        <button 
        style={{
            backgroundColor : '#2e2e'
        }}
        onClick={handleRename}
        >Create</button>
        <button onClick={() => setShowlistModal(false)}>Cancel</button>
    </div>
}