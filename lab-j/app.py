import sqlite3
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)
DATABASE = 'data.db'


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# 1. LISTA KSIĄŻEK (index.html)
@app.route('/')
@app.route('/book')
def book_index():
    conn = get_db_connection()
    books = conn.execute('SELECT * FROM book').fetchall()
    conn.close()
    return render_template('book/index.html', books=books, title='Books List', body_class='index')


# 2. PODGLĄD (show.html)
@app.route('/book/<int:book_id>')
def book_show(book_id):
    conn = get_db_connection()
    book = conn.execute('SELECT * FROM book WHERE id = ?', (book_id,)).fetchone()
    conn.close()
    if book is None:
        return f"Missing book with id {book_id}", 404
    page_title = f"{book['title']} ({book['id']})"
    return render_template('book/show.html', book=book, title=page_title, body_class='show')


# 3. TWORZENIE (create.html)
@app.route('/book/create', methods=['GET', 'POST'])
def book_create():
    if request.method == 'POST':
        # Pobieranie danych pasujących do nazw pól 'book[title]' itd.
        title = request.form.get('book[title]')
        description = request.form.get('book[description]')
        release_date = request.form.get('book[release_date]')

        conn = get_db_connection()
        conn.execute('INSERT INTO book (title, description, release_date) VALUES (?, ?, ?)',
                     (title, description, release_date))
        conn.commit()
        conn.close()
        return redirect(url_for('book_index'))
    return render_template('book/create.html', title='Create Book', body_class='edit')


# 4. EDYCJA (edit.html)
@app.route('/book/edit/<int:book_id>', methods=['GET', 'POST'])
def book_edit(book_id):
    conn = get_db_connection()
    book = conn.execute('SELECT * FROM book WHERE id = ?', (book_id,)).fetchone()

    if book is None:
        conn.close()
        return f"Missing book with id {book_id}", 404

    if request.method == 'POST':
        title = request.form.get('book[title]')
        description = request.form.get('book[description]')
        release_date = request.form.get('book[release_date]')

        conn.execute('UPDATE book SET title = ?, description = ?, release_date = ? WHERE id = ?',
                     (title, description, release_date, book_id))
        conn.commit()
        conn.close()
        return redirect(url_for('book_index'))

    conn.close()
    page_title = f"Edit Book {book['title']} ({book['id']})"
    return render_template('book/edit.html', book=book, title=page_title, body_class='edit')


# 5. USUWANIE
@app.route('/book/delete/<int:book_id>', methods=['POST', 'GET'])
def book_delete(book_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM book WHERE id = ?', (book_id,))
    conn.commit()
    conn.close()
    return redirect(url_for('book_index'))


if __name__ == '__main__':
    app.run(debug=True, port=57701)