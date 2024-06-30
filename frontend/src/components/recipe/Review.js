import React, { useState } from "react";
import { ListGroup, Badge, Button, Form } from "react-bootstrap";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const Review = ({ reviews, onAddReview, user, onShowLogin }) => {
  const [showForm, setShowForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [like, setLike] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!reviewText || like === null) { 
      setError("Please fill out all fields."); 
      return;
    }
    const review = {
      userId: user.id,
      username: user.username,
      comment: reviewText,
      like: like
    };
    onAddReview(review);
    setReviewText("");
    setLike(null);
    setError("");
    setShowForm(false);
  };

  return (
    <div>
      <h3>Reviews</h3>
      <ListGroup>
        {reviews.map((review, index) => (
          <ListGroup.Item key={index}>
            <h5>
              {review.username}{" "}
              {review.like ? (
                <Badge variant="success">
                  <FaThumbsUp />
                </Badge>
              ) : (
                <Badge variant="danger">
                  <FaThumbsDown />
                </Badge>
              )}
            </h5>
            <p>{review.comment}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
      {user ? (
        <>
          <Button onClick={() => setShowForm(!showForm)}>Add Review</Button>
          {showForm && (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Do you like this recipe?</Form.Label>
                <div>
                <Form.Check
                  type="radio"
                  label={<FaThumbsUp />}
                  name="like"
                  value="true"
                  checked={like === true}
                  onChange={(e) => setLike(true)}
                />
                <Form.Check
                  type="radio"
                  label={<FaThumbsDown />}
                  name="like"
                  value="false"
                  checked={like === false}
                  onChange={(e) => setLike(false)}
                />
                </div>
              </Form.Group>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          )}
        </>
      ) : (
        <Button onClick={onShowLogin}>Log in to add a review</Button>
      )}
    </div>
  );
};

export default Review;
