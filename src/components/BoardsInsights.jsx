export default function BoardInsights({boards}){

    const totalBoards = boards.length;

    const totalLists = boards.reduce(
        (sum , board) => sum + (board.lists?.length || 0) , 0
    )

    const totalTasks = boards.reduce((sum , board )=>{
        return(
            sum + 
            (board.lists.reduce(
                (listSum , list) => listSum + (list.tasks?.length || 0)
                ,0
            ) || 0)
        );
    },0)
    
    const completedTask = boards.reduce((sum , boards) => {
        return(
            sum +
           (boards.list.reduce((listSum , list) => 
        
            listSum +
           (list.task.filter(t => t.complted).length ,0)
        ),0)
        )
    },0)

    const mostActiveBoard = 
    
    boards.length > 0 
    
    ? boards.reduce((max , board) =>
    (board.lists?.length) > (max.lists.length)
     ? board
     : max)
    :null

    return(
        <div className="boardInsights">
            <div className="insight-card">
                <h3>{totalBoards}</h3>
                <p>Boards</p>
            </div>

            <div className="insight-card">
                <h3>{totalLists}</h3>
                <p>lists</p>
            </div>

            <div className="insight-card">
                <h3>{totalTasks}</h3>
                <p>Tasks</p>
            </div>

            <div className="insight-card">
                
            </div>
        </div>
    )
}