```javascript
let tasks = JSON.parse(localStorage.getItem('taskly-v2') || '[]');
let filter = 'all';

const $ = id => document.getElementById(id);

const taskInput = $('taskInput');
const prioritySelect = $('prioritySelect');
const addBtn = $('addBtn');
const taskList = $('taskList');
const emptyState = $('emptyState');
const doneN = $('doneN');
const leftN = $('leftN');
const totalN = $('totalN');
const pct = $('pct');
const barFill = $('barFill');
const clearBtn = $('clearBtn');
const footerMsg = $('footerMsg');
const toast = $('toast');

const taskCounter = $('taskCounter');
const themeBtn = $('themeToggle');

$('dateLine').textContent = new Date().toDateString();

function save(){
localStorage.setItem('taskly-v2',JSON.stringify(tasks));
}

function showToast(msg){
toast.textContent = msg;
toast.classList.add('show');
setTimeout(()=>toast.classList.remove('show'),2000);
}

function addTask(){

const text = taskInput.value.trim();
if(!text) return;

tasks.unshift({
id: Date.now(),
text,
done:false,
priority:prioritySelect.value
});

taskInput.value='';
save();
render();
showToast("Task added");
}

function toggleTask(id){
const t = tasks.find(t=>t.id===id);
t.done = !t.done;
save();
render();
}

function deleteTask(id){

const el = document.querySelector(`[data-id="${id}"]`);

if(el){
el.style.opacity="0";
el.style.transform="translateX(40px)";
}

setTimeout(()=>{
tasks = tasks.filter(t=>t.id!==id);
save();
render();
},300);

}

function clearDone(){
tasks = tasks.filter(t=>!t.done);
save();
render();
}

function render(){

const total = tasks.length;
const done = tasks.filter(t=>t.done).length;
const left = total - done;

doneN.textContent = done;
leftN.textContent = left;
totalN.textContent = total;

taskCounter.textContent = total;

const percent = total ? Math.round(done/total*100) : 0;

pct.textContent = percent + "%";
barFill.style.width = percent + "%";

footerMsg.textContent = total
? (done === total ? "All tasks completed 🎉" : `${left} tasks remaining`)
: "No tasks yet";

const visible = tasks.filter(t=>{
if(filter==="active") return !t.done;
if(filter==="done") return t.done;
if(filter==="high") return t.priority==="high";
return true;
});

taskList.innerHTML='';

visible.forEach(t=>{

const el = document.createElement('div');
el.className="task-item"+(t.done?" done":"");
el.dataset.id = t.id;

el.innerHTML = `
<input type="checkbox" class="task-check" ${t.done ? "checked" : ""}>

<div class="priority-dot p-${t.priority}"></div>

<div class="task-text">${t.text}</div>

<div class="actions">
<button class="action-btn delete">🗑</button>
</div>
`;

el.querySelector('.task-check').addEventListener("change",()=>{
toggleTask(t.id);
});

el.querySelector('.delete').onclick=()=>deleteTask(t.id);

taskList.appendChild(el);

});

emptyState.style.display = visible.length ? "none" : "block";

}

addBtn.onclick = addTask;

taskInput.addEventListener('keypress',e=>{
if(e.key==="Enter") addTask();
});

clearBtn.onclick = clearDone;

document.querySelectorAll('.filter-btn').forEach(btn=>{
btn.onclick = ()=>{
filter = btn.dataset.filter;

document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
btn.classList.add('active');

render();
};
});

document.getElementById("resetApp").addEventListener("click",()=>{

localStorage.removeItem("taskly-v2");
tasks=[];
render();
showToast("App reset");

});

themeBtn.onclick = ()=>{

document.body.classList.toggle("light");

if(document.body.classList.contains("light")){
themeBtn.textContent="☀️";
}else{
themeBtn.textContent="🌙";
}

};

document.addEventListener("keydown",e=>{
if(e.key==="Enter" && document.activeElement!==taskInput){
taskInput.focus();
}
});

render();
```
