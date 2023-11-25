const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askRLineQuestion = async (question: string) => {
  return new Promise<string>((resolve, _reject) => {
    readline.question(question, (answer: string) => {
      resolve(`${answer}\n`);
    });
  });
};

const debugHello = () => {
    return console.log("Hello world")
}

export { askRLineQuestion, debugHello };
