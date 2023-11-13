import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import "./HomePage.css";

export default function HomePage() {
  return (
    <Stack className="homePageCon" spacing={2}>
      <Typography
        className="header"
        variant="h3"
        component="div"
        sx={{ flexGrow: 1 }}
      >
        &#128008; Welcome to the Furry Friend Finder &#128021;
      </Typography>
      <Typography
        className="sub-header"
        variant="h7"
        component="div"
        sx={{ flexGrow: 1 }}
      >
        Go ahead and sign up to adopt your pet today!
      </Typography>{" "}
      <Typography
        className="sub-header"
        variant="h7"
        component="div"
        sx={{ flexGrow: 1 }}
      >
        Or go ahead and help an animal who needs to be rescued.
      </Typography>{" "}
    </Stack>
  );
}
