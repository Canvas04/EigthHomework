import { Api } from '/lib.js';
const api = new Api('http://localhost:9999')


// api.getJSON('/posts', data => {
//     console.log(data);
// }, error => {
//     console.log(error);
// });

api.postJSON('/posts', { id: 0, content: 'POST' }, data => {
    console.log(data);
}, error => {
    console.log(error);
});

// Likes
api.postJSON('/posts/1/likes', null, data => {
    console.log(data);
}, error => {
    console.log(error);
});
// Dislikes
api.postJSON('/posts/1/likes', null, data => {
    console.log(data);
}, error => {
    console.log(error);
});
const posts = [];
let nextId = 1;

const rootEl = document.getElementById('root');
const formEl = document.createElement('form');
formEl.className = 'form-inline mb-2';

formEl.innerHTML = `
<div class="container">
<div class="row">
    <div class="col">
        <div class="form-group">
            <input type="text" class="form-control mb-2" data-id="url" data-id="content">
            <input type="text" class="form-control mb-2" data-id="text" data-id="content">
            <select class="custom-select mb-2" data-id="type">
                <option value="regular">Обычный</option>
                <option value="image">Изображение</option>
                <option value="audio">Аудио</option>
                <option value="video">Видео</option>
            </select>
            <button class="btn btn-primary mb-2" data-action="add">Ок</button>
        </div>
    </div>
</div>
</div>
`;
const typeEl = formEl.querySelector('[data-id=type]');
const urlEl = formEl.querySelector('[data-id=url]');
const textEl = formEl.querySelector('[data-id=text]');

//Создаем LocalStorage для наших  инпутов
// {
//     url.value = localStorage.getItem('saved');
// }



formEl.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const url = urlEl.value;
    const text = textEl.value;
    const type = typeEl.value;
    const post = {
        id: nextId++,
        url,
        text,
        likes: 0,
        type,
    };
    posts.push(post);
    typeEl.value = 'regular';
    urlEl.value = '';
    textEl.value = '';
    posts.sort((a, b) => {
        return a.likes - b.likes;
    });
    rebuildList(postsEl, posts);
    urlEl.focus();
    api.postJSON('/posts', { id: 0, content: 'POST' }, data => {
        console.log(data);
    }, error => {
        console.log(error);
    });
});

rootEl.appendChild(formEl);

const postsEl = document.createElement('ul');
postsEl.className = 'list-group';

rootEl.appendChild(postsEl);

function rebuildList(containerEl , items) {
    for (const child of Array.from(containerEl.children)) {
        containerEl.removeChild(child);
    }
}