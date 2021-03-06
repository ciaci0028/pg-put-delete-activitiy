$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $(document).on('click', '.deleteBtn', deleteBook);
  $(document).on('click', '.isRead', updateBook);


  // TODO - Add code for edit & delete buttons
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr data-read="${book.isRead}" data-id="${book.id}">
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isRead}</td>
        <td>
          <button class=isRead>
            Completed
          </button>
        </td>
        <td>
          <button class=deleteBtn>
            Delete
          </button>
        </td>
      </tr>
    `);
  }
}

function deleteBook() {
  // Find the book by targeting its ID
  let bookId = $(this).parents('tr').data('id');
  console.log('in deleteBook', bookId);

  // Create ajax request to delete the book
  $.ajax({
    method: 'DELETE',
    url: `/books/${bookId}`,
  })
    .then(() => {
      console.log('delete successful!');
      refreshBooks();
    })
    .catch((err) => {
      console.log('delete failed', err);
      res.sendStatus(500);
    });
}

function updateBook() {
  // Fetching book ID and read status
  let bookID = $(this).parents('tr').data('id');
  let isRead = $(this).parents('tr').data('read');
  
  // Ajax for updating
  $.ajax({
    method: 'PUT',
    url: `/books/${bookID}`,
    data: {
      isRead: true
    }
  })
    .then(() => {
      console.log('update successful');
      refreshBooks();
    })
    .catch((err) => {
      console.log('update failed', err);
      res.sendStatus(500);
    })
  
}
