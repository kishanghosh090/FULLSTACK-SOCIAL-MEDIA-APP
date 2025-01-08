import toast from "react-hot-toast";
const getMessageError = (message) => {
  toast.error(`${message}`, {
    id: "unique-toast-id",
    duration: 1500,
  });
};
const getMessageSuccess = (message) => {
  toast.success(`${message}`, {
    id: "unique-toast-id",
    duration: 1500,
  });
};
export { getMessageError, getMessageSuccess };
