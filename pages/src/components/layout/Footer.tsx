const Footer: React.FC = () => {
  return (
    <footer className="w-full fixed bottom-0 bg-gradient-to-r from-cyan-400 from-10% via-pink-200 via-50% to-[#332c30] p-3 flex flex-col text-center text-xs text-gray-800 z-10 shadow-lg">
      <span>© 2025. aro-pra</span>
      <span>
        이 페이지는 넥슨 게임즈의 공식 서비스가 아니며, 모든 리소스의 저작권은
        저작권자에게 있습니다
      </span>
    </footer>
  );
};

export default Footer;
