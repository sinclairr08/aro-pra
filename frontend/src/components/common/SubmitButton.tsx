interface SubmitButtonProps {
  children: React.ReactNode;
  type: "button" | "submit";
  classType: "blue" | "gray" | "red";
  onClick?: () => void;
  disabled?: boolean;
}

export const SubmitButton = ({
  children,
  type,
  classType,
  onClick,
  disabled = false,
}: SubmitButtonProps) => {
  const baseClass =
    "flex-1 text-white py-2 px-4 rounded-md transition-colors font-medium";

  const typeClass = {
    blue: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-600 disabled:bg-blue-300",
    gray: "bg-gray-500 hover:bg-gray-600 focus:ring-gray-600 disabled:bg-gray-300",
    red: "bg-red-500 hover:bg-red-600 focus:ring-red-600 disabled:bg-red-300",
  };

  const totalClass = `
  ${baseClass} 
  ${typeClass[classType]}
  `.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      className={totalClass}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
