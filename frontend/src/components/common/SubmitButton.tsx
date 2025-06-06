interface SubmitButtonProps {
  children: React.ReactNode;
  type: "button" | "submit";
  classType: "blue" | "gray";
  onClick?: () => void;
}

export const SubmitButton = ({
  children,
  type,
  classType,
  onClick,
}: SubmitButtonProps) => {
  const classes = {
    blue: "flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium",
    gray: "flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors font-medium",
  };

  return (
    <button type={type} onClick={onClick} className={classes[classType]}>
      {children}
    </button>
  );
};
