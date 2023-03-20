import { EventEmitter } from "events";
import { assert } from "chai";
import { pintAccountantService } from "./pintaccountant-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, aReviewFromMaggie, victoriaHouse } from "../fixtures.js";

EventEmitter.setMaxListeners(25);

suite("Review API tests", () => {
  let user = null;
  let place = null;

  setup(async () => {
    await pintAccountantService.deleteAllReviews();
    await pintAccountantService.deleteAllUsers();
    await pintAccountantService.deleteAllPlaces();
    place = await pintAccountantService.createPlace(victoriaHouse)
    user = await pintAccountantService.createUser(maggie);
    aReviewFromMaggie.user = user._id;
    aReviewFromMaggie.place = place._id
  });

  teardown(async () => {});

  test("create review", async () => {
    const returnedReview = await pintAccountantService.createReview(aReviewFromMaggie);
    assert.isNotNull(returnedReview);
    assertSubset(aReviewFromMaggie, returnedReview);
  });

  test("delete a review", async () => {
    const review = await pintAccountantService.createReview(aReviewFromMaggie);
    const response = await pintAccountantService.deleteReview(review._id);
    try {
      const returnedReview = await pintAccountantService.getReview(review.id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Review with this id", "Incorrect Response Message");
    }
  });
});
