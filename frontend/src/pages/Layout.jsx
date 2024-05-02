import NavBar from "../components/NavBar";

// eslint-disable-next-line react/prop-types
function Layout({ children }) {
  return (
    <div>
      <div>
        <NavBar />
      </div>
      {children}
    </div>
  );
}

export default Layout;
