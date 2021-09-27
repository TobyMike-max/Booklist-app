// Book Class: Represents a Book
class Book {
constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}
}
// UI Class: Handles UI Task

class UI {
    static displayBooks(){
        const books = Store.getBooks();

        books.forEach(book => UI.addBookToList(book));
    };


    static addBookToList(book){
        const tableBody = document.querySelector('#book-list');

        const rowData = document.createElement('tr');
        rowData.innerHTML = `<td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href = "#" class = "btn btn-danger btn-sm delete">X</a></td>`;

        tableBody.appendChild(rowData);
    }

    static showAlert(message, className){

        // Create a div tag
        const div = document.createElement('div');

        // Add class to div element
        div.className = `alert alert-${className}`;

        //  append textNode
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanishes within 3 seconds
        setTimeout(()=> document.querySelector('.alert').remove(), 
        3000);
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }
}

// Store Class: Handles Storage

class Store{
    static getBooks(){
        let books;

        // 'books' = key
        if(localStorage.getItem('books') === null){
            books = [];
        } else{
            // receiving books from localStorage, you parse it
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();

        // Adding book to the books[] Array
        books.push(book);

        // Sending books to localStorage, you first stringify
        // localStorage.setItem('key', 'value')
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks)


// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) =>{

    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;


    // Validate
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill in all fields', 'danger');
    }   else    {

    // Instantiate book
    const book = new Book(title, author, isbn);

    // Add book to UI. Generates the value of the Inputs to the UI
    UI.addBookToList(book);

    // Add book to Store
    Store.addBook(book);

    // Show success message
    UI.showAlert('Book Added', 'success');

    // Clear fields
    UI.clearFields();
    // document.querySelector('#title').value = '';
    // document.querySelector('#author').value = '';
    // document.querySelector('#isbn').value = '';
    }
});

// Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);

    // Remove book from UI
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show success message
    UI.showAlert('Book Removed', 'success');

});
