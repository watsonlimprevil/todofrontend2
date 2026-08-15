export default function Activities({boards}){
    return(
        <div className="actiivitiesSection">
            <ul>
            {boards.map(board => (
                <li>{boards.message} {boards.due_date}</li>
            ))}
            </ul>
        </div>
    )
}

