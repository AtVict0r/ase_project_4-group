import React, { useState } from "react";
import { ListGroup, Badge, Button, Form } from "react-bootstrap";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const Review = ({ reviews, onAddReview, user, onShowLogin }) => {
  const [showForm, setShowForm] = useState(false);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddReview(reviewText);
    setReviewText("");
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
