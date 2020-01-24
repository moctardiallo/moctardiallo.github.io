const comments = document.querySelector('#comments');
const form = document.querySelector('#add-cafe-form');

// create element & render cafe
function renderComment(doc){
    let li = document.createElement('li');
    let author = document.createElement('span');
    let date = document.createElement('span');
    let content = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    author.textContent = doc.data().author;
    date.textContent = doc.data().date;
    content.textContent = doc.data().content;
    cross.textContent = 'x';

    li.appendChild(author);
    li.appendChild(content);
    li.appendChild(date);
    li.appendChild(cross);

    comments.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('comments').doc(id).delete();
    });
}

// getting data
// db.collection('cafes').orderBy('city').get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         renderComment(doc);
//     });
// });

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('comments').add({
        author: form.author.value,
        date: "SEPT. 12, 2019 AT 2:21PM",
        content: form.content.value,
        website: form.website.value,
        email: form.email.value
    });
    form.author.value = '';
    form.content.value = '';
    form.website.value = '';
    form.email.value = '';
});

// Get data 
// real-time listener
db.collection('comments').orderBy('date').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            renderComment(change.doc);
        } else if (change.type == 'removed'){
            let li = comments.querySelector('[data-id=' + change.doc.id + ']');
            comments.removeChild(li);
        }
    });
});

// updating records (console demo)
// db.collection('cafes').doc('DOgwUvtEQbjZohQNIeMr').update({
//     name: 'mario world'
// });

// db.collection('cafes').doc('DOgwUvtEQbjZohQNIeMr').update({
//     city: 'hong kong'
// });

// setting data
// db.collection('cafes').doc('DOgwUvtEQbjZohQNIeMr').set({
//     city: 'hong kong'
// });