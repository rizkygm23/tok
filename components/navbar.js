import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="lg:px-16 px-4 bg-white flex flex-wrap h-fit items-center py-4 shadow-md sticky top-0 left-0 right-0 z-50">
      <div className="flex-1 flex justify-between items-center">
        <a href="#" className="text-xl">
          CasualWear
        </a>
      </div>
      <button className="pointer-cursor md:hidden block"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg className="fill-current text-gray-900"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20">
          <title>menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
        </svg>
      </button>
      <div className={`${ isMenuOpen ? "block" : "hidden" } md:flex md:items-center md:w-auto w-full transition-all duration-300`}
        >
        <nav>
          <ul className="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
            <li className="hover:underline hover:bg-[#374957] hover:text-white rounded-full w-fit px-3">
              <a className="md:p-4 py-2 px-0 block" href="#bigsale">
                BigSale
              </a>
            </li>
            <li className="hover:underline hover:bg-[#374957] hover:text-white rounded-full w-fit px-3">
              <a className="md:p-4 py-3 px-0 block" href="#bestseller">
                Best Seller
              </a>
            </li>
            <li className="hover:underline hover:bg-[#374957] hover:text-white rounded-full w-fit px-3">
              <a className="md:p-4 py-3 px-0 block" href="#preview">
                Preview
              </a>
            </li>

          </ul>
        </nav>
      </div>
    </nav>
  );
};

export default Header;
