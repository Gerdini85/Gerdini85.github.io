<?php
    /** @var $book ?\App\Model\Book */
?>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="book[title]" value="<?= $book ? $book->getTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="book[description]"><?= $book ? $book->getDescription() : '' ?></textarea>
</div>

<div class="form-group">
    <label for="release_date">Release Date</label>
    <input type="date" id="release_date" name="book[release_date]" value="<?= $book ? $book->getReleaseDate() : '' ?>">
</div>

<div class="form-group">
    <input type="submit" value="Submit">
</div>