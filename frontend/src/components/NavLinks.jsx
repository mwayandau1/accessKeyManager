import { NavLink } from "react-router-dom";

const links = [
  { id: 1, url: "/home", text: "home" },
  { id: 2, url: "/search-key", text: "search key" },
  { id: 3, url: "/schools", text: "schools" },
];

const NavLinks = () => {
  return (
    <>
      {links.map((link) => {
        const { id, url, text } = link;
        return (
          <li key={id}>
            <NavLink className="capitalize text-black" to={url}>
              {text}
            </NavLink>
          </li>
        );
      })}
    </>
  );
};
export default NavLinks;
