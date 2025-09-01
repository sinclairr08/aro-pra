import Link from "next/link";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className="w-full fixed top-0 p-3 flex items-center text-center bg-gradient-to-r from-cyan-400 from-10% via-pink-200 via-50% to-[#332c30] text-gray-800 font-bold z-10">
      <Link href="/">
        <Image
          src="/icons/aro-pra-icon.png"
          alt="Logo"
          width={64}
          height={64}
        />
      </Link>
    </header>
  );
};

export default Header;
