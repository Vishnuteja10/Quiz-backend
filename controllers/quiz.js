const Quiz = require("../models/Quiz");

const setQuizDetails = async (req, res) => {
  try {
    const { quiz, quizName, quizType, timer, userId } = req.body;

    const newQuiz = new Quiz({
      quizName,
      questions: quiz,
      quizType,
      timer,
      impressions: 0,
      userId,
    });
    await newQuiz.save();
    res.status(200).json({
      success: true,
      message: "story added successfully",
      newQuiz,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUsersQuizDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const quizDetails = await Quiz.find({ userId: id });
    if (quizDetails) {
      res.json({ success: true, message: "Quiz details fetched", quizDetails });
    } else {
      res.json({ success: false, errorMessage: "Quiz not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getUsersQuizDetailsImpressions = async (req, res) => {
  try {
    const { id } = req.params;
    const quizDetails = await Quiz.find({ userId: id }).sort({
      impressions: -1,
    });
    if (quizDetails) {
      res.json({ success: true, message: "Quiz details fetched", quizDetails });
    } else {
      res.json({ success: false, errorMessage: "Quiz not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getQuizDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const quizDetails = await Quiz.findById(id);
    quizDetails.impressions = quizDetails.impressions + 1;
    await quizDetails.save();
    if (quizDetails) {
      res.json({ success: true, message: "Quiz details fetched", quizDetails });
    } else {
      res.json({ success: false, errorMessage: "Quiz not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.body;
    const quizDeleted = await Quiz.findByIdAndDelete(quizId);
    if (quizDeleted) {
      res.json({ success: true, message: "Quiz details fetched", quizDeleted });
    } else {
      res.json({ success: false, errorMessage: "Quiz not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { quiz, quizName, quizType, timer, quizId } = req.body;

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      {
        questions: quiz,
        timer: timer,
      },
      { new: true }
    );

    if (updatedQuiz) {
      res.json({ success: true, message: "Quiz details updated", updatedQuiz });
    } else {
      res.json({ success: false, errorMessage: "Quiz not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateQuizWithUserAnswers = async (req, res) => {
  try {
    const { userAnswers, quizId } = req.body;
    let score = 0;
    const quizDetails = await Quiz.findById(quizId);
    if (quizDetails.quizType == "QA") {
      for (let i = 0; i < quizDetails?.questions?.length; i++) {
        if (
          quizDetails?.questions[i].answer == userAnswers[i] ||
          quizDetails?.questions[i].answer == userAnswers[i]?.split(",")[0]
        ) {
          quizDetails.questions[i].correctlyAnswered =
            quizDetails.questions[i].correctlyAnswered + 1;
          score++;
        } else {
          quizDetails.questions[i].wronglyAnswered =
            quizDetails.questions[i].wronglyAnswered + 1;
        }
        quizDetails.questions[i].countAttempted =
          quizDetails.questions[i].countAttempted + 1;
      }
    } else {
      for (let i = 0; i < quizDetails?.questions?.length; i++) {
        const index = userAnswers[i];
        quizDetails.questions[i].optionsCount[index - 1] =
          (quizDetails.questions[i].optionsCount[index - 1] || 0) + 1;
      }
    }
    await quizDetails.save();
    res.status(200).json({ success: true, score });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
module.exports = {
  setQuizDetails,
  getQuizDetails,
  updateQuizWithUserAnswers,
  getUsersQuizDetails,
  updateQuiz,
  deleteQuiz,
  getUsersQuizDetailsImpressions,
};
