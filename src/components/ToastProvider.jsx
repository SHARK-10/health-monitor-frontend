import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#363636",
          color: "#fff",
          borderRadius: "12px",
          padding: "12px 16px",
          fontSize: "14px",
        },
        success: {
          style: {
            background: "#10b981",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#10b981",
          },
        },
        error: {
          style: {
            background: "#ef4444",
          },
        },
      }}
    />
  );
}
