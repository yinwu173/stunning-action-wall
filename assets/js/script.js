// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const id = nextId;
    nextId++; // increment next Id
    localStorage.setItem('nextId', JSON.stringify(nextId)); // save in local storage

    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
        .addClass('card task-card draggable')
        .attr('id', task.id);
    const cardBody = $('<div>').addClass('card-body');
    const cardTitle = $("<h5>").addClass("card-title").text(task.title);
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('id', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);

    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'MM/DD/YYYY');

        // If the task is nearing the deadline (yellow) or is overdue (red)
        if (now.isBefore(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
        }
    }

    // Gather all the elements created above and append them to the correct elements.
    cardBody.append(cardTitle, cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardBody);

    // Return the card so it can be appended to the correct lane.
    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    // Loop through tasks
    for (let task of tasks) {
        let taskCard = createTaskCard(task); // create a task card

        // create task cards for each status
        if (task.status === 'to-do') {
            todoCards.append(taskCard);
        } else if (task.status === 'in-progress') {
            inProgressCards.append(taskCard);
        } else if (task.status === 'done') {
            doneCards.append(taskCard);
        }
    }

    // Use JQuery UI to make task cards draggable
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    // Read user input from the form
    const cardTitle = inputTitle.val().trim();
    const cardDescription = inputDescription.val().trim();
    const cardDueDate = inputDueDate.val().trim();

    if (!inputTitle || !inputDescription || !inputDueDate) {
        alert('You need to fill out the form!');
        return;
    }

    const newTask = {
        id: generateTaskId(),
        title: cardTitle,
        description: cardDescription,
        dueDate: cardDueDate,
        status: 'to-do',
    };

    taskList.push(newTask); // push the new task to the array
    localStorage.setItem('tasks', JSON.stringify(taskList));

    renderTaskList(); // Print task data back to the screen

    // Clear the form inputs
    inputTitle.val()('');
    inputDescription.val()('');
    inputDueDate.val()('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    event.preventDefault();
    const taskId = $(this).attr('data-task-id');

    // Remove task from the array
    tasks = tasks.filter(task => task.id !== taskId);

    // Save the tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(taskList));

    // render tasks back to the screen
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // Get the task id from the event
    const taskId = ui.draggable.dataset.taskId;
    // Get the id of the lane that the card was dropped into
    const newStatus = event.target.id;

    for (let task of tasks) {
        // Find the task card by the `id` and update the task status.
        if (task.id === taskId) {
            task.status = newStatus;
        }
    }
    // Save the updated tasks array to localStorage (overwritting the previous one)
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList(); // render the new task data to the screen
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // render task to the screen on page load if there is any
    renderTaskList();

    $('#taskDueDate').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'mm-dd-yyyy'
    });

    // Make lanes droppable
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
});
