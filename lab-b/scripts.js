class Todo {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('zadania') || '[]');
    this.term = "";
    this.uruchom();
  }

  uruchom() {
    document.getElementById('dodaj').addEventListener('click', () => this.addTask());
    document.getElementById('search_input').addEventListener('input', (e) => {
      this.term = e.target.value;
      this.draw();
    });
    this.draw();
  }

  save() {
    localStorage.setItem('zadania', JSON.stringify(this.tasks));
  }

  addTask() {
    const textInput = document.getElementById('data_input');
    const dateInput = document.getElementById('date_input');
    const text = textInput.value.trim();
    const date = dateInput.value;
    const today = new Date();
    today.setHours(0,0,0,0);

    if (text.length < 3 || text.length > 255) return;
    if (date && new Date(date) < today) return;

    if (!date) {
      alert("Musisz wybrać datę!");
      return;
    }

    this.tasks.push({ text, date });
    this.save();
    this.draw();
    textInput.value = "";
    dateInput.value = "";
  }

  removeTask(index) {
    this.tasks.splice(index, 1);
    this.save();
    this.draw();
  }

  editTask(index, li) {
    const task = this.tasks[index];
    li.innerHTML = `
            <input type="text" value="${task.text}" id="edit_text_${index}">
            <input type="date" value="${task.date}" id="edit_date_${index}">
        `;

    const saveEdit = () => {
      const newText = document.getElementById(`edit_text_${index}`).value;
      const newDate = document.getElementById(`edit_date_${index}`).value;
      const today = new Date();
      today.setHours(0,0,0,0);

      if (
        newText.length >= 3 &&
        newText.length <= 255 &&
        newDate &&
        new Date(newDate) >= today
      ) {
        this.tasks[index] = { text: newText, date: newDate };
        this.save();
      }

      this.draw();
    };

    const inputs = li.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('blur', (e) => {
        if (!li.contains(e.relatedTarget)) saveEdit();
      });
    });
    inputs[0].focus();
  }

  get filteredTasks() {
    if (this.term.length < 2) return this.tasks;
    return this.tasks.filter(t => t.text.toLowerCase().includes(this.term.toLowerCase()));
  }

  highlight(text) {
    if (this.term.length < 2) return text;
    const re = new RegExp(`(${this.term})`, 'gi');
    return text.replace(re, '<mark>$1</mark>');
  }

  draw() {
    const listElement = document.getElementById('taskList');
    listElement.innerHTML = '';

    this.filteredTasks.forEach((task, index) => {
      const li = document.createElement('li');

      const content = document.createElement('span');
      content.innerHTML = `${this.highlight(task.text)} ${task.date ? `(${task.date})` : ''}`;
      content.onclick = () => this.editTask(index, li);

      const btn = document.createElement('button');
      btn.innerText = 'Usuń';
      btn.onclick = (e) => {
        e.stopPropagation();
        this.removeTask(index);
      };

      li.appendChild(content);
      li.appendChild(btn);
      listElement.appendChild(li);
    });
  }
}

document.todo = new Todo();
