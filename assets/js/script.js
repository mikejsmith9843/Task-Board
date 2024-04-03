// // Retrieve tasks and nextId from localStorage
// let taskList = JSON.parse(localStorage.getItem("tasks"));
// let nextId = JSON.parse(localStorage.getItem("nextId"));

// // Todo: create a function to generate a unique task id
// function generateTaskId() {

// }

// // Todo: create a function to create a task card
// function createTaskCard(task) {

// }

// // Todo: create a function to render the task list and make cards draggable
// function renderTaskList() {

// }

// // Todo: create a function to handle adding a new task
// function handleAddTask(event){

// }

// // Todo: create a function to handle deleting a task
// function handleDeleteTask(event){

// }

// // Todo: create a function to handle dropping a task into a new status lane
// function handleDrop(event, ui) {

// }

// // Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
// $(document).ready(function () {

// });

const timeDisplayEl = $(`#time-display`);
const projectDisplayEl = $(`#project-display`);
const projectFormEl = $(`#project-form`);
const projectNameInputEl = $(`#project-name-input`);
const projectTypeInputEl = $(`#project-type-input`);
const projectDateIputEl = $(`#taskDueDate`);

function displayTime() {
    const rightnow = day.js().format('MMM DD, YYYY [at] hh:mm:ss a');
    timeDisplayEl.text(rightnow);
}

function readProjectsFromStorage () {
    let projects = JSON.parse(localStorage.getItem('projects'));

    if (!projects) {
        projects = [];
    }
    return projects;
};

function saveProjectsToStorage(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
}

function createProjectsCard(project) {
    const taskCard = $('<div>')
    .addClass('card project-card draggable my-3')
    .attr('data project-id', project.id);
const cardHeader = $('<div>').addClass('card-header h4').text(project.name);
const cardBody = $('<div>').addClass('card-body');
const cardDescription = $('<p>').addClass('card-text').text(project.type);
const cardDueDate = $('<p>').addClass('card-text').text(project.dueDate);
const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-project-id', project.id);
cardDeleteBtn.on('click', handleDeleteProject);

if (project.dueDate && project.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(project.dueDate, 'DD/MM,YYYY');

    if (now.isSame(taskDueDate, 'day')) {
        taskCard.addClass('bg-warning text-white');
    }else if (now.isAfter(taskDueDate)) {
        taskCard.addClass('bg-danger text-white');
        cardDeleteBtn.addClass('border-light');
    }
}
cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
taskCard.append(cardHeader, cardBody);

return taskCard;
}

function printProjectData() {
    const projects = readProjectsFromStorage();

    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    for (let project of projects) {
        if (project.status === 'to-do') {
            todoList.append(createProjectsCard(project));
        }else if (project.status === 'done') {
            inProgressList.append(createProjectsCard(project));
        }else if (project.status === 'done') {
            doneList.append(createProjectsCard(project));
        }
    }

    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
            ? $(e.target)
            : $(e.target).closest('ui-draggable');

            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

function handleDeleteProject() {
    const projectId = $(this).attr('data-project-id');
    const projects = readProjectsFromStorage();

    projects.forEach((project) => {
        if (project.id === projectId) {
            projects.splice(projects.indexOf(project), 1);
        }
    });

    saveProjectsToStorage(projects);
    printProjectData();
}

function handleProjectFormSubmit(event) {
    event.preventDefault();
    const projectName = projectNameInputEl.val().trim();
    const projectType = projectTypeInputEl.val();
    const projectDate = projectDateIputEl.val();

    const newProject = {
        name: projectName,
        type: projectType,
        dueDate: projectDate,
        status: 'to-do'
    };

    const projects = readProjectsFromStorage();
    projects.push(newProject);

    saveProjectsToStorage(projects);

    printProjectData();

    projectNameInputEl.val('');
    projectTypeInputEl.val('');
    projectDateIputEl.val('');
}

function handleDrop(event, ui) {
    const projects = readProjectsFromStorage();
    const taskId = ui.draggable[0].data.set.projectId;
    const newStatus = event.target.id;

    for (let project of projects) {
        if (project.id === taskId) {
            project.status = newStatus;
        }
    }

    localStorage.setItem('projects', JSON.stringify(projects));
    printProjectData();
}

projectFormEl.on('submit', handleProjectFormSubmit);

displayTime();
setInterval(displayTime, 1000);

$(document).ready(function () {
    printProjectData();

    $('#taskDueDate').datepicker({
        changeMonth: true,
        changeYear: true,
    });

    $('lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
});