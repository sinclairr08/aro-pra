import Link from "next/link";

const Header: React.FC = () => {
  return (
    <div className="w-full fixed top-0 p-3 flex items-center text-center bg-cyan-400 text-white font-bold z-10">
      <Link href="/">
        <span className="mx-4">HOME</span>
      </Link>
    </div>
  );
};

export default Header;
