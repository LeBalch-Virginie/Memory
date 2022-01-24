<?php

namespace App\Controller;

use App\Entity\Score;
use App\Repository\ScoreRepository;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
	#[Route('/', name: 'index')]
	public function index()
	{
		return $this->render('default/index.html.twig', []);
	}

	#[Route('/api/score', name: 'saveScore', methods: 'post')]
	public function saveScore(Request $request, EntityManagerInterface $entityManager)
	{
		$data = json_decode($request->getContent());
		//Create the current date
		$today = date("Y-m-d H:i:s");
		// transform to dateTime
		$dateJour = new DateTime($today);
		// create new score and set score and date
		$score = new Score();
		$score->setScore($data->time);
		$score->setDate($dateJour);
		// save in database ( bdd)
		$entityManager->persist($score);
		$entityManager->flush();
		return new Response('Great', Response::HTTP_OK);
	}

	#[Route('/api/topTen', name: 'topTen')]
	public function getTopTen(ScoreRepository $scoreRepository)
	{
		// call a request for select only the top ten
		$scores = $scoreRepository->findByTopScores();
		return $this->json($scores);
	}
}