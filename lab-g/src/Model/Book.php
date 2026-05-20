<?php
//coppy $books $bookArray
namespace App\Model;

use App\Service\Config;

class Book
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $description = null;
    private ?string $releaseDate = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Book
    {
        $this->id = $id;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): Book
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): Book
    {
        $this->description = $description;
        return $this;
    }

    public function getReleaseDate(): ?string
    {
        return $this->releaseDate;
    }

    public function setReleaseDate(?string $releaseDate): Book
    {
        $this->releaseDate = $releaseDate;
        return $this;
    }

    public static function fromArray($array): Book
    {
        $books = new self();
        $books->fill($array);

        return $books;
    }

    public function fill($array): Book
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }
        if (isset($array['release_date'])) {
            $this->setReleaseDate($array['release_date']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM book';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $books = [];
        $booksArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($booksArray as $bookArray) {
            $books[] = self::fromArray($bookArray);
        }

        return $books;
    }

    public static function find($id): ?Book
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM book WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $bookArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $bookArray) {
            return null;
        }
        $books = Book::fromArray($bookArray);

        return $books;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO book (title, description, release_date) VALUES (:title, :description, :release_date)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':title' => $this->getTitle(),
                ':description' => $this->getDescription(),
                ':release_date' => $this->getReleaseDate(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE book SET title = :title, description = :description, release_date = :release_date WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':title' => $this->getTitle(),
                ':description' => $this->getDescription(),
                ':release_date' => $this->getReleaseDate(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM book WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setTitle(null);
        $this->setDescription(null);
        $this->setReleaseDate(null);
    }
}