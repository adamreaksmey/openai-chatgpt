const statusRun = async (params: any) => {
  let {
    actualRun,
    askRLineQuestion,
    isQuizAnswered,
    openai,
    thread,
    run,
    displayQuiz,
  } = params;
  // Polling mechanism to see if actualRun is completed
  while (
    actualRun.status === "queued" ||
    actualRun.status === "in_progress" ||
    actualRun.status === "requires_action"
  ) {
    if (actualRun.status === "requires_action") {
      // extra single tool call
      const toolCall =
        actualRun.required_action?.submit_tool_outputs?.tool_calls[0];

      const name = toolCall?.function.name;

      const args = JSON.parse(toolCall?.function?.arguments || "{}");
      const questions = args.questions;

      const responses = await displayQuiz(
        name || "cool quiz",
        questions,
        askRLineQuestion
      );

      // toggle flag that sets initial quiz
      isQuizAnswered = true;

      // we must submit the tool outputs to the run to continue
      await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
        tool_outputs: [
          {
            tool_call_id: toolCall?.id,
            output: JSON.stringify(responses),
          },
        ],
      });
    }
    // keep polling until the run is completed
    await new Promise((resolve) => setTimeout(resolve, 2000));
    actualRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  }
};

export { statusRun };
