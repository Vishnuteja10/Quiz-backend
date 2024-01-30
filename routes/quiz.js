const express = require("express");

const router = express.Router();

const {
  setQuizDetails,
  getQuizDetails,
  updateQuizWithUserAnswers,
  getUsersQuizDetails,
  getUsersQuizDetailsImpressions,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quiz");

router.route("/setQuizDetails").post(setQuizDetails);
router.route("/getQuizDetails/:id").get(getQuizDetails);
router.route("/updateQuizDetails").post(updateQuizWithUserAnswers);
router.route("/getUserQuizDetails/:id").get(getUsersQuizDetails);
router
  .route("/getUserQuizDetailsImpressions/:id")
  .get(getUsersQuizDetailsImpressions);
router.route("/updateQuiz").put(updateQuiz);
router.route("/deleteQuiz").delete(deleteQuiz);
module.exports = router;
