import Link from "next/link";
import Image from "next/image";

const Custom401Page = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="text-center">
        <Image
          src="/imgs/401.png"
          alt="401"
          width={128}
          height={128}
          className="mx-auto mb-6"
        />
        <h1 className="text-xl font-semibold text-red-700 mb-6">
          401 Unauthorized
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

export default Custom401Page;
