import { TbBrandGithub, TbAddressBook, TbBrandLinkedin } from "react-icons/tb";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center">
      <p className="text-md text-slate-400">
        Created by Mohammed Abdulla
      </p>

      <div className="flex space-x-4">
        {/* GitHub icon link */}
        <a
          href="https://github.com/moe1011"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-violet-300 transition-colors text-2xl"
        >
          <TbBrandGithub />
        </a>

        {/* Portfolio link icon */}
        <a
          href="https://moe1011.github.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-green-300 transition-colors text-2xl"
        >
          <TbAddressBook  />
        </a>

        {/* LinkedIn link icon */}
        <a
          href="https://www.linkedin.com/in/mohammed-s-abdulla/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-blue-300 transition-colors text-2xl"
        >
          <TbBrandLinkedin />
        </a>
      </div>
    </footer>
  )
}