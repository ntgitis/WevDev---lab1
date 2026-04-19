import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Divider,
  Button,
} from "@mui/material";
import { useParams, Link, useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos({ advancedFeature, setTopBarContext }) {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetchModel(`/user/${userId}`),
      fetchModel(`/photosOfUser/${userId}`),
    ])
      .then(([userRes, photosRes]) => {
        if (isMounted) {
          setUser(userRes.data);
          setPhotos(photosRes.data);
          if (setTopBarContext) {
            setTopBarContext(
              `Photos of ${userRes.data.first_name} ${userRes.data.last_name}`,
            );
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching user photos view data:", err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userId, setTopBarContext]);

  if (loading || !user) {
    return <Typography>Loading photos...</Typography>;
  }

  if (photos.length === 0) {
    return <Typography>No photos found for this user.</Typography>;
  }

  const currentIndex = photoId ? photos.findIndex((p) => p._id === photoId) : 0;
  const currentPhoto = photos[currentIndex !== -1 ? currentIndex : 0];

  const goNext = () => {
    if (currentIndex < photos.length - 1) {
      navigate(`/photos/${userId}/${photos[currentIndex + 1]._id}`);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      navigate(`/photos/${userId}/${photos[currentIndex - 1]._id}`);
    }
  };

  const renderPhoto = (photo) => (
    <Card variant="outlined" key={photo._id} style={{ marginBottom: "20px" }}>
      <CardHeader
        title={new Date(photo.date_time).toLocaleString()}
        subheader={`By ${user.first_name} ${user.last_name}`}
      />
      <CardMedia
        component="img"
        image={require(`../../images/${photo.file_name}`)}
        alt={photo.file_name}
      />
      <CardContent>
        <Typography variant="h6">Comments:</Typography>
        <Divider style={{ margin: "10px 0" }} />
        {photo.comments && photo.comments.length > 0 ? (
          photo.comments.map((c) => (
            <div key={c._id} style={{ marginBottom: "10px" }}>
              <Typography variant="body2" color="textSecondary">
                {new Date(c.date_time).toLocaleString()} -{" "}
                <Link to={`/users/${c.user._id}`}>
                  {c.user.first_name} {c.user.last_name}
                </Link>
              </Typography>
              <Typography variant="body1">{c.comment}</Typography>
            </div>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No comments yet.
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div>
      {advancedFeature ? (
        <>
          {renderPhoto(currentPhoto)}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              disabled={currentIndex === 0}
              onClick={goPrev}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              disabled={currentIndex === photos.length - 1}
              onClick={goNext}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        photos.map((p) => renderPhoto(p))
      )}
    </div>
  );
}

export default UserPhotos;
