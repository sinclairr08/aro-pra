import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="w-full fixed top-0 p-3 flex items-center text-center bg-gradient-to-r from-cyan-400/90 from-10% via-pink-200/30 via-50% to-[#332c30] text-gray-800 font-bold z-10">
      <Link href="/">
        <span className="mx-4">HOME</span>
      </Link>
    </header>
  );
};

export default Header;
