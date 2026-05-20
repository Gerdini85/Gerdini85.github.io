<?php

/** @var \App\Model\Book $book */
/** @var \App\Service\Router $router */

$title = "Edit Book {$book->getTitle()} ({$book->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('book-edit', ['id' => $book->getId()]) ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
    </form>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('Book-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('Book-delete', ['id' => $book->getId()]) ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
            </form>
        </li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
