"use client";
import { Box, CircularProgress } from "@mui/material";
import React from "react";

export default function LoadingSpinner() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <CircularProgress
        sx={{
          color: "primary.main",
          width: "100px",
          height: "100px",
        }}
        color="secondary"
      />
    </Box>
  );
}
