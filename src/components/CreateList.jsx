export default function CreateList({title ,setTitle , onSave , onClose}){

    return (
        <div className="createlistModal">
            <input 
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="List title"
            />
            <button onClick={onSave}>Save</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    )
}

