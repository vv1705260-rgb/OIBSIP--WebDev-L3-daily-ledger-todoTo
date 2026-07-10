(function () {
  var STORAGE_KEY = 'daily-ledger-tasks';
  var tasks = [];

  var pendingList = document.getElementById('pending-list');
  var completedList = document.getElementById('completed-list');
  var pendingCount = document.getElementById('pending-count');
  var completedCount = document.getElementById('completed-count');
  var input = document.getElementById('new-task-input');
  var addBtn = document.getElementById('add-task-btn');

  var dateEl = document.getElementById('today-date');
  var now = new Date();
  dateEl.textContent = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  function uid() {
    return 't-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  function fmtTime(ts) {
    if (!ts) return '';
    var d = new Date(ts);
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }

  function loadTasks() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Could not read tasks from localStorage', e);
      tasks = [];
    }
    render();
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Could not save tasks to localStorage', e);
    }
  }

  function addTask() {
    var text = input.value.trim();
    if (!text) return;
    tasks.unshift({
      id: uid(),
      text: text,
      completed: false,
      createdAt: Date.now(),
      completedAt: null
    });
    input.value = '';
    saveTasks();
    render();
  }

  function toggleComplete(id) {
    var task = tasks.find(function (t) { return t.id === id; });
    if (!task) return;
    task.completed = !task.completed;
    task.completedAt = task.completed ? Date.now() : null;
    saveTasks();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    saveTasks();
    render();
  }

  function startEdit(id) {
    var task = tasks.find(function (t) { return t.id === id; });
    if (!task) return;
    task._editing = true;
    render();
  }

  function commitEdit(id, value) {
    var task = tasks.find(function (t) { return t.id === id; });
    if (!task) return;
    var trimmed = value.trim();
    if (trimmed) task.text = trimmed;
    task._editing = false;
    saveTasks();
    render();
  }

  function cancelEdit(id) {
    var task = tasks.find(function (t) { return t.id === id; });
    if (!task) return;
    task._editing = false;
    render();
  }

  function taskNode(task) {
    var li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' completed' : '');

    var stampBtn = document.createElement('button');
    stampBtn.className = 'stamp-btn' + (task.completed ? ' done' : '');
    stampBtn.setAttribute('aria-label', task.completed ? 'Mark pending' : 'Mark complete');
    stampBtn.addEventListener('click', function () { toggleComplete(task.id); });
    li.appendChild(stampBtn);

    var body = document.createElement('div');
    body.className = 'task-body';

    if (task._editing) {
      var editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.className = 'edit-input';
      editInput.value = task.text;
      editInput.maxLength = 200;
      body.appendChild(editInput);
      setTimeout(function () { editInput.focus(); editInput.select(); }, 0);
      editInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') commitEdit(task.id, editInput.value);
        if (e.key === 'Escape') cancelEdit(task.id);
      });
      editInput.addEventListener('blur', function () { commitEdit(task.id, editInput.value); });
    } else {
      var textDiv = document.createElement('div');
      textDiv.className = 'task-text';
      var span = document.createElement('span');
      span.className = 'strike';
      span.textContent = task.text;
      textDiv.appendChild(span);
      body.appendChild(textDiv);

      var meta = document.createElement('div');
      meta.className = 'task-meta';
      var metaText = 'added ' + fmtTime(task.createdAt);
      if (task.completed && task.completedAt) {
        metaText += ' · completed ' + fmtTime(task.completedAt);
      }
      meta.textContent = metaText;
      body.appendChild(meta);
    }

    li.appendChild(body);

    var actions = document.createElement('div');
    actions.className = 'task-actions';

    if (!task._editing) {
      var editBtn = document.createElement('button');
      editBtn.className = 'icon-btn edit';
      editBtn.setAttribute('aria-label', 'Edit task');
      editBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';
      editBtn.addEventListener('click', function () { startEdit(task.id); });
      actions.appendChild(editBtn);
    }

    var delBtn = document.createElement('button');
    delBtn.className = 'icon-btn delete';
    delBtn.setAttribute('aria-label', 'Delete task');
    delBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>';
    delBtn.addEventListener('click', function () { deleteTask(task.id); });
    actions.appendChild(delBtn);

    li.appendChild(actions);
    return li;
  }

  function render() {
    var pending = tasks.filter(function (t) { return !t.completed; });
    var completed = tasks.filter(function (t) { return t.completed; });

    pendingCount.textContent = pending.length + ' pending';
    completedCount.textContent = completed.length + ' completed';

    pendingList.innerHTML = '';
    if (pending.length === 0) {
      var e1 = document.createElement('div');
      e1.className = 'empty-state';
      e1.textContent = 'Nothing pending — log a task above to get started.';
      pendingList.appendChild(e1);
    } else {
      pending.forEach(function (t) { pendingList.appendChild(taskNode(t)); });
    }

    completedList.innerHTML = '';
    if (completed.length === 0) {
      var e2 = document.createElement('div');
      e2.className = 'empty-state';
      e2.textContent = 'Nothing closed out yet — completed tasks land here.';
      completedList.appendChild(e2);
    } else {
      completed.forEach(function (t) { completedList.appendChild(taskNode(t)); });
    }
  }

  addBtn.addEventListener('click', addTask);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addTask();
  });

  loadTasks();
})();
