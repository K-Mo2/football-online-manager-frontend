import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function AlertComponent({
  alertType,
  message,
}: {
  alertType: string;
  message: string;
}) {
  return (
    <Stack sx={{ width: "100%", marginY: 2 }} spacing={2}>
      {alertType == "success" && (
        <Alert
          variant="filled"
          severity="success"
          sx={{ fontSize: 15, fontWeight: 900 }}
        >
          {message}
        </Alert>
      )}

      {alertType == "error" && (
        <Alert
          variant="filled"
          severity="error"
          sx={{ fontSize: 15, fontWeight: 900 }}
        >
          {message}
        </Alert>
      )}
    </Stack>
  );
}
