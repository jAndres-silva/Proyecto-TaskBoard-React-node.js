import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './TaskManager.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ description: '', dueDate: '', priority: 'low', category: '' });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    // Aquí podrías cargar las tareas y categorías desde la base de datos o un servicio externo
  }, []);

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = () => {
    if (newTask.description.trim() === '' || newTask.dueDate === '') {
      // Agregar validación para la descripción y la fecha de vencimiento
      alert('Por favor, ingrese una descripción y una fecha de vencimiento válidas.');
      return;
    }
    setTasks([...tasks, { ...newTask, status: 'pending', id: Date.now() }]);
    setNewTask({ description: '', dueDate: '', priority: 'low', category: '' });
  };

  const handleAddCategory = () => {
    if (newCategory.trim() === '') {
      // Agregar validación para la categoría
      alert('Por favor, ingrese un nombre de categoría válido.');
      return;
    }
    setCategories([...categories, newCategory]);
    setNewCategory('');
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const updatedTasks = [...tasks];
    const [removedTask] = updatedTasks.splice(sourceIndex, 1);
    updatedTasks.splice(destinationIndex, 0, removedTask);

    const newStatus =
      result.destination.droppableId === 'pending'
        ? 'pending'
        : result.destination.droppableId === 'inProgress'
        ? 'inProgress'
        : 'completed';
    updatedTasks[destinationIndex] = { ...removedTask, status: newStatus };

    setTasks(updatedTasks);
  };

  return (
    <div className="task-manager">
      <h2>Gestor de Tareas</h2>
      <div className="form-group">
        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={newTask.description}
          onChange={handleInputChange}
          className="form-control"
        />
        <input
          type="date"
          name="dueDate"
          value={newTask.dueDate}
          onChange={handleInputChange}
          className="form-control"
        />
        <select
          name="priority"
          value={newTask.priority}
          onChange={handleInputChange}
          className="form-control"
        >
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
        <button onClick={handleAddTask} className="btn btn-primary">
          Agregar Tarea
        </button>
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Nueva categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="form-control"
        />
        <button onClick={handleAddCategory} className="btn btn-secondary">
          Agregar Categoría
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="task-lists">
          <Droppable droppableId="pending">
            {(provided, snapshot) => (
              <div
                className={`task-list ${
                  snapshot.isDraggingOver ? 'task-list-drag-over' : ''
                }`}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h3 className="task-list-header">Tareas Pendientes</h3>
                {tasks
                  .filter((task) => task.status === 'pending')
                  .map((task, index) => (
                    <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                      {(provided) => (
                        <div
                          className={`task-card task-card-${task.priority}`}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <h4>{task.description}</h4>
                          <p>Fecha de vencimiento: {task.dueDate}</p>
                          <p>Prioridad: {task.priority}</p>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleTaskStatusChange(task.id, 'inProgress')}
                          >
                            Iniciar
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="inProgress">
            {(provided) => (
              <div
                className="task-list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h3>Tareas en Progreso</h3>
                {tasks
                  .filter((task) => task.status === 'inProgress')
                  .map((task, index) => (
                    <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                      {(provided) => (
                        <div
                          className="task-card"
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <h4>{task.description}</h4>
                          <p>Fecha de vencimiento: {task.dueDate}</p>
                          <p>Prioridad: {task.priority}</p>
                          <button
                            className="btn btn-success"
                            onClick={() => handleTaskStatusChange(task.id, 'completed')}
                          >
                            Completar
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="completed">
            {(provided) => (
              <div
                className="task-list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h3>Tareas Completadas</h3>
                {tasks
                  .filter((task) => task.status === 'completed')
                  .map((task, index) => (
                    <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                      {(provided) => (
                        <div
                          className="task-card"
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <h4>{task.description}</h4>
                          <p>Fecha de vencimiento: {task.dueDate}</p>
                          <p>Prioridad: {task.priority}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskManager;
