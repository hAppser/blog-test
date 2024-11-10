export const convertImageToBase64 = (
  file: File,
  setImageBase64: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    setImageBase64(reader.result as string);
  };
  reader.readAsDataURL(file);
};
