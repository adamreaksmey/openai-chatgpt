const displayQuiz = async (
  title: string,
  questions: Record<string, string>[],
  askRLineQuestion: any
) => {
  console.log("Quiz:\n", title);
  let responses: string[][] = [];

  for (const question of questions) {
    let response: string[] = [];

    // if multiple choice, print options
    if (question["question_type"] === "MULTIPLE_CHOICE") {
      const rLineQn = `Question: ${question["question_text"]}\n
        Options: ${question["choices"]}\n
        `;

      response = await askRLineQuestion(rLineQn);
    } else if (question["question_type"] === "FREE_RESPONSE") {
      const rLineQn = `Question: ${question["question_text"]}\n
        `;

      response = await askRLineQuestion(rLineQn);
    }

    responses.push(response);
  }
  console.log("Your responses from the quiz:\n", responses);
  return responses;
};

export { displayQuiz };
