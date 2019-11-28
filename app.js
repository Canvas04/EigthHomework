import { Api } from '/lib.js';
// const api = new Api('http://localhost:9999');
const api = new Api('https://expressapisecond.herokuapp.com/posts')

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
let urlEl = formEl.querySelector('[data-id=url]');
let textEl = formEl.querySelector('[data-id=text]');

//Создаем LocalStorage для наших  инпутов
{
    urlEl.value = localStorage.getItem('content');
}

{
    textEl.value = localStorage.getItem('type');
}
urlEl.addEventListener('input', evt => {
    localStorage.setItem('content', evt.currentTarget.value);
    
});

textEl.addEventListener('input', evt => {
    localStorage.setItem('type', evt.currentTarget.value);
});



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
        localStorage.removeItem('content');
        localStorage.removeItem('type');
    }, error => {
        console.log(error);
    });
});

rootEl.appendChild(formEl);

const postsEl = document.createElement('ul');
postsEl.className = 'list-group';

rootEl.appendChild(postsEl);

function rebuildList(containerEl, items) {
    for (const child of Array.from(containerEl.children)) {
        containerEl.removeChild(child);
    };

    for (const item of items) {
        const el = document.createElement('li');
        el.className = 'list-group-item';
        el.dataset.id = `post-${item.id}`;//в 6 проекте были обычные двойные кавычки
        if (item.type === 'image') {
            el.innerHTML = `
<img src="${item.url}" class="rounded" width="100" height="100">
${item.text}
<span class="badge badge-secondary">${item.likes}</span>
<button type="button" class="btn btn-primary btn-sm" data-action="like">like</button>
<button type="button" class="btn btn-primary btn-sm" data-action="dislike">dislike</button>
`;
        } else if (item.type === 'audio') {
            el.innerHTML = `
            <audio src="${item.url}" class="rounded" width="100" height="100" controls></audio>
            ${item.text}
            <span class="badge badge-secondary">${item.likes}</span>
            <button type="button" class="btn btn-primary btn-sm" data-action="like">like</button>
            <button type="button" class="btn btn-primary btn-sm" data-action="dislike">dislike</button>
            `;
        } else if (item.type === 'video') {
            el.innerHTML = `
            <video src="${item.url}" class="rounded" width="100" height="100" controls></video>
            ${item.text} 
            <span class="badge badge-secondary">${item.likes}</span>
            <button type="button" class="btn btn-primary btn-sm" data-action="like">like</button>
            <button type="button" class="btn btn-primary btn-sm" data-action="dislike">dislike</button>
            `;
        } else if (item.type === 'regular') {
            el.innerHTML = `
            <div class="rounded">${item.url}</div>
            ${item.text}
            <span class="badge badge-secondary">${item.likes}</span>
            <button type="button" class="btn btn-primary btn-sm" data-action="like">like</button>
            <button type="button" class="btn btn-primary btn-sm" data-action="dislike">dislike</button>
            `;
        }
        el.querySelector('[data-action=like]').addEventListener('click', evt => {
            item.likes++;
            items.sort((a, b) => {
                return a.likes - b.likes;
            });

            api.postJSON('/posts/1/likes', null, data => {
                console.log(data);
            }, error => {
                console.log(error);
            });
            rebuildList(containerEl, items)
        });
        el.querySelector('[data-action=dislike]').addEventListener('click', evt => {
            item.likes--;
            items.sort((a, b) => {
                return a.likes - b.likes;
            });
            api.deleteJSON('/posts/1/likes', null, data => {
                console.log(data);
            }, error => {
                console.log(error);
            });
            rebuildList(containerEl, items)
        });
        api.getJSON('/posts', data => {
            console.log(data);
        }, error => {
            console.log(error);
        });
        containerEl.insertBefore(el, containerEl.firstElementChild);
    }
}