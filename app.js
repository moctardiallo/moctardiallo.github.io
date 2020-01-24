const comments = document.querySelector('#comments');
const form = document.querySelector('#add-comment-form');

// create element & render comment
function renderComment(doc){
   
    // var element = document.getElementById("myDIV");
    // comments.classList.add("comment-list");

    let li = document.createElement('li');
    li.setAttribute('data-id', doc.id);
    li.classList.add('comment');
        let vcardbio = document.createElement('div');
        vcardbio.classList.add('vcard', 'bio')
            let img = document.createElement('img')
            img.setAttribute('src', 'images/person_1.jpg')
            img.setAttribute('alt', 'Image placeholder')
            vcardbio.appendChild(img)
        li.appendChild(vcardbio)
        let commentBody = document.createElement('div');
            commentBody.classList.add('comment-body')
            let author = document.createElement('h3');
            author.textContent = doc.data().author
            commentBody.appendChild(author)
            let date = document.createElement('div')
            date.classList.add('meta')
            date.textContent = doc.data().date;
            commentBody.appendChild(date)
            let content = document.createElement('p');
            content.textContent = doc.data().content;
            commentBody.appendChild(content)
            let reply_p = document.createElement('p');
                let reply = document.createElement('a');
                reply.setAttribute('href', '#')
                reply.classList.add('reply')
                reply.textContent = 'Reply'
                reply_p.appendChild(reply)
            commentBody.appendChild(reply_p)
        li.appendChild(commentBody)

    let cross = document.createElement('div');

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