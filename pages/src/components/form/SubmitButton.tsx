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
    "flex-1 py-2 px-4 rounded-md transition-colors font-medium min-w-[60px] whitespace-nowrap";

  const typeClass = {
    blue: "bg-cyan-400 hover:bg-cyan-500 focus:ring-cyan-500 disabled:bg-cyan-200 text-cyan-900",
    gray: "bg-gray-500 hover:bg-gray-600 focus:ring-gray-600 disabled:bg-gray-300 text-white",
    red: "bg-red-500 hover:bg-red-600 focus:ring-red-600 disabled:bg-red-300 text-white",
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
