const FRUIT_BULLETS = ['🍓', '🥝', '🍌', '🍒', '🍐', '🍑', '🍊'];

function updateLinks() {
  chrome.storage.local.get('readingStack', function (result) {
    const readingStack = result.readingStack;
    const list = document.querySelector('.article-list');
    list.innerHTML = '';

    if (readingStack.length == 0) {
      const li = document.createElement('li');
      li.setAttribute('class', 'article-list-item');
      li.textContent = 'Good work, there\'s nothing left to read. Now go eat some pancakes.'
      list.appendChild(li);
    }

    readingStack.forEach((item, index) => {
      const li = document.createElement('li');
      li.setAttribute('class', 'article-list-item');

      const bullet = document.createElement('i');
      bullet.textContent = FRUIT_BULLETS[index];
      
      const link = document.createElement('a');
      link.setAttribute('class', 'article-list-item__link');
      link.setAttribute('href', item.url);
      link.textContent = item.title;

      const dateAddedEl = getDateAdded(item.dateAdded);

      const div = document.createElement('div');
      div.append(bullet);
      div.appendChild(link);
      div.appendChild(dateAddedEl);

      const removeBtn = getRemoveBtn(readingStack, item);

      li.appendChild(div);
      li.appendChild(removeBtn);

      list.appendChild(li);
    });
  });
}

function getDateAdded(date) {
  const dateAdded = moment.utc(date);
  const today = moment();
  const dateAddedEl = document.createElement('p');

  dateAddedEl.setAttribute('class', 'article-list-item__date');
  dateAddedEl.textContent = 'Added ' + dateAdded.from(today);

  return dateAddedEl;
}

function getRemoveBtn(readingStack, item) {
  const removeBtn = document.createElement('button');
  removeBtn.setAttribute('class', 'article-list-item__remove-btn');
  removeBtn.addEventListener('click', () => removeLink(readingStack, item));
  removeBtn.textContent = 'Remove';

  return removeBtn;
}

function removeLink(readingStack, item) {
  const filtered = readingStack.filter((link) => link != item);
  chrome.storage.local.set({ readingStack: filtered }, function () {
    updateLinks();
    console.log(`Successfully removed ${item}`);
  });
}

updateLinks();
