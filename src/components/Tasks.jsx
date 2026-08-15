export default function Tasks({task , deletetasks , cancel}){
return (
    <div 
    className="tasklists"
    >
        <span>
            {task.title}
            <button onClick={deletetasks}>❌</button>
            <button onClick={cancel}>Cancel</button>
        </span>
    </div>
)
}