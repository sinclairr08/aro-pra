import Link from "next/link";
import Image from "next/image";
import { ContentLayout } from "@/components/layout/ContentLayout";

const Custom401Page = () => {
  return (
    <ContentLayout className="min-h-screen flex flex-col justify-center items-center -mt-4 -mb-8">
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
    </ContentLayout>
  );
};

export default Custom401Page;
