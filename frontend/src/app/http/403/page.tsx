import Link from "next/link";
import Image from "next/image";

const Custom403Page = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="text-center">
        <Image
          src="/imgs/403.png"
          alt="403"
          width={128}
          height={128}
          className="mx-auto mb-6"
        />
        <h1 className="text-2xl font-semibold text-red-600 mb-6">
          403 Forbidden
        </h1>
      </div>
      <Link
        href="/"
        className="inline-block px-6 py-3 rounded-lg hover:bg-pink-200"
      >
        <Image
          src="/icons/aro-pra-icon.png"
          alt="Logo"
          width={64}
          height={64}
        />
      </Link>
    </div>
  );
};

export default Custom403Page;
