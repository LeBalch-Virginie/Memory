<?php

namespace App\Entity;

use App\Repository\ScoreRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="score")
 */
class Score
{
	/**
	 * @ORM\Id
	 * @ORM\GeneratedValue
	 * @ORM\Column(type="integer")
	 */
	private $id;

	/**
	 * @ORM\Column(type="integer")
	 */
	private $score;

	/**
	 * @ORM\Column(type="datetime")
	 */
	private $date;

	/**
	 * @return mixed
	 */
	public function getId()
	{
		return $this->id;
	}

	/**
	 * @return mixed
	 */
	public function getScore()
	{
		return $this->score;
	}

	/**
	 * @param mixed $score
	 */
	public function setScore($score): void
	{
		$this->score = $score;
	}

	/**
	 * @return mixed
	 */
	public function getDate()
	{
		return $this->date;
	}

	/**
	 * @param mixed $date
	 */
	public function setDate($date): void
	{
		$this->date = $date;
	}


}