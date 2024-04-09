import { useState, useEffect } from 'react'
function App() {
  // const [toDos, settoDos] = useState([])

  const [toDos, settoDos] = useState(() => {
    const savedToDos = localStorage.getItem('toDos');
    return savedToDos ? JSON.parse(savedToDos) : [];
  });

  const [completed, setCompleted] = useState(() => {
    const savedCompleted = localStorage.getItem('completed');
    return savedCompleted ? JSON.parse(savedCompleted) : [];
  });

  const [inputValue, setInputValue] = useState('');


  useEffect(() => {
    // Store toDos state in localStorage whenever it changes
    localStorage.setItem('toDos', JSON.stringify(toDos));
  }, [toDos]);

  useEffect(() => {
    // Store completed state in localStorage whenever it changes
    localStorage.setItem('completed', JSON.stringify(completed));
  }, [completed]);

  const DATE_OPTIONS = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric' };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const onEnter = (e) => {
    if (e.key === 'Enter') {
      addItem()
    }
  }
  const addItem = () => {
    if (inputValue != '') {
      settoDos([...toDos, { name: inputValue, date: (new Date()).toLocaleDateString('en-US', DATE_OPTIONS) }])
      setInputValue('');
    }
  };

  const updateTask = (i) => {
    // console.log('hello world')
    const updatedName = prompt('Update the task name:', toDos[i].name)
    const updatedDate = (new Date()).toLocaleDateString('en-US', DATE_OPTIONS)
    if (updatedName !== '' && updatedName !== null {
      toDos[i].name = updatedName
      toDos[i].date = updatedDate
    }
    settoDos([...toDos])
  }

  const deleteItem = (i) => {
    if (confirm('Are you sure')) {
      const updatedToDo = toDos.filter((_, index) => index !== i);
      settoDos(updatedToDo)
    }
  };

  const deleteAll = () => {
    if (confirm('Are you sure')) {
      settoDos([])
    }
  };

  const deleteAllCompleted = () => {
    if (confirm('Are you sure')) {
      setCompleted([])
    }
  };

  var move = function (array, element, delta) {
    // Moves an item up or down
    var index = array.indexOf(element);
    var newIndex = index + delta;
    if (newIndex < 0 || newIndex == array.length) return; //Already at the top or bottom.
    var indexes = [index, newIndex].sort(); //Sort the indixes
    array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]); //Replace from lowest index, two elements, reverting the order
  };

  const handleMoveup = (i) => {
    move(toDos, toDos[i], -1);
    settoDos([...toDos])
  }

  const handleMoveDown = (i) => {
    move(toDos, toDos[i], 1);
    settoDos([...toDos])

  }
  let newCompleted = []

  const handleCompleted = (i) => {
    const completedToDo = toDos[i]
    const updatedDate = (new Date()).toLocaleDateString('en-US', DATE_OPTIONS)
    toDos[i].date = updatedDate

    newCompleted = [completedToDo, ...newCompleted, ...completed]
    setCompleted(newCompleted)

    // Removing the item from the list
    const updatedToDo = toDos.filter((_, index) => index !== i);
    settoDos(updatedToDo)
  }

  let newToDo = []

  const handleUncomplete = (i) => {
    const unCompletedToDo = completed[i]
    newToDo = [...toDos, unCompletedToDo]

    settoDos(newToDo)

    // Removing the item from the list
    const updatedToDo = completed.filter((_, index) => index !== i);
    setCompleted(updatedToDo)
  }

  return (
    <>
      <div className='ToDoList'>
        <h1>To Do List</h1>
        <input label="Enter Task" variant="standard"
          type="text"
          value={inputValue}
          placeholder='Enter Task'
          onChange={handleInputChange}
          onKeyDown={onEnter} />

        <button className='addItem' onClick={addItem} >Add Item</button >
        <button className='deleteAll' onClick={deleteAll} >Delete All</button >

        {toDos.map((item, i) =>
          <ol key={i}> {item.name}
            <button onClick={() => deleteItem(i)}> ❌ </button>
            <button onClick={() => updateTask(i)}> ✏️ </button>
            <button onClick={() => handleMoveup(i)}> ⬆️ </button>
            <button onClick={() => handleMoveDown(i)}> ⬇️ </button>
            <button onClick={() => handleCompleted(i)}> ✅ </button>
            <p className='start-date'>Last edit: {item.date}</p>
          </ol>)
        }
        {(completed.length != 0) &&
          <>
            < h2 > Completed Tasks</h2>
            <button className='deleteAll' onClick={deleteAllCompleted} >Delete All Completed</button >
          </>
        }
        {
          completed.map((item, i) =>
            <ol key={i} >{item.name}
              <button onClick={() => handleUncomplete(i)}> Uncomplete </button>
              <p className='complete-date'>Completed on: {item.date}</p>
            </ol>

          )
        }
      </div >
    </>
  )
}

export default App
